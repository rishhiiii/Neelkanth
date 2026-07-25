import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from './logger.js';

/**
 * Nodemailer transporter — created once, reused across the process.
 * In development, emails are logged to console if SMTP credentials are
 * placeholder values (allows running without a real mail server).
 */
let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  return transporter;
}

/**
 * Send an email. Templates are intentionally minimal for now — Module 11
 * (notifications) will build the full template system.
 *
 * @param {{ to: string, subject: string, text: string, html?: string }} opts
 */
export async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: env.smtpFrom,
    to,
    subject,
    text,
    html: html || text,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
    throw err;
  }
}

/**
 * Send an email-verification OTP.
 */
export async function sendVerificationOtp(email, otp) {
  return sendEmail({
    to: email,
    subject: 'Verify your email — Neelkanth Global Wellness',
    text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p><p>If you didn't create an account, please ignore this email.</p>`,
  });
}

/**
 * Send a password-reset email with a token link.
 */
export async function sendPasswordResetEmail(email, resetToken) {
  // In production, this would be a frontend URL. For now, include the raw token.
  const resetUrl = `${env.frontendUrl}/reset-password?token=${resetToken}`;
  return sendEmail({
    to: email,
    subject: 'Reset your password — Neelkanth Global Wellness',
    text: `You requested a password reset.\n\nUse this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Click here to reset your password</a></p><p>This link expires in 1 hour.</p><p>If you didn't request this, please ignore this email.</p>`,
  });
}
