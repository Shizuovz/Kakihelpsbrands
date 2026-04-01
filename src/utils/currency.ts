/**
 * Currency formatting utilities for Indian Rupee
 */

export const formatINR = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export const formatINRCompact = (price: number): string => {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(0)}K`;
  }
  return `₹${price}`;
};

export const formatINRWithSuffix = (price: number, suffix: string = ''): string => {
  const formatted = formatINR(price);
  return suffix ? `${formatted} ${suffix}` : formatted;
};
