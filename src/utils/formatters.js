// src/utils/formatters.js
import { APP_CONFIG } from '../constants';

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
    style: 'currency',
    currency: APP_CONFIG.CURRENCY
  }).format(amount);
};

// Format currency without decimals
export const formatCurrencyNoDecimals = (amount) => {
  return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
    style: 'currency',
    currency: APP_CONFIG.CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with decimals
export const formatNumber = (number, decimals = 2) => {
  return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// Format percentage
export const formatPercentage = (value) => {
  if (value === APP_CONFIG.PERCENTAGE_FULL) return '100%';
  if (value === APP_CONFIG.PERCENTAGE_PARTIAL) return '70%';
  return `${(value * 100).toFixed(0)}%`;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString(APP_CONFIG.LOCALE);
};

// Format date and time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString(APP_CONFIG.LOCALE);
};

// Clean numeric input
export const cleanNumericInput = (value) => {
  return value.replace(/[^0-9.]/g, '');
};

// Parse currency input
export const parseCurrencyInput = (value) => {
  const cleaned = cleanNumericInput(value);
  return parseFloat(cleaned) || 0;
};

// src/utils/index.js
export * from './calculations';
export * from './formatters';
export * from './validators';