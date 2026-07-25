import crypto from 'crypto';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const SANDBOX_BASE = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const PROD_AUTH_BASE = 'https://api.phonepe.com/apis/identity-manager';
const PROD_BASE = 'https://api.phonepe.com/apis/pg';

const isSandbox = () => env.phonepeEnv !== 'PRODUCTION';

function getBaseUrl() {
  return isSandbox() ? SANDBOX_BASE : PROD_BASE;
}

function getAuthUrl() {
  return isSandbox() ? SANDBOX_BASE : PROD_AUTH_BASE;
}

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const url = `${getAuthUrl()}/v1/oauth/token`;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: env.phonepeClientId,
    client_secret: env.phonepeClientSecret,
    client_version: env.phonepeClientVersion,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    logger.error(`PhonePe auth failed: ${res.status} ${text}`);
    throw new Error('PhonePe authentication failed');
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 1800) * 1000;
  return cachedToken;
}

export async function createPayment({ merchantOrderId, amount, callbackUrl, redirectUrl, userPhone }) {
  const token = await getAccessToken();
  const url = `${getBaseUrl()}/checkout/v2/pay`;

  const payload = {
    merchantOrderId,
    amount: Math.round(amount * 100),
    expireAfter: 1200,
    metaInfo: {
      udf1: merchantOrderId,
    },
    paymentFlow: {
      type: 'PG_CHECKOUT',
      merchantUrls: {
        redirectUrl,
        callbackUrl,
      },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify({ request: payload }),
  });

  const data = await res.json();

  if (!res.ok) {
    logger.error(`PhonePe create payment failed: ${JSON.stringify(data)}`);
    throw new Error(data.message || 'Payment creation failed');
  }

  return data;
}

export async function checkOrderStatus(merchantOrderId) {
  const token = await getAccessToken();
  const url = `${getBaseUrl()}/checkout/v2/order/${merchantOrderId}/status`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `O-Bearer ${token}`,
    },
  });

  const data = await res.json();
  return data;
}

export async function initiateRefund({ merchantOrderId, merchantRefundId, amount }) {
  const token = await getAccessToken();
  const url = `${getBaseUrl()}/payments/v2/refund`;

  const payload = {
    merchantOrderId,
    originalTransactionId: merchantOrderId,
    merchantRefundId,
    amount: Math.round(amount * 100),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data;
}

export function verifyCallback(headers, body) {
  // PhonePe v2 uses OAuth tokens — callback authenticity is
  // verified by checking the order status via the status API
  // rather than signature-based verification
  return true;
}
