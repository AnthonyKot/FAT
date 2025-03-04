// Integration between the App and the data sources (API or mock)
import { CompanyData } from '../types';
import { mockCompanyData } from '../data/mockData';
import { fetchCompanyData } from './dataAdapter';
import { FEATURES } from './config';

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