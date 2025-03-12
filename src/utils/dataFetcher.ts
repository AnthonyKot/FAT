// Integration between the App and the data sources (API or mock)
import { CompanyData } from '../types';
import { mockCompanyData } from '../data/mockData';
import { fetchCompanyData } from './dataAdapter';
import { FEATURES } from './config';
import DataAdapter from './DataAdapter';
import { getCompanyProfile, getIncomeStatement, getBalanceSheet, getCashFlowStatement, getKeyMetrics, getStockQuote } from './apiService';
import  fmpAPI from "./apiService"
import DataAdapter from './DataAdapter';
import { getCompanyProfile, getIncomeStatement, getBalanceSheet, getCashFlowStatement, getKeyMetrics, getStockQuote } from './apiService';

/**
 * Fetch company data either from the API or mock data
 * @param symbol Company ticker symbol
 */
export async function getCompanyData(symbol: string): Promise<CompanyData> {
  try {
    // Check if real API is enabled
    if (FEATURES.ENABLE_REAL_API) {
      console.log('Fetching real data for:', symbol);
      // Use the real API
      const [profileData, incomeStatementData, balanceSheetData, cashFlowData, keyMetricsData, quoteData] = await Promise.all([
        dataRequester.getCompanyProfile(symbol) as Promise<any>,
        dataRequester.getIncomeStatement(symbol) as Promise<any>,
        dataRequester.getBalanceSheet(symbol) as Promise<any>,
        dataRequester.getCashFlowStatement(symbol) as Promise<any>,
        dataRequester.getKeyMetrics(symbol) as Promise<any>,
        dataRequester.getStockQuote(symbol) as Promise<any>
      ]);
      const companyData = await fetchCompanyData(symbol, profileData, incomeStatementData, balanceSheetData, cashFlowData, keyMetricsData, quoteData)
      return companyData;
      }
     else{
      // Use mock data
      console.log('Using mock data for:', symbol);
      
      // Check if we have mock data for this symbol
      if (mockCompanyData[symbol]) {
        return mockCompanyData[symbol];
      } else {
        // If symbol doesn't exist in mock data, return generic mock data
        const mockSymbol = 'AAPL'; // Use AAPL as a template
        const templateData = JSON.parse(JSON.stringify(mockCompanyData[mockSymbol]));
        
        // Update with the requested symbol info
        templateData.company.symbol = symbol;
        templateData.company.name = `${symbol} Company (Mock Data)`;
        
        return templateData;
      }
    }
  } catch (error) {
    console.error('Error in getCompanyData:', error);
    throw error;
  }
}
import DataAdapter from './DataAdapter';
import { getCompanyProfile, getIncomeStatement, getBalanceSheet, getCashFlowStatement, getKeyMetrics, getStockQuote } from './apiService';

/**
 * Fetch company data either from the API or mock data
 * @param symbol Company ticker symbol
 */
export async function getCompanyData(symbol: string): Promise<CompanyData> {
  const dataRequester = new DataAdapter();
  try {
    // Check if real API is enabled
    if (FEATURES.ENABLE_REAL_API) {
      console.log('Fetching real data for:', symbol);
      // Use the real API
      const [profileData, incomeStatementData, balanceSheetData, cashFlowData, keyMetricsData, quoteData] = await Promise.all([
        dataRequester.getCompanyProfile(symbol) as Promise<any>,
        dataRequester.getIncomeStatement(symbol) as Promise<any>,
        dataRequester.getBalanceSheet(ticker) as Promise<any>,
        dataRequester.getCashFlowStatement(ticker) as Promise<any>,
        dataRequester.getKeyMetrics(ticker) as Promise<any>,
        dataRequester.getStockQuote(ticker) as Promise<any>
      ]
      );
      const companyData = await fetchCompanyData(symbol, profileData, incomeStatementData, balanceSheetData, cashFlowData, keyMetricsData, quoteData)
      return companyData;
    }
    else {
      // Use mock data
      return mockCompanyData[symbol];
    }
  } catch (error) {
    console.error('Error in getCompanyData:', error);
    throw error;
  }
}