// Financial Modeling Prep API Service
// This service handles API calls to FinancialModelingPrep.com

import { API_CONFIG, FEATURES } from './config';
import {
  CompanyProfileResponse,
  BalanceSheetResponse,
  IncomeStatementResponse,
  CashFlowResponse,
  KeyMetricsResponse,
  StockQuoteResponse
} from '../data/sampleApiResponse';

// Constants for API configuration
const API_BASE_URL = API_CONFIG.FMP_BASE_URL;
// Get API key from config
const API_KEY = API_CONFIG.FMP_API_KEY;

// Import persistent cache
import { cachedFetch } from './cacheUtils';

/**
 * Gets mock data from sampleApiResponse.ts for testing and development
 * @param endpoint - API endpoint name
 * @returns Mock data for the given endpoint
 */
async function getMockData(endpoint: string): Promise<any> {
  try {
    // Use dynamic import to avoid circular dependencies
    const { mockApiResponse } = await import('../data/sampleApiResponse');
    
    // Extract the endpoint type from the path and normalize it
    let mockEndpoint = endpoint.split('/')[0]
      .replace('-statement', '')
      .replace('-full', '');
    
    // Map some special endpoints to their appropriate mock data type
    if (mockEndpoint === 'historical-price') {
      // Create a simple mock for historical prices
      return {
        symbol: 'AAPL',
        historical: Array.from({length: 365}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: date.toISOString().split('T')[0],
            close: 100 + Math.random() * 100,
            // Add other required fields
            open: 100 + Math.random() * 100,
            high: 100 + Math.random() * 100,
            low: 100 + Math.random() * 100,
            volume: 1000000 + Math.random() * 5000000
          };
        })
      };
    }
    
    if (mockEndpoint === 'balance-sheet') mockEndpoint = 'balance-sheet';
    if (mockEndpoint === 'cash-flow') mockEndpoint = 'cash-flow';
    if (mockEndpoint === 'income') mockEndpoint = 'income-statement';
    if (mockEndpoint === 'key') mockEndpoint = 'key-metrics';
    
    console.log(`Getting mock data for endpoint: ${mockEndpoint}`);
    return mockApiResponse(mockEndpoint);
  } catch (error) {
    console.error('Error getting mock data:', error);
    // Return a simple empty array as fallback
    return [];
  }
}

/**
 * Makes a request to the FinancialModelingPrep API
 * @param endpoint - API endpoint to call
 * @param params - Additional query parameters
 * @returns Promise with API response
 */
async function apiRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  // Check if real API is enabled in config
  if (!FEATURES.ENABLE_REAL_API) {
    const mockEndpoint = endpoint.split('/')[0];
    return getMockData(mockEndpoint) as Promise<T>;
  }
  
  // If API_KEY is empty, throw an error
  if (!API_KEY) {
    throw new Error('API key is not configured. Please set your FinancialModelingPrep API key in config.ts.');
  }

  // Create cache key from the endpoint and params
  const queryString = new URLSearchParams({ ...params, apikey: API_KEY }).toString();
  const url = `${API_BASE_URL}${endpoint}?${queryString}`;
  const cacheKey = `${endpoint}_${JSON.stringify(params)}`;

  // Use the persistent cache utility
  return cachedFetch<T>(
    async () => {
      try {
        // Make the API request
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API request error:', error);
        throw error;
      }
    },
    cacheKey
  );
}

/**
 * Get company profile information 
 * @param ticker - Company stock ticker symbol
 */
export async function getCompanyProfile(ticker: string): Promise<CompanyProfileResponse[]> {
  if (!FEATURES.ENABLE_REAL_API) {
    // If we're using mock data, check if we have a profile for this ticker
    const { mockCompanies } = await import('../data/mockData');
    const mockCompany = mockCompanies.find(c => c.symbol === ticker);
    
    if (mockCompany) {
      // Create a mock profile based on the mock company data
      return [{
        symbol: mockCompany.symbol,
        price: 100 + Math.random() * 200,
        beta: 1 + Math.random(),
        volAvg: 1000000 + Math.random() * 10000000,
        mktCap: 10000000000 + Math.random() * 100000000000,
        lastDiv: Math.random() * 5,
        range: "50-150",
        changes: Math.random() * 10 - 5,
        companyName: mockCompany.name,
        currency: "USD",
        cik: "0000000000",
        isin: "US0000000000",
        cusip: "000000000",
        exchange: "NASDAQ Global Select",
        exchangeShortName: "NASDAQ",
        industry: mockCompany.industry || "Technology",
        website: `https://www.${mockCompany.symbol.toLowerCase()}.com`,
        description: `${mockCompany.name} is a leading company in the ${mockCompany.industry} industry.`,
        ceo: "John Doe",
        sector: mockCompany.industry || "Technology",
        country: "US",
        fullTimeEmployees: "10000",
        phone: "(123) 456-7890",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        dcfDiff: 10,
        dcf: 100,
        image: mockCompany.logo || `https://via.placeholder.com/150?text=${mockCompany.symbol}`,
        ipoDate: "2000-01-01",
        defaultImage: false,
        isEtf: false,
        isActivelyTrading: true,
        isAdr: false,
        isFund: false
      }];
    }
  }
  
  return apiRequest(`/profile/${ticker}`);
}

/**
 * Get company income statement
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getIncomeStatement(ticker: string, limit: number = 5): Promise<IncomeStatementResponse[]> {
  return apiRequest(`/income-statement/${ticker}`, { limit: limit.toString() });
}

/**
 * Get company balance sheet
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getBalanceSheet(ticker: string, limit: number = 5): Promise<BalanceSheetResponse[]> {
  return apiRequest(`/balance-sheet-statement/${ticker}`, { limit: limit.toString() });
}

/**
 * Get company cash flow statement
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getCashFlowStatement(ticker: string, limit: number = 5): Promise<CashFlowResponse[]> {
  return apiRequest(`/cash-flow-statement/${ticker}`, { limit: limit.toString() });
}

/**
 * Get company key metrics
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getKeyMetrics(ticker: string, limit: number = 5): Promise<KeyMetricsResponse[]> {
  return apiRequest(`/key-metrics/${ticker}`, { limit: limit.toString() });
}

/**
 * Get company financial growth metrics
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getFinancialGrowth(ticker: string, limit: number = 5): Promise<any> {
  return apiRequest(`/financial-growth/${ticker}`, { limit: limit.toString() });
}

/**
 * Get stock quote (latest price and trading information)
 * @param ticker - Company stock ticker symbol
 */
export async function getStockQuote(ticker: string): Promise<StockQuoteResponse[]> {
  return apiRequest(`/quote/${ticker}`);
}

/**
 * Get historical stock prices for a company
 * @param ticker - Company stock ticker symbol
 * @param from - Start date (YYYY-MM-DD)
 * @param to - End date (YYYY-MM-DD)
 */
export async function getHistoricalStockPrices(ticker: string, from: string, to: string): Promise<HistoricalPriceResponse> {
  return apiRequest(`/historical-price-full/${ticker}`, { from, to });
}

/**
 * Historical prices response interface
 */
export interface HistoricalPriceResponse {
  symbol: string;
  historical: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    adjClose: number;
    volume: number;
    unadjustedVolume: number;
    change: number;
    changePercent: number;
    vwap: number;
    label: string;
    changeOverTime: number;
  }[];
}

/**
 * Search for companies by name or ticker
 * @param query - Search query
 * @param limit - Maximum number of results to return
 */
export async function searchCompanies(query: string, limit: number = 10): Promise<{symbol: string, name: string, currency: string, stockExchange: string, exchangeShortName: string}[]> {
  if (!FEATURES.ENABLE_REAL_API) {
    // Return filtered mock companies if using mock data
    const { mockCompanies } = await import('../data/mockData');
    return mockCompanies
      .filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase()) || 
        company.symbol.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .map(company => ({
        symbol: company.symbol,
        name: company.name,
        currency: 'USD',
        stockExchange: 'NASDAQ',
        exchangeShortName: 'NASDAQ'
      }));
  }
  
  try {
    // Get search results
    const results = await apiRequest<{symbol: string, name: string, currency: string, stockExchange: string, exchangeShortName: string}[]>(`/search`, { query, limit: limit.toString() });
    
    // Filter to only US exchanges (most free plans only support US stocks)
    const usExchangeIdentifiers = ['NYSE', 'NASDAQ', 'AMEX', 'CBOE', 'US'];
    
    return results.filter(item => {
      // Check if exchange appears to be US-based
      const isUSExchange = 
        usExchangeIdentifiers.some(id => 
          item.exchangeShortName?.includes(id) || 
          item.stockExchange?.includes(id)
        );
      
      // Keep US exchanges and ones with USD currency
      return isUSExchange || item.currency === 'USD';
    });
  } catch (error) {
    console.error('Error searching companies:', error);
    // Return empty array in case of error
    return [];
  }
}