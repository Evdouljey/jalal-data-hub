import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.BILALSADASUB_API_KEY;
const baseURL = process.env.BILALSADASUB_BASE_URL || 'https://bilalsadasub.com/api';
const endpointConfig = {
  data: process.env.BILALSADASUB_DATA_PATH || '/data',
  airtime: process.env.BILALSADASUB_AIRTIME_PATH || '/airtime',
  electricity: process.env.BILALSADASUB_ELECTRICITY_PATH || '/electricity',
  cable: process.env.BILALSADASUB_CABLE_PATH || '/cable-tv',
};

const client = axios.create({
  baseURL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: apiKey ? `Bearer ${apiKey}` : undefined,
    'X-API-Key': apiKey || '',
  },
});

const log = (message, details = {}) => {
  console.info(`[BilalSadaSub] ${message}`, JSON.stringify(details));
};

const buildError = (error) => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail;
    const message = responseMessage || error.message || 'BilalSadaSub request failed';
    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status || 502;
    normalizedError.details = error.response?.data;
    return normalizedError;
  }

  const normalizedError = new Error(error.message || 'BilalSadaSub request failed');
  normalizedError.status = 502;
  return normalizedError;
};

const normalizePayload = (kind, payload) => {
  const safePayload = payload || {};

  if (kind === 'data') {
    return {
      api_key: apiKey,
      phone: safePayload.phone,
      mobile: safePayload.phone,
      amount: safePayload.amount,
      plan: safePayload.plan,
      package: safePayload.plan,
      ...safePayload,
    };
  }

  if (kind === 'airtime') {
    return {
      api_key: apiKey,
      phone: safePayload.phone,
      mobile: safePayload.phone,
      amount: safePayload.amount,
      ...safePayload,
    };
  }

  if (kind === 'electricity') {
    return {
      api_key: apiKey,
      meter_number: safePayload.meter_number || safePayload.meterNumber,
      meter: safePayload.meter_number || safePayload.meterNumber,
      amount: safePayload.amount,
      ...safePayload,
    };
  }

  return {
    api_key: apiKey,
    smart_card: safePayload.smart_card || safePayload.smartCard,
    smartcard: safePayload.smart_card || safePayload.smartCard,
    package: safePayload.package,
    amount: safePayload.amount,
    ...safePayload,
  };
};

const request = async (kind, payload) => {
  const path = endpointConfig[kind] || '/service';

  if (!apiKey || !baseURL) {
    const error = new Error('BilalSadaSub credentials are not configured.');
    error.status = 500;
    throw error;
  }

  const requestPayload = normalizePayload(kind, payload);
  log(`Sending ${kind} request`, { path, payload: requestPayload });

  try {
    const response = await client.post(path, requestPayload);
    log(`Received ${kind} response`, { status: response.status, data: response.data });
    return response.data;
  } catch (error) {
    log(`BilalSadaSub ${kind} request failed`, { message: error.message, response: error.response?.data });
    throw buildError(error);
  }
};

export const purchaseData = async (payload) => request('data', payload);
export const purchaseAirtime = async (payload) => request('airtime', payload);
export const payElectricity = async (payload) => request('electricity', payload);
export const subscribeCableTv = async (payload) => request('cable', payload);
