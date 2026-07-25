import mongoose from 'mongoose';
import { Product, Order, Counter, Cart, User } from '../models/index.js';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import * as phonepeService from './phonepeService.js';
import { generateOtp, hashOtp, verifyOtp } from '../utils/otp.js';
import { sendEmail } from '../utils/email.js';

const SHIPPING_FREE_THRESHOLD = 1000;
const SHIPPING_FEE = 160;

function round2(n) {
  return Math.round(n * 100) / 100;
}

function getFYKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const fyStart = month >= 4 ? year : year - 1;
  return `invoice-${fyStart}-${String(fyStart + 1).slice(2)}`;
}

function formatOrderNumber(seq) {
  return `NGW-${String(seq).padStart(6, '0')}`;
}

function formatInvoiceNumber(fyKey, seq) {
  const fy = fyKey.replace('invoice-', '');
  return `INV/${fy}/${String(seq).padStart(5, '0')}`;
}

function buildOrderItems(cartItems, products) {
  return cartItems.map((ci) => {
    const p = products.find((pr) => pr._id.toString() === ci.product.toString());
    if (!p) throw ApiError.badRequest(`Product not found: ${ci.product}`);

    const unitPrice = p.price;
    const gstRate = p.gstRate;
    const taxableAmount = round2(unitPrice / (1 + gstRate / 100));
    const taxAmount = round2(unitPrice - taxableAmount);
    const lineTotal = round2(unitPrice * ci.quantity);
    const lineTaxable = round2(taxableAmount * ci.quantity);
    const lineTax = round2(taxAmount * ci.quantity);

    return {
      product: p._id,
      name: p.name,
      sku: p.sku,
      hsnCode: p.hsnCode,
      packSize: p.packSize || '',
      quantity: ci.quantity,
      unitPrice,
      gstRate,
      taxableAmount: lineTaxable,
      taxAmount: lineTax,
      lineTotal,
    };
  });
}

function computeTotals(items, buyerState) {
  const sellerState = env.sellerState;
  const isIntra = buyerState.toLowerCase() === sellerState.toLowerCase();
  const taxType = isIntra ? 'intra_state' : 'inter_state';

  const subtotal = round2(items.reduce((s, i) => s + i.taxableAmount, 0));
  const taxTotal = round2(items.reduce((s, i) => s + i.taxAmount, 0));

  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  if (isIntra) {
    cgstTotal = round2(taxTotal / 2);
    sgstTotal = round2(taxTotal - cgstTotal);
  } else {
    igstTotal = taxTotal;
  }

  const grossTotal = round2(items.reduce((s, i) => s + i.lineTotal, 0));
  const shippingFee = grossTotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = round2(grossTotal + shippingFee);

  return { subtotal, shippingFee, taxType, cgstTotal, sgstTotal, igstTotal, taxTotal, grandTotal };
}

async function decrementStock(items, session) {
  for (const item of items) {
    const result = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true, session }
    );

    if (!result) {
      throw ApiError.badRequest(`Insufficient stock for ${item.name}`);
    }

    if (result.stock === 0 && result.status === 'active') {
      result.status = 'out_of_stock';
      await result.save({ session });
    }
  }
}

async function restoreStock(items) {
  for (const item of items) {
    const result = await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } },
      { new: true }
    );

    if (result && result.status === 'out_of_stock' && result.stock > 0) {
      result.status = 'active';
      await result.save();
    }
  }
}

export async function placeOrder({ userId, paymentMethod, shippingAddress }) {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  const productIds = cart.items.map((i) => i.product._id || i.product);
  const products = await Product.find({ _id: { $in: productIds }, status: { $in: ['active', 'out_of_stock'] } });

  if (products.length !== cart.items.length) {
    throw ApiError.badRequest('Some products are unavailable');
  }

  let address = shippingAddress;
  if (!address) {
    const user = await User.findById(userId);
    if (!user?.address?.line1) {
      throw ApiError.badRequest('Shipping address is required');
    }
    address = user.address.toObject();
    if (!address.phone && user.phone) address.phone = user.phone;
  }

  if (!address.name || !address.line1 || !address.city || !address.state || !address.pincode) {
    throw ApiError.badRequest('Incomplete shipping address');
  }

  const cartItems = cart.items.map((i) => ({
    product: (i.product._id || i.product).toString(),
    quantity: i.quantity,
  }));

  const orderItems = buildOrderItems(cartItems, products);
  const totals = computeTotals(orderItems, address.state);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await decrementStock(orderItems, session);

    const orderSeq = await Counter.getNextSequence('order');
    const fyKey = getFYKey();
    const invoiceSeq = await Counter.getNextSequence(fyKey);

    const orderNumber = formatOrderNumber(orderSeq);
    const invoiceNumber = formatInvoiceNumber(fyKey, invoiceSeq);

    const order = new Order({
      orderNumber,
      user: userId,
      invoiceNumber,
      invoiceDate: new Date(),
      items: orderItems,
      ...totals,
      shippingAddress: {
        name: address.name,
        phone: address.phone || '',
        line1: address.line1,
        line2: address.line2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    await order.save({ session });

    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

export async function initiatePhonepePayment(order) {
  const callbackUrl = env.phonepeCallbackUrl || `${env.frontendUrl}/api/v1/orders/payment/callback`;
  const redirectUrl = `${env.frontendUrl}/orders/${order.orderNumber}?payment=status`;

  const result = await phonepeService.createPayment({
    merchantOrderId: order.orderNumber,
    amount: order.grandTotal,
    callbackUrl,
    redirectUrl,
    userPhone: order.shippingAddress.phone,
  });

  order.phonepe = {
    merchantTransactionId: order.orderNumber,
    state: 'INITIATED',
  };
  await order.save();

  return result;
}

export async function handlePaymentCallback(merchantOrderId) {
  const order = await Order.findOne({ orderNumber: merchantOrderId });
  if (!order) throw ApiError.notFound('Order not found');

  const status = await phonepeService.checkOrderStatus(merchantOrderId);

  const paymentState = status?.state || status?.data?.state;

  if (paymentState === 'COMPLETED') {
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.phonepe = {
      ...order.phonepe?.toObject?.() || {},
      transactionId: status?.data?.transactionId || status?.transactionId || '',
      providerReferenceId: status?.data?.providerReferenceId || '',
      amount: status?.data?.amount || order.grandTotal * 100,
      state: 'COMPLETED',
      paidAt: new Date(),
      raw: status,
    };
    order.statusHistory.push({ status: 'confirmed', note: 'Payment successful via PhonePe' });
    await order.save();
    return { success: true, order };
  }

  if (paymentState === 'FAILED') {
    order.paymentStatus = 'failed';
    order.phonepe = {
      ...order.phonepe?.toObject?.() || {},
      state: 'FAILED',
      raw: status,
    };
    await order.save();
    await restoreStock(order.items);
    return { success: false, order };
  }

  return { success: false, pending: true, order };
}

export async function sendCodOtp(orderId, userId) {
  const order = await Order.findOne({ _id: orderId, user: userId, paymentMethod: 'cod' });
  if (!order) throw ApiError.notFound('COD order not found');
  if (order.isCodConfirmed) throw ApiError.badRequest('Already confirmed');

  const user = await User.findById(userId);
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  user.emailOtp = otpHash;
  user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.emailOtpAttempts = 0;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: `Confirm your COD order ${order.orderNumber} — Neelkanth Global Wellness`,
    text: `Your COD confirmation code is: ${otp}\n\nOrder: ${order.orderNumber}\nTotal: ₹${order.grandTotal}\n\nThis code expires in 10 minutes.`,
    html: `<p>Your COD confirmation code is: <strong>${otp}</strong></p><p>Order: ${order.orderNumber}<br>Total: ₹${order.grandTotal}</p><p>This code expires in 10 minutes.</p>`,
  }).catch(() => {});

  return { message: 'OTP sent to your email' };
}

export async function verifyCodOtp(orderId, userId, otp) {
  const order = await Order.findOne({ _id: orderId, user: userId, paymentMethod: 'cod' });
  if (!order) throw ApiError.notFound('COD order not found');
  if (order.isCodConfirmed) throw ApiError.badRequest('Already confirmed');

  const user = await User.findById(userId).select('+emailOtp');
  if (!user.emailOtp || !user.emailOtpExpiresAt || user.emailOtpExpiresAt < new Date()) {
    throw ApiError.badRequest('OTP expired. Please request a new one.');
  }
  if (user.emailOtpAttempts >= 5) {
    throw ApiError.badRequest('Too many attempts. Please request a new OTP.');
  }

  const valid = await verifyOtp(otp, user.emailOtp);
  if (!valid) {
    user.emailOtpAttempts += 1;
    await user.save();
    throw ApiError.badRequest('Invalid OTP');
  }

  user.emailOtp = undefined;
  user.emailOtpExpiresAt = undefined;
  user.emailOtpAttempts = 0;
  await user.save();

  order.isCodConfirmed = true;
  order.codConfirmedAt = new Date();
  order.status = 'confirmed';
  order.paymentStatus = 'pending';
  order.statusHistory.push({ status: 'confirmed', note: 'COD OTP verified' });
  await order.save();

  return order;
}

export async function getOrderByNumber(orderNumber, userId) {
  const order = await Order.findOne({ orderNumber, user: userId });
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

export async function checkPaymentStatus(orderNumber) {
  const order = await Order.findOne({ orderNumber });
  if (!order) throw ApiError.notFound('Order not found');

  if (order.paymentMethod === 'phonepe' && order.paymentStatus === 'pending') {
    const result = await handlePaymentCallback(orderNumber);
    return result.order;
  }

  return order;
}
