import PDFDocument from 'pdfkit';
import env from '../config/env.js';

const SELLER = {
  name: 'Neelkanth Global Wellness',
  gstin: () => env.sellerGstin || 'GSTIN PENDING',
  state: () => env.sellerState,
  address: 'Rajasthan, India',
};

function round2(n) {
  return Math.round(n * 100) / 100;
}

function formatCurrency(v) {
  return `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function generateInvoicePdf(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const isIntra = order.taxType === 'intra_state';
    const pageW = doc.page.width - 80;

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('TAX INVOICE', { align: 'center' });
    doc.moveDown(0.3);

    // Seller info
    doc.fontSize(10).font('Helvetica-Bold').text(SELLER.name);
    doc.font('Helvetica').fontSize(8);
    doc.text(`GSTIN: ${SELLER.gstin()}`);
    doc.text(`State: ${SELLER.state()}`);
    doc.text(SELLER.address);
    doc.moveDown(0.5);

    // Invoice details line
    doc.font('Helvetica-Bold').fontSize(9);
    const topY = doc.y;
    doc.text(`Invoice No: ${order.invoiceNumber}`, 40, topY);
    doc.text(`Date: ${formatDate(order.invoiceDate)}`, 40 + pageW / 2, topY);
    doc.moveDown(0.2);
    doc.text(`Order No: ${order.orderNumber}`, 40);
    doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`, 40 + pageW / 2, doc.y - 11);
    doc.moveDown(0.8);

    // Buyer
    doc.font('Helvetica-Bold').fontSize(9).text('Bill To / Ship To:');
    doc.font('Helvetica').fontSize(8);
    const addr = order.shippingAddress;
    doc.text(addr.name);
    doc.text(`${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}`);
    doc.text(`${addr.city}, ${addr.state} - ${addr.pincode}`);
    if (addr.phone) doc.text(`Phone: ${addr.phone}`);
    doc.moveDown(0.8);

    // Table header
    const cols = {
      sno: { x: 40, w: 25, label: '#' },
      desc: { x: 65, w: 140, label: 'Description' },
      hsn: { x: 205, w: 55, label: 'HSN' },
      qty: { x: 260, w: 30, label: 'Qty' },
      rate: { x: 290, w: 60, label: 'Rate' },
      taxable: { x: 350, w: 65, label: 'Taxable' },
      gst: { x: 415, w: 40, label: 'GST%' },
      tax: { x: 455, w: 50, label: 'Tax' },
      total: { x: 505, w: 50, label: 'Total' },
    };

    const hdrY = doc.y;
    doc.font('Helvetica-Bold').fontSize(7);
    doc.rect(40, hdrY - 2, pageW, 14).fill('#f0f0f0').stroke('#cccccc');
    doc.fillColor('#000000');

    Object.values(cols).forEach((c) => {
      doc.text(c.label, c.x + 2, hdrY + 1, { width: c.w - 4, align: c === cols.desc ? 'left' : 'right' });
    });

    doc.y = hdrY + 16;

    // Table rows
    doc.font('Helvetica').fontSize(7);
    order.items.forEach((item, i) => {
      const rowY = doc.y;
      if (rowY > 720) {
        doc.addPage();
      }
      const y = doc.y;

      doc.text(String(i + 1), cols.sno.x + 2, y, { width: cols.sno.w - 4, align: 'right' });
      doc.text(`${item.name}${item.packSize ? ' (' + item.packSize + ')' : ''}`, cols.desc.x + 2, y, { width: cols.desc.w - 4 });
      doc.text(item.hsnCode, cols.hsn.x + 2, y, { width: cols.hsn.w - 4, align: 'right' });
      doc.text(String(item.quantity), cols.qty.x + 2, y, { width: cols.qty.w - 4, align: 'right' });
      doc.text(formatCurrency(item.unitPrice), cols.rate.x + 2, y, { width: cols.rate.w - 4, align: 'right' });
      doc.text(formatCurrency(item.taxableAmount), cols.taxable.x + 2, y, { width: cols.taxable.w - 4, align: 'right' });
      doc.text(`${item.gstRate}%`, cols.gst.x + 2, y, { width: cols.gst.w - 4, align: 'right' });
      doc.text(formatCurrency(item.taxAmount), cols.tax.x + 2, y, { width: cols.tax.w - 4, align: 'right' });
      doc.text(formatCurrency(item.lineTotal), cols.total.x + 2, y, { width: cols.total.w - 4, align: 'right' });

      doc.y = y + 14;
    });

    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(40 + pageW, doc.y).stroke('#cccccc');
    doc.moveDown(0.5);

    // Totals
    const rightX = 380;
    const valX = 470;
    doc.font('Helvetica').fontSize(8);

    const addLine = (label, value) => {
      doc.text(label, rightX, doc.y, { width: 85, align: 'right' });
      doc.text(formatCurrency(value), valX, doc.y - 10, { width: 85, align: 'right' });
      doc.moveDown(0.2);
    };

    addLine('Taxable Amount:', order.subtotal);

    if (isIntra) {
      addLine('CGST:', order.cgstTotal);
      addLine('SGST:', order.sgstTotal);
    } else {
      addLine('IGST:', order.igstTotal);
    }

    addLine('Shipping:', order.shippingFee);

    doc.moveDown(0.2);
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Grand Total:', rightX, doc.y, { width: 85, align: 'right' });
    doc.text(formatCurrency(order.grandTotal), valX, doc.y - 12, { width: 85, align: 'right' });

    doc.moveDown(1.5);
    doc.font('Helvetica').fontSize(7).fillColor('#666666');
    doc.text('This is a computer-generated invoice and does not require a signature.', 40, doc.y, { align: 'center' });
    doc.text('Thank you for your purchase — Neelkanth Global Wellness', { align: 'center' });

    doc.end();
  });
}
