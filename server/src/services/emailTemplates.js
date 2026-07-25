import env from '../config/env.js';

const BRAND = 'Neelkanth Global Wellness';
const SITE_URL = () => env.frontendUrl;

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v);
}

function wrap(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:24px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:100%">
<tr><td style="background:#1a5632;padding:20px 24px;text-align:center">
<span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px">${BRAND}</span>
</td></tr>
<tr><td style="padding:28px 24px 24px">
${body}
</td></tr>
<tr><td style="background:#f9fafb;padding:16px 24px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb">
<p style="margin:0">${BRAND} &mdash; Ayurvedic Products for Natural Health</p>
<p style="margin:4px 0 0"><a href="${SITE_URL()}" style="color:#1a5632;text-decoration:none">ngwellness.in</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function heading(text) {
  return `<h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600">${text}</h2>`;
}

function para(text) {
  return `<p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6">${text}</p>`;
}

function button(url, label) {
  return `<table cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td style="background:#1a5632;border-radius:6px;padding:12px 28px">
<a href="${url}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:600">${label}</a>
</td></tr></table>`;
}

function divider() {
  return '<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">';
}

// ── Welcome ──────────────────────────────────────────────

export function welcomeEmail(name) {
  const body = [
    heading('Welcome to Neelkanth Global Wellness!'),
    para(`Hi ${name},`),
    para('Thank you for creating your account. You now have access to our full range of Ayurvedic wellness products.'),
    para('Browse our catalog, add items to your wishlist, and enjoy a seamless shopping experience.'),
    button(SITE_URL(), 'Start Shopping'),
    para('If you have any questions, feel free to reach out to us.'),
  ].join('');

  return {
    subject: `Welcome to ${BRAND}!`,
    html: wrap(`Welcome to ${BRAND}`, body),
    text: `Hi ${name},\n\nWelcome to ${BRAND}! Thank you for creating your account.\n\nStart shopping: ${SITE_URL()}\n\nIf you have any questions, feel free to reach out to us.`,
  };
}

// ── Order Confirmation ───────────────────────────────────

export function orderConfirmationEmail(order) {
  const itemRows = order.items
    .map(
      (item) => `<tr>
<td style="padding:8px 4px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6">${item.name}${item.packSize ? ` (${item.packSize})` : ''}</td>
<td style="padding:8px 4px;font-size:13px;color:#374151;text-align:center;border-bottom:1px solid #f3f4f6">${item.quantity}</td>
<td style="padding:8px 4px;font-size:13px;color:#374151;text-align:right;border-bottom:1px solid #f3f4f6">${formatCurrency(item.lineTotal)}</td>
</tr>`
    )
    .join('');

  const addr = order.shippingAddress;
  const addressStr = `${addr.name}, ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;

  const body = [
    heading('Order Confirmed!'),
    para(`Your order <strong>${order.orderNumber}</strong> has been placed successfully.`),
    divider(),
    `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
<thead><tr>
<th style="padding:8px 4px;font-size:12px;color:#6b7280;text-align:left;border-bottom:2px solid #e5e7eb">Item</th>
<th style="padding:8px 4px;font-size:12px;color:#6b7280;text-align:center;border-bottom:2px solid #e5e7eb">Qty</th>
<th style="padding:8px 4px;font-size:12px;color:#6b7280;text-align:right;border-bottom:2px solid #e5e7eb">Amount</th>
</tr></thead>
<tbody>${itemRows}</tbody>
</table>`,
    `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
<tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Subtotal</td><td style="padding:4px 0;font-size:13px;color:#374151;text-align:right">${formatCurrency(order.subtotal + order.taxTotal)}</td></tr>
<tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Shipping</td><td style="padding:4px 0;font-size:13px;color:#374151;text-align:right">${order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</td></tr>
<tr><td style="padding:8px 0 4px;font-size:15px;font-weight:700;color:#111827;border-top:2px solid #e5e7eb">Total</td><td style="padding:8px 0 4px;font-size:15px;font-weight:700;color:#111827;text-align:right;border-top:2px solid #e5e7eb">${formatCurrency(order.grandTotal)}</td></tr>
</table>`,
    divider(),
    para(`<strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (PhonePe)'}`),
    para(`<strong>Delivery to:</strong> ${addressStr}`),
    button(`${SITE_URL()}/orders/${order.orderNumber}`, 'View Order'),
    para('We will notify you when your order is shipped.'),
  ].join('');

  const textItems = order.items.map((i) => `  ${i.name} x${i.quantity} — ${formatCurrency(i.lineTotal)}`).join('\n');

  return {
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: wrap('Order Confirmation', body),
    text: `Order Confirmed!\n\nOrder: ${order.orderNumber}\n\nItems:\n${textItems}\n\nTotal: ${formatCurrency(order.grandTotal)}\nPayment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (PhonePe)'}\nDelivery to: ${addressStr}\n\nTrack your order: ${SITE_URL()}/orders/${order.orderNumber}`,
  };
}

// ── Order Status Update ──────────────────────────────────

const STATUS_MESSAGES = {
  confirmed: { title: 'Order Confirmed', message: 'Your order has been confirmed and is being prepared.' },
  processing: { title: 'Order Being Processed', message: 'Your order is being packed and will be shipped soon.' },
  shipped: { title: 'Order Shipped!', message: 'Your order has been dispatched.' },
  delivered: { title: 'Order Delivered', message: 'Your order has been delivered successfully.' },
  cancelled: { title: 'Order Cancelled', message: 'Your order has been cancelled.' },
};

export function orderStatusEmail(order, newStatus) {
  const info = STATUS_MESSAGES[newStatus] || { title: 'Order Update', message: `Your order status is now: ${newStatus}.` };

  let trackingBlock = '';
  if (newStatus === 'shipped' && order.trackingNumber) {
    trackingBlock = [
      divider(),
      para(`<strong>Courier:</strong> ${order.courier || 'Standard'}`),
      para(`<strong>Tracking Number:</strong> ${order.trackingNumber}`),
    ].join('');
  }

  const body = [
    heading(info.title),
    para(`Hi, here's an update on your order <strong>${order.orderNumber}</strong>.`),
    para(info.message),
    trackingBlock,
    button(`${SITE_URL()}/orders/${order.orderNumber}`, 'View Order Details'),
    divider(),
    para(`<strong>Order Total:</strong> ${formatCurrency(order.grandTotal)}`),
  ].join('');

  let text = `${info.title}\n\nOrder: ${order.orderNumber}\n${info.message}\n`;
  if (newStatus === 'shipped' && order.trackingNumber) {
    text += `\nCourier: ${order.courier || 'Standard'}\nTracking: ${order.trackingNumber}\n`;
  }
  text += `\nView order: ${SITE_URL()}/orders/${order.orderNumber}`;

  return {
    subject: `${info.title} — ${order.orderNumber}`,
    html: wrap(info.title, body),
    text,
  };
}

// ── Abandoned Cart Reminder ──────────────────────────────

export function abandonedCartEmail(userName, items, cartTotal) {
  const itemList = items
    .map(
      (item) => `<tr>
<td style="padding:8px 4px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6">${item.name}${item.packSize ? ` (${item.packSize})` : ''}</td>
<td style="padding:8px 4px;font-size:13px;color:#374151;text-align:center;border-bottom:1px solid #f3f4f6">${item.quantity}</td>
<td style="padding:8px 4px;font-size:13px;color:#374151;text-align:right;border-bottom:1px solid #f3f4f6">${formatCurrency(item.price * item.quantity)}</td>
</tr>`
    )
    .join('');

  const body = [
    heading('You left something behind!'),
    para(`Hi ${userName},`),
    para('It looks like you have items waiting in your cart. Complete your purchase before they go out of stock.'),
    divider(),
    `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
<thead><tr>
<th style="padding:8px 4px;font-size:12px;color:#6b7280;text-align:left;border-bottom:2px solid #e5e7eb">Item</th>
<th style="padding:8px 4px;font-size:12px;color:#6b7280;text-align:center;border-bottom:2px solid #e5e7eb">Qty</th>
<th style="padding:8px 4px;font-size:12px;color:#6b7280;text-align:right;border-bottom:2px solid #e5e7eb">Price</th>
</tr></thead>
<tbody>${itemList}</tbody>
</table>`,
    para(`<strong>Cart Total: ${formatCurrency(cartTotal)}</strong>`),
    button(`${SITE_URL()}/cart`, 'Complete Your Purchase'),
  ].join('');

  const textItems = items.map((i) => `  ${i.name} x${i.quantity}`).join('\n');

  return {
    subject: `Your cart is waiting — ${BRAND}`,
    html: wrap('Complete Your Purchase', body),
    text: `Hi ${userName},\n\nYou have items waiting in your cart:\n${textItems}\n\nCart Total: ${formatCurrency(cartTotal)}\n\nComplete your purchase: ${SITE_URL()}/cart`,
  };
}
