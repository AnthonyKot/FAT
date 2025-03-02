// Data Adapter
// This utility transforms API responses from FinancialModelingPrep into our application's data model

import { CompanyData } from '../types';
import { 
  getCompanyProfile, 
  getIncomeStatement, 
  getBalanceSheet, 
  getCashFlowStatement,
  getKeyMetrics,
  getStockQuote
} from './apiService';
import {
  CompanyProfileResponse,
  BalanceSheetResponse,
  IncomeStatementResponse,
  CashFlowResponse,
  KeyMetricsResponse,
  StockQuoteResponse
} from '../data/sampleApiResponse';

/**
 * Calculates year-over-year growth for financial data
 * @param data - Array of financial data with year and value
 * @returns Array of growth rates with year and value
 */
function calculateGrowth(data: { year: number; value: number }[]): { year: number; value: number }[] {
  // Sort data by year (oldest first)
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  const growthData: { year: number; value: number }[] = [];

  for (let i = 1; i < sortedData.length; i++) {
    const currentValue = sortedData[i].value;
    const previousValue = sortedData[i - 1].value;
    
    // Skip if previous value is zero or undefined to avoid division by zero
    if (!previousValue) continue;
    
    const growthRate = (currentValue - previousValue) / Math.abs(previousValue);
    
    growthData.push({
      year: sortedData[i].year,
      value: growthRate
    });
  }

  return growthData;
}

/**
 * Fetches all necessary data for a company and transforms it into our application's format
 * @param ticker - Company stock ticker symbol
 * @returns Promise with transformed company data
 */
export async function fetchCompanyData(ticker: string): Promise<CompanyData> {
  try {
    // Fetch all required data in parallel
    const [
      profileData, 
      incomeStatementData, 
      balanceSheetData, 
      cashFlowData,
      keyMetricsData,
      quoteData
    ] = await Promise.all([
      getCompanyProfile(ticker) as Promise<CompanyProfileResponse[]>,
      getIncomeStatement(ticker) as Promise<IncomeStatementResponse[]>,
      getBalanceSheet(ticker) as Promise<BalanceSheetResponse[]>,
      getCashFlowStatement(ticker) as Promise<CashFlowResponse[]>,
      getKeyMetrics(ticker) as Promise<KeyMetricsResponse[]>,
      getStockQuote(ticker) as Promise<StockQuoteResponse[]>
    ]);

    // Ensure we have valid data
    if (!profileData[0] || !incomeStatementData[0] || !balanceSheetData[0] || !cashFlowData[0]) {
      throw new Error(`Incomplete data for ticker: ${ticker}`);
    }

    const profile = profileData[0];
    const quote = quoteData[0];

    // Generate a unique ID for the company
    const generateId = (symbol: string) => {
      return `${symbol.toLowerCase()}-${Date.now()}`;
    };

    // Transform the data into our application's format
    const transformedData: CompanyData = {
      company: {
        id: generateId(profile.symbol),
        name: profile.companyName,
        symbol: profile.symbol,
        industry: profile.industry,
        logo: profile.image
      },
      marketCap: profile.mktCap || 0,
      currentPrice: quote.price || 0,
      yearHigh: quote.yearHigh || 0,
      yearLow: quote.yearLow || 0,
      dividendYield: profile.lastDiv || 0,
      beta: profile.beta || 0,
      stockPrices: [], // Will be filled separately with historical data
      balanceSheet: {
        totalAssets: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.totalAssets 
        })),
        totalLiabilities: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.totalLiabilities 
        })),
        totalEquity: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.totalStockholdersEquity 
        })),
        cashAndEquivalents: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.cashAndCashEquivalents 
        })),
        shortTermInvestments: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.shortTermInvestments || 0
        })),
        accountsReceivable: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.netReceivables 
        })),
        inventory: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.inventory 
        })),
        propertyPlantEquipment: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.propertyPlantEquipmentNet 
        })),
        goodwill: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.goodwill || 0
        })),
        intangibleAssets: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.intangibleAssets || 0
        })),
        accountsPayable: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.accountPayables || 0
        })),
        shortTermDebt: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.shortTermDebt || 0
        })),
        longTermDebt: balanceSheetData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.longTermDebt || 0
        }))
      },
      incomeStatement: {
        revenue: incomeStatementData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.revenue 
        })),
        costOfRevenue: incomeStatementData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.costOfRevenue 
        })),
        grossProfit: incomeStatementData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.grossProfit 
        })),
        operatingExpenses: incomeStatementData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.operatingExpenses 
        })),
        operatingIncome: incomeStatementData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.operatingIncome 
        })),
        ebitda: incomeStatementData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.ebitda 
        })),
        netIncome: incomeStatementData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.netIncome 
        })),
        eps: incomeStatementData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.eps 
        }))
      },
      cashFlow: {
        operatingCashFlow: cashFlowData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.operatingCashFlow 
        })),
        capitalExpenditures: cashFlowData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.capitalExpenditure 
        })),
        freeCashFlow: cashFlowData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.freeCashFlow 
        })),
        dividendsPaid: cashFlowData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.dividendsPaid || 0
        })),
        netInvestingCashFlow: cashFlowData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.netCashUsedForInvestingActivites || 0
        })),
        netFinancingCashFlow: cashFlowData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.netCashUsedProvidedByFinancingActivities || 0
        })),
        netChangeInCash: cashFlowData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.netChangeInCash 
        }))
      },
      ratios: {
        // Valuation
        peRatio: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.peRatio || 0
        })),
        pbRatio: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.pbRatio || 0
        })),
        psRatio: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.priceToSalesRatio || 0
        })),
        evToEbitda: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.enterpriseValueOverEBITDA || 0
        })),
        
        // Profitability
        returnOnEquity: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.roe || 0
        })),
        returnOnAssets: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.returnOnTangibleAssets || 0
        })),
        netProfitMargin: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: incomeStatementData.find(i => new Date(i.date).getFullYear() === new Date(item.date).getFullYear())?.netIncomeRatio || 0
        })),
        grossProfitMargin: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: incomeStatementData.find(i => new Date(i.date).getFullYear() === new Date(item.date).getFullYear())?.grossProfitRatio || 0
        })),
        
        // Growth - requires calculation from year to year
        revenueGrowth: calculateGrowth(incomeStatementData.map(item => ({
          year: new Date(item.date).getFullYear(),
          value: item.revenue
        }))),
        epsGrowth: calculateGrowth(incomeStatementData.map(item => ({
          year: new Date(item.date).getFullYear(),
          value: item.eps
        }))),
        
        // Risk
        debtToEquity: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.debtToEquity || 0
        })),
        currentRatio: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.currentRatio || 0
        })),
        quickRatio: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.quickRatio || 0
        })),
        
        // Efficiency
        assetTurnover: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.assetTurnover || 0
        })),
        inventoryTurnover: keyMetricsData.map(item => ({ 
          year: new Date(item.date).getFullYear(), 
          value: item.inventoryTurnover || 0
        }))
      }
    };

    // Sort all data points by year (newest first)
    const sortByYear = (a: { year: number }, b: { year: number }) => b.year - a.year;
    
    // Sort all arrays by year
    Object.keys(transformedData.balanceSheet).forEach(key => {
      (transformedData.balanceSheet as any)[key].sort(sortByYear);
    });
    
    Object.keys(transformedData.incomeStatement).forEach(key => {
      (transformedData.incomeStatement as any)[key].sort(sortByYear);
    });
    
    Object.keys(transformedData.cashFlow).forEach(key => {
      (transformedData.cashFlow as any)[key].sort(sortByYear);
    });
    
    Object.keys(transformedData.ratios).forEach(key => {
      if (Array.isArray(transformedData.ratios[key as keyof typeof transformedData.ratios])) {
        (transformedData.ratios[key as keyof typeof transformedData.ratios] as any).sort(sortByYear);
      }
    });
    
    // Get stock price history for the last 12 months
    try {
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      
      const fromDate = oneYearAgo.toISOString().split('T')[0]; // YYYY-MM-DD
      const toDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const { getHistoricalStockPrices } = await import('./apiService');
      const stockPriceResponse = await getHistoricalStockPrices(ticker, fromDate, toDate) as any;
      
      if (stockPriceResponse && stockPriceResponse.historical) {
        // Map historical prices to our StockPriceData format
        transformedData.stockPrices = stockPriceResponse.historical.map((item: any) => ({
          date: item.date,
          price: item.close
        }));
      }
    } catch (error) {
      console.error('Error fetching historical stock prices:', error);
      // Continue without historical prices if this fails
    }
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
}