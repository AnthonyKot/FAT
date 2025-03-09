// Data Adapter
// This utility transforms API responses from FinancialModelingPrep into our application's data model

import { CompanyData, FinancialData, OperationalMetrics, PerShareMetrics, ValuationMetrics } from '../types';
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
      dividendYield: (profile.lastDiv / profile.price) || 0, // Calculate yield as dividend/price
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
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(today.getFullYear() - 3);
      
      const fromDate = threeYearsAgo.toISOString().split('T')[0]; // YYYY-MM-DD
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
    
    // Calculate additional metrics
    transformedData.operationalMetrics = calculateOperationalMetrics(transformedData);
    transformedData.valuationMetrics = calculateValuationMetrics(transformedData);
    transformedData.perShareMetrics = calculatePerShareMetrics(transformedData);
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
}

// Calculate operational efficiency metrics
export function calculateOperationalMetrics(company: CompanyData): OperationalMetrics {
  const { balanceSheet, incomeStatement, cashFlow } = company;
  
  // Calculate Days of Inventory On Hand
  const daysOfInventoryOnHand = balanceSheet.inventory.map((item, index) => {
    const costOfRevenue = incomeStatement.costOfRevenue[index]?.value || 1;
    const daysInYear = 365;
    return {
      year: item.year,
      quarter: item.quarter,
      value: (item.value / (costOfRevenue / daysInYear))
    };
  });
  
  // Calculate Days Payables Outstanding
  const daysPayablesOutstanding = balanceSheet.accountsPayable.map((item, index) => {
    const costOfRevenue = incomeStatement.costOfRevenue[index]?.value || 1;
    const daysInYear = 365;
    return {
      year: item.year,
      quarter: item.quarter,
      value: (item.value / (costOfRevenue / daysInYear))
    };
  });
  
  // Calculate Days Sales Outstanding
  const daysSalesOutstanding = balanceSheet.accountsReceivable.map((item, index) => {
    const revenue = incomeStatement.revenue[index]?.value || 1;
    const daysInYear = 365;
    return {
      year: item.year,
      quarter: item.quarter,
      value: (item.value / (revenue / daysInYear))
    };
  });
  
  // Calculate Cash Conversion Cycle
  const cashConversionCycle = daysOfInventoryOnHand.map((item, index) => {
    return {
      year: item.year,
      quarter: item.quarter,
      value: item.value + daysSalesOutstanding[index].value - daysPayablesOutstanding[index].value
    };
  });
  
  // Calculate Income Quality (Operating Cash Flow / Net Income)
  const incomeQuality = cashFlow.operatingCashFlow.map((item, index) => {
    const netIncome = incomeStatement.netIncome[index]?.value || 1;
    return {
      year: item.year,
      quarter: item.quarter,
      value: item.value / netIncome
    };
  });
  
  // Calculate CapEx to Operating Cash Flow
  const capexToOperatingCash = cashFlow.capitalExpenditures.map((item, index) => {
    const opCashFlow = cashFlow.operatingCashFlow[index]?.value || 1;
    // Use absolute value since CapEx is negative
    return {
      year: item.year,
      quarter: item.quarter,
      value: (Math.abs(item.value) / opCashFlow) * 100 // As percentage
    };
  });
  
  // Calculate R&D to Revenue (estimated from operating expenses assuming 15% of OpEx is R&D)
  // Note: This is just an estimate as we don't have direct R&D data
  const rdToRevenue = incomeStatement.operatingExpenses.map((item, index) => {
    const revenue = incomeStatement.revenue[index]?.value || 1;
    const estimatedRD = item.value * 0.15; // Rough estimate that 15% of OpEx is R&D
    return {
      year: item.year,
      quarter: item.quarter,
      value: (estimatedRD / revenue) * 100 // As percentage
    };
  });
  
  return {
    daysOfInventoryOnHand,
    daysPayablesOutstanding,
    daysSalesOutstanding,
    cashConversionCycle,
    incomeQuality,
    capexToOperatingCash,
    rdToRevenue
  };
}

// Calculate valuation metrics
export function calculateValuationMetrics(company: CompanyData): ValuationMetrics {
  const { incomeStatement, balanceSheet, cashFlow, marketCap } = company;
  
  // Calculate Graham Number
  const grahamNumber = incomeStatement.eps.map((epsItem, index) => {
    const bookValuePerShare = balanceSheet.totalEquity[index]?.value / 
                             (marketCap / company.currentPrice); // Rough estimate of shares outstanding
    return {
      year: epsItem.year,
      quarter: epsItem.quarter,
      value: Math.sqrt(15 * epsItem.value * 1.5 * bookValuePerShare)
    };
  });
  
  // Calculate Free Cash Flow Yield
  const freeCashFlowYield = cashFlow.freeCashFlow.map((item) => {
    return {
      year: item.year,
      quarter: item.quarter,
      value: (item.value / marketCap) * 100 // As percentage
    };
  });
  
  // Calculate PEG Ratio
  const pegRatio = incomeStatement.eps.map((item, index) => {
    // Find corresponding growth rate (if available)
    const growth = company.ratios.epsGrowth.find(g => g.year === item.year)?.value || 0.05; // Default to 5% if not found
    const pe = company.ratios.peRatio.find(p => p.year === item.year)?.value || 15; // Default to 15 if not found
    
    return {
      year: item.year,
      quarter: item.quarter,
      value: growth > 0 ? pe / (growth * 100) : 0 // Convert growth to percentage
    };
  });
  
  // Calculate Enterprise Value to Sales
  const evToSales = incomeStatement.revenue.map((item, index) => {
    const totalDebt = (balanceSheet.longTermDebt[index]?.value || 0) + 
                      (balanceSheet.shortTermDebt[index]?.value || 0);
    const cash = balanceSheet.cashAndEquivalents[index]?.value || 0;
    const enterpriseValue = marketCap + totalDebt - cash;
    
    return {
      year: item.year,
      quarter: item.quarter,
      value: enterpriseValue / item.value
    };
  });
  
  // Calculate Enterprise Value to Free Cash Flow
  const evToFcf = cashFlow.freeCashFlow.map((item, index) => {
    const totalDebt = (balanceSheet.longTermDebt[index]?.value || 0) + 
                      (balanceSheet.shortTermDebt[index]?.value || 0);
    const cash = balanceSheet.cashAndEquivalents[index]?.value || 0;
    const enterpriseValue = marketCap + totalDebt - cash;
    
    return {
      year: item.year,
      quarter: item.quarter,
      value: item.value !== 0 ? enterpriseValue / item.value : 0
    };
  });
  
  // Calculate Net Debt to EBITDA
  const netDebtToEbitda = incomeStatement.ebitda.map((item, index) => {
    const totalDebt = (balanceSheet.longTermDebt[index]?.value || 0) + 
                      (balanceSheet.shortTermDebt[index]?.value || 0);
    const cash = balanceSheet.cashAndEquivalents[index]?.value || 0;
    const netDebt = totalDebt - cash;
    
    return {
      year: item.year,
      quarter: item.quarter,
      value: item.value !== 0 ? netDebt / item.value : 0
    };
  });
  
  // Calculate Return on Invested Capital (ROIC)
  const returnOnInvestedCapital = incomeStatement.netIncome.map((item, index) => {
    const totalEquity = balanceSheet.totalEquity[index]?.value || 1;
    const totalDebt = (balanceSheet.longTermDebt[index]?.value || 0) + 
                      (balanceSheet.shortTermDebt[index]?.value || 0);
    const investedCapital = totalEquity + totalDebt;
    
    return {
      year: item.year,
      quarter: item.quarter,
      value: (item.value / investedCapital) * 100 // As percentage
    };
  });
  
  return {
    grahamNumber,
    freeCashFlowYield,
    pegRatio,
    evToSales,
    evToFcf,
    netDebtToEbitda,
    returnOnInvestedCapital
  };
}

// Calculate per share metrics
export function calculatePerShareMetrics(company: CompanyData): PerShareMetrics {
  const { incomeStatement, balanceSheet, cashFlow, marketCap, currentPrice } = company;
  
  // Estimate shares outstanding based on market cap and current price
  const sharesOutstanding = marketCap / currentPrice;
  
  // Calculate Revenue Per Share
  const revenuePerShare = incomeStatement.revenue.map((item) => {
    return {
      year: item.year,
      quarter: item.quarter,
      value: item.value / sharesOutstanding
    };
  });
  
  // Calculate Operating Cash Flow Per Share
  const operatingCashFlowPerShare = cashFlow.operatingCashFlow.map((item) => {
    return {
      year: item.year,
      quarter: item.quarter,
      value: item.value / sharesOutstanding
    };
  });
  
  // Calculate Free Cash Flow Per Share
  const freeCashFlowPerShare = cashFlow.freeCashFlow.map((item) => {
    return {
      year: item.year,
      quarter: item.quarter,
      value: item.value / sharesOutstanding
    };
  });
  
  // Calculate Book Value Per Share
  const bookValuePerShare = balanceSheet.totalEquity.map((item) => {
    return {
      year: item.year,
      quarter: item.quarter,
      value: item.value / sharesOutstanding
    };
  });
  
  // Calculate Tangible Book Value Per Share
  const tangibleBookValuePerShare = balanceSheet.totalEquity.map((item, index) => {
    const intangibles = (balanceSheet.goodwill[index]?.value || 0) + 
                        (balanceSheet.intangibleAssets[index]?.value || 0);
    const tangibleBookValue = item.value - intangibles;
    
    return {
      year: item.year,
      quarter: item.quarter,
      value: tangibleBookValue / sharesOutstanding
    };
  });
  
  return {
    revenuePerShare,
    netIncomePerShare: incomeStatement.eps, // Already eps in the data
    operatingCashFlowPerShare,
    freeCashFlowPerShare,
    bookValuePerShare,
    tangibleBookValuePerShare
  };
}