import APIClient from './APIInterface';
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
 * A class for interacting with the Financial Modeling Prep API
 */
class FinancialModelingPrepAPI implements APIClient {
    async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
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
}

export default FinancialModelingPrepAPI;
