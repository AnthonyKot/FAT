/**
 * Formats a number as currency with dollar sign and commas
 */
export const formatCurrency = (value: number | undefined | null): string => {
  // Handle undefined or null values
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats a number as a percentage with % sign
 */
export const formatPercentage = (value: number | undefined | null): string => {
  // Handle undefined or null values
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};

/**
 * Formats a large number with appropriate suffix (K, M, B, T)
 */
export const formatLargeNumber = (value: number | undefined | null): string => {
  // Handle undefined or null values
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(1)}T`;
  } else if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  } else {
    return value.toFixed(2);
  }
};

/**
 * Formats a currency value with human-readable suffixes (K, M, B, T)
 */
export const formatCurrencyAbbreviated = (value: number | undefined | null): string => {
  // Handle undefined or null values
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  const absValue = Math.abs(value);
  const prefix = '$';
  
  if (absValue >= 1_000_000_000_000) {
    return `${prefix}${(value / 1_000_000_000_000).toFixed(1)}T`;
  } else if (absValue >= 1_000_000_000) {
    return `${prefix}${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    return `${prefix}${(value / 1_000).toFixed(1)}K`;
  } else {
    return `${prefix}${value.toFixed(2)}`;
  }
};

/**
 * Formats a number with a specific number of decimal places
 */
export const formatNumber = (value: number | undefined | null, decimals: number = 2): string => {
  // Handle undefined or null values
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  return value.toFixed(decimals);
};