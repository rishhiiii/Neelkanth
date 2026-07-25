import { Order } from '../models/index.js';
import { generateInvoicePdf } from '../services/invoiceService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const downloadInvoice = asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;

  const filter = { orderNumber };
  if (req.user) filter.user = req.user._id;

  const order = await Order.findOne(filter).lean();
  if (!order) throw ApiError.notFound('Order not found');

  if (order.paymentStatus !== 'paid' && order.status !== 'delivered') {
    throw ApiError.badRequest('Invoice available only for paid/delivered orders');
  }

  const pdfBuffer = await generateInvoicePdf(order);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=Invoice-${order.invoiceNumber.replace(/\//g, '-')}.pdf`,
    'Content-Length': pdfBuffer.length,
  });

  res.send(pdfBuffer);
});

export const adminDownloadInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) throw ApiError.notFound('Order not found');

  const pdfBuffer = await generateInvoicePdf(order);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=Invoice-${order.invoiceNumber.replace(/\//g, '-')}.pdf`,
    'Content-Length': pdfBuffer.length,
  });

  res.send(pdfBuffer);
});
