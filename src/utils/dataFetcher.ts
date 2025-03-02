// Integration between the App and the data sources (API or mock)
import { CompanyData, Company } from '../types';
import { mockCompanyData, mockCompanies } from '../data/mockData';
import { fetchCompanyData } from './dataAdapter';
import { FEATURES, AVAILABLE_TICKERS } from './config';

/**
 * Get a list of available companies
 * In a real implementation, this would fetch from an API
 */
export async function getAvailableCompanies(): Promise<Company[]> {
  // For simplicity, we'll use mock companies regardless of API setting
  // In a real app, this would fetch from an API endpoint
  return mockCompanies;
}

/**
 * Fetch company data either from the API or mock data
 * @param symbol Company ticker symbol
 */
export async function getCompanyData(symbol: string): Promise<CompanyData> {
  try {
    // Check if real API is enabled
    if (FEATURES.ENABLE_REAL_API) {
      console.log('Fetching real data for:', symbol);
      try {
        // Use the real API
        const data = await fetchCompanyData(symbol);
        return data;
      } catch (error) {
        console.error('Error fetching real data:', error);
        // Fallback to mock data if API fails
        console.log('Falling back to mock data for:', symbol);
        return mockCompanyData[symbol];
      }
    } else {
      // Use mock data
      console.log('Using mock data for:', symbol);
      return mockCompanyData[symbol];
    }
  } catch (error) {
    console.error('Error in getCompanyData:', error);
    throw error;
  }
}