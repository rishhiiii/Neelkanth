import { sendEmail } from '../utils/email.js';
import {
  welcomeEmail,
  orderConfirmationEmail,
  orderStatusEmail,
  abandonedCartEmail,
} from './emailTemplates.js';
import logger from '../utils/logger.js';

async function safeSend(to, template) {
  try {
    await sendEmail({ to, subject: template.subject, text: template.text, html: template.html });
  } catch (err) {
    logger.error(`Notification failed (${template.subject}) to ${to}: ${err.message}`);
  }
}

export async function sendWelcome(email, name) {
  const tpl = welcomeEmail(name);
  await safeSend(email, tpl);
}

export async function sendOrderConfirmation(email, order) {
  const tpl = orderConfirmationEmail(order);
  await safeSend(email, tpl);
}

export async function sendOrderStatusUpdate(email, order, newStatus) {
  const tpl = orderStatusEmail(order, newStatus);
  await safeSend(email, tpl);
}

export async function sendAbandonedCartReminder(email, userName, items, cartTotal) {
  const tpl = abandonedCartEmail(userName, items, cartTotal);
  await safeSend(email, tpl);
}
