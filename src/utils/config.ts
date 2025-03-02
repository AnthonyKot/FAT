// Configuration file for application settings

// API configuration
export const API_CONFIG = {
  // FinancialModelingPrep API key
  // In a production app, this would be loaded from environment variables
  // For example: FMP_API_KEY: import.meta.env.VITE_FMP_API_KEY || '',
  FMP_API_KEY: 'uoo5z4vjEHjGx8lcqEv6XKng0ioW7cuY',
  
  // Base URL for FinancialModelingPrep API
  FMP_BASE_URL: 'https://financialmodelingprep.com/api/v3',
  
  // Cache duration in milliseconds (30 minutes)
  CACHE_DURATION: 30 * 60 * 1000,
};

// Available companies for the demo version when not using real API
export const AVAILABLE_TICKERS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 
  'TSLA', 'NVDA', 'JPM', 'V', 'WMT',
  'PG', 'UNH', 'HD', 'BAC', 'XOM'
];

// Feature flags
export const FEATURES = {
  // Enable real API integration
  ENABLE_REAL_API: true, // Set to false to use mock data
  // Enable dark mode
  ENABLE_DARK_MODE: true,
  // Enable export functionality
  ENABLE_EXPORT: false,
};