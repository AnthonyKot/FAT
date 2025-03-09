import { Company, CompanyData } from '../types';
import { calculateOperationalMetrics, calculatePerShareMetrics, calculateValuationMetrics } from '../utils/dataAdapter';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    industry: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  },
  {
    id: '2',
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    industry: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
  },
  {
    id: '3',
    name: 'Alphabet Inc.',
    symbol: 'GOOG',
    industry: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
  },
  {
    id: '4',
    name: 'Amazon.com, Inc.',
    symbol: 'AMZN',
    industry: 'Consumer Cyclical',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  {
    id: '5',
    name: 'Meta Platforms, Inc.',
    symbol: 'META',
    industry: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'
  },
  {
    id: '6',
    name: 'Tesla, Inc.',
    symbol: 'TSLA',
    industry: 'Automotive',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png'
  },
  {
    id: '7',
    name: 'NVIDIA Corporation',
    symbol: 'NVDA',
    industry: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg'
  },
  {
    id: '8',
    name: 'Samsung Electronics Co., Ltd.',
    symbol: 'SSNLF',
    industry: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'
  }
];

// Helper function to generate financial data
const generateFinancialData = (baseValue: number, years: number, growth: number, volatility: number) => {
  const data = [];
  let value = baseValue;
  
  for (let i = 0; i < years; i++) {
    value = value * (1 + growth + (Math.random() * volatility * 2 - volatility));
    data.push({
      year: 2023 - i,
      value: Math.round(value * 100) / 100
    });
  }
  
  return data.reverse();
};

// Generate stock price history data
const generateStockPrices = (basePrice: number, days: number, volatility: number) => {
  const stockPrices: StockPriceData[] = [];
  let currentPrice = basePrice;
  
  // Generate 3 years of daily data
  const endDate = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - i));
    
    // Random walk with some trend
    const change = (Math.random() - 0.48) * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + change, 0.1);
    
    stockPrices.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      price: Math.round(currentPrice * 100) / 100
    });
  }
  
  return stockPrices;
};

// Generate mock company data
export const mockCompanyData: Record<string, CompanyData> = {
  'AAPL': {
    company: mockCompanies[0],
    stockPrices: generateStockPrices(182.52, 1095, 0.015), // 3 years, starting from current price
    balanceSheet: {
      totalAssets: generateFinancialData(350000, 5, 0.08, 0.02),
      totalLiabilities: generateFinancialData(280000, 5, 0.07, 0.02),
      totalEquity: generateFinancialData(70000, 5, 0.09, 0.03),
      cashAndEquivalents: generateFinancialData(40000, 5, 0.05, 0.08),
      shortTermInvestments: generateFinancialData(30000, 5, 0.04, 0.05),
      accountsReceivable: generateFinancialData(25000, 5, 0.06, 0.04),
      inventory: generateFinancialData(5000, 5, 0.03, 0.05),
      propertyPlantEquipment: generateFinancialData(40000, 5, 0.07, 0.02),
      goodwill: generateFinancialData(10000, 5, 0.01, 0.01),
      intangibleAssets: generateFinancialData(15000, 5, 0.02, 0.02),
      accountsPayable: generateFinancialData(50000, 5, 0.06, 0.03),
      shortTermDebt: generateFinancialData(15000, 5, 0.04, 0.06),
      longTermDebt: generateFinancialData(110000, 5, 0.05, 0.03)
    },
    incomeStatement: {
      revenue: generateFinancialData(380000, 5, 0.09, 0.03),
      costOfRevenue: generateFinancialData(220000, 5, 0.08, 0.02),
      grossProfit: generateFinancialData(160000, 5, 0.1, 0.03),
      operatingExpenses: generateFinancialData(45000, 5, 0.07, 0.04),
      operatingIncome: generateFinancialData(115000, 5, 0.11, 0.05),
      netIncome: generateFinancialData(95000, 5, 0.1, 0.06),
      eps: generateFinancialData(6.15, 5, 0.12, 0.05),
      ebitda: generateFinancialData(125000, 5, 0.1, 0.04)
    },
    cashFlow: {
      operatingCashFlow: generateFinancialData(110000, 5, 0.09, 0.05),
      capitalExpenditures: generateFinancialData(-12000, 5, 0.08, 0.06),
      freeCashFlow: generateFinancialData(98000, 5, 0.09, 0.07),
      dividendsPaid: generateFinancialData(-15000, 5, 0.1, 0.02),
      netInvestingCashFlow: generateFinancialData(-20000, 5, 0.07, 0.08),
      netFinancingCashFlow: generateFinancialData(-70000, 5, 0.06, 0.09),
      netChangeInCash: generateFinancialData(20000, 5, 0.05, 0.15)
    },
    ratios: {
      peRatio: generateFinancialData(28, 5, 0.02, 0.1),
      pbRatio: generateFinancialData(45, 5, 0.03, 0.08),
      psRatio: generateFinancialData(7.5, 5, 0.01, 0.09),
      evToEbitda: generateFinancialData(22, 5, 0.02, 0.07),
      returnOnEquity: generateFinancialData(0.35, 5, 0.01, 0.05),
      returnOnAssets: generateFinancialData(0.2, 5, 0.01, 0.04),
      netProfitMargin: generateFinancialData(0.25, 5, 0.01, 0.03),
      grossProfitMargin: generateFinancialData(0.42, 5, 0.005, 0.02),
      revenueGrowth: generateFinancialData(0.08, 5, -0.005, 0.04),
      epsGrowth: generateFinancialData(0.12, 5, -0.01, 0.06),
      debtToEquity: generateFinancialData(1.8, 5, -0.02, 0.05),
      currentRatio: generateFinancialData(1.1, 5, 0.01, 0.03),
      quickRatio: generateFinancialData(0.9, 5, 0.01, 0.04),
      assetTurnover: generateFinancialData(0.8, 5, 0.005, 0.02),
      inventoryTurnover: generateFinancialData(40, 5, 0.02, 0.05)
    },
    marketCap: 2800000000000,
    currentPrice: 182.52,
    yearHigh: 198.23,
    yearLow: 124.17,
    dividendYield: 0.0055,
    beta: 1.28
  },
  'MSFT': {
    company: mockCompanies[1],
    stockPrices: generateStockPrices(390.47, 1095, 0.013), // 3 years
    balanceSheet: {
      totalAssets: generateFinancialData(320000, 5, 0.1, 0.02),
      totalLiabilities: generateFinancialData(190000, 5, 0.08, 0.02),
      totalEquity: generateFinancialData(130000, 5, 0.12, 0.03),
      cashAndEquivalents: generateFinancialData(60000, 5, 0.07, 0.06),
      shortTermInvestments: generateFinancialData(70000, 5, 0.06, 0.04),
      accountsReceivable: generateFinancialData(35000, 5, 0.08, 0.03),
      inventory: generateFinancialData(3000, 5, 0.05, 0.04),
      propertyPlantEquipment: generateFinancialData(50000, 5, 0.09, 0.02),
      goodwill: generateFinancialData(40000, 5, 0.02, 0.01),
      intangibleAssets: generateFinancialData(10000, 5, 0.03, 0.02),
      accountsPayable: generateFinancialData(15000, 5, 0.07, 0.03),
      shortTermDebt: generateFinancialData(5000, 5, 0.03, 0.05),
      longTermDebt: generateFinancialData(70000, 5, 0.04, 0.02)
    },
    incomeStatement: {
      revenue: generateFinancialData(200000, 5, 0.12, 0.02),
      costOfRevenue: generateFinancialData(65000, 5, 0.1, 0.02),
      grossProfit: generateFinancialData(135000, 5, 0.13, 0.02),
      operatingExpenses: generateFinancialData(50000, 5, 0.09, 0.03),
      operatingIncome: generateFinancialData(85000, 5, 0.15, 0.04),
      netIncome: generateFinancialData(70000, 5, 0.14, 0.05),
      eps: generateFinancialData(9.5, 5, 0.16, 0.04),
      ebitda: generateFinancialData(95000, 5, 0.14, 0.03)
    },
    cashFlow: {
      operatingCashFlow: generateFinancialData(90000, 5, 0.13, 0.04),
      capitalExpenditures: generateFinancialData(-25000, 5, 0.11, 0.05),
      freeCashFlow: generateFinancialData(65000, 5, 0.14, 0.06),
      dividendsPaid: generateFinancialData(-18000, 5, 0.12, 0.02),
      netInvestingCashFlow: generateFinancialData(-35000, 5, 0.1, 0.07),
      netFinancingCashFlow: generateFinancialData(-40000, 5, 0.08, 0.08),
      netChangeInCash: generateFinancialData(15000, 5, 0.07, 0.12)
    },
    ratios: {
      peRatio: generateFinancialData(35, 5, 0.03, 0.09),
      pbRatio: generateFinancialData(12, 5, 0.02, 0.07),
      psRatio: generateFinancialData(11, 5, 0.02, 0.08),
      evToEbitda: generateFinancialData(25, 5, 0.03, 0.06),
      returnOnEquity: generateFinancialData(0.42, 5, 0.01, 0.04),
      returnOnAssets: generateFinancialData(0.22, 5, 0.01, 0.03),
      netProfitMargin: generateFinancialData(0.35, 5, 0.01, 0.02),
      grossProfitMargin: generateFinancialData(0.67, 5, 0.005, 0.01),
      revenueGrowth: generateFinancialData(0.12, 5, -0.005, 0.03),
      epsGrowth: generateFinancialData(0.16, 5, -0.01, 0.05),
      debtToEquity: generateFinancialData(0.6, 5, -0.02, 0.04),
      currentRatio: generateFinancialData(2.5, 5, 0.01, 0.02),
      quickRatio: generateFinancialData(2.4, 5, 0.01, 0.03),
      assetTurnover: generateFinancialData(0.6, 5, 0.005, 0.01),
      inventoryTurnover: generateFinancialData(15, 5, 0.02, 0.04)
    },
    marketCap: 2900000000000,
    currentPrice: 390.47,
    yearHigh: 420.82,
    yearLow: 275.37,
    dividendYield: 0.0073, // ~0.73% dividend yield
    beta: 0.92
  },
  'GOOG': {
    company: mockCompanies[2],
    stockPrices: generateStockPrices(150.07, 1095, 0.016), // 3 years
    balanceSheet: {
      totalAssets: generateFinancialData(360000, 5, 0.09, 0.02),
      totalLiabilities: generateFinancialData(100000, 5, 0.07, 0.02),
      totalEquity: generateFinancialData(260000, 5, 0.1, 0.03),
      cashAndEquivalents: generateFinancialData(20000, 5, 0.06, 0.07),
      shortTermInvestments: generateFinancialData(110000, 5, 0.05, 0.05),
      accountsReceivable: generateFinancialData(40000, 5, 0.07, 0.04),
      inventory: generateFinancialData(2000, 5, 0.04, 0.05),
      propertyPlantEquipment: generateFinancialData(90000, 5, 0.08, 0.02),
      goodwill: generateFinancialData(25000, 5, 0.01, 0.01),
      intangibleAssets: generateFinancialData(3000, 5, 0.02, 0.02),
      accountsPayable: generateFinancialData(5000, 5, 0.06, 0.03),
      shortTermDebt: generateFinancialData(4000, 5, 0.03, 0.06),
      longTermDebt: generateFinancialData(15000, 5, 0.04, 0.03)
    },
    incomeStatement: {
      revenue: generateFinancialData(280000, 5, 0.1, 0.03),
      costOfRevenue: generateFinancialData(120000, 5, 0.09, 0.02),
      grossProfit: generateFinancialData(160000, 5, 0.11, 0.03),
      operatingExpenses: generateFinancialData(80000, 5, 0.08, 0.04),
      operatingIncome: generateFinancialData(80000, 5, 0.12, 0.05),
      netIncome: generateFinancialData(70000, 5, 0.11, 0.06),
      eps: generateFinancialData(5.4, 5, 0.13, 0.05),
      ebitda: generateFinancialData(95000, 5, 0.11, 0.04)
    },
    cashFlow: {
      operatingCashFlow: generateFinancialData(95000, 5, 0.1, 0.05),
      capitalExpenditures: generateFinancialData(-30000, 5, 0.09, 0.06),
      freeCashFlow: generateFinancialData(65000, 5, 0.1, 0.07),
      dividendsPaid: generateFinancialData(0, 5, 0, 0),
      netInvestingCashFlow: generateFinancialData(-40000, 5, 0.08, 0.08),
      netFinancingCashFlow: generateFinancialData(-25000, 5, 0.07, 0.09),
      netChangeInCash: generateFinancialData(30000, 5, 0.06, 0.15)
    },
    ratios: {
      peRatio: generateFinancialData(25, 5, 0.02, 0.1),
      pbRatio: generateFinancialData(5.5, 5, 0.03, 0.08),
      psRatio: generateFinancialData(6, 5, 0.01, 0.09),
      evToEbitda: generateFinancialData(18, 5, 0.02, 0.07),
      returnOnEquity: generateFinancialData(0.27, 5, 0.01, 0.05),
      returnOnAssets: generateFinancialData(0.19, 5, 0.01, 0.04),
      netProfitMargin: generateFinancialData(0.25, 5, 0.01, 0.03),
      grossProfitMargin: generateFinancialData(0.57, 5, 0.005, 0.02),
      revenueGrowth: generateFinancialData(0.1, 5, -0.005, 0.04),
      epsGrowth: generateFinancialData(0.13, 5, -0.01, 0.06),
      debtToEquity: generateFinancialData(0.07, 5, -0.005, 0.01),
      currentRatio: generateFinancialData(3.2, 5, 0.01, 0.03),
      quickRatio: generateFinancialData(3.1, 5, 0.01, 0.04),
      assetTurnover: generateFinancialData(0.78, 5, 0.005, 0.02),
      inventoryTurnover: generateFinancialData(60, 5, 0.02, 0.05)
    },
    marketCap: 1900000000000,
    currentPrice: 150.07,
    yearHigh: 155.20,
    yearLow: 102.02,
    dividendYield: 0,
    beta: 1.05
  },
  'AMZN': {
    company: mockCompanies[3],
    stockPrices: generateStockPrices(165.09, 1095, 0.018), // 3 years
    balanceSheet: {
      totalAssets: generateFinancialData(410000, 5, 0.11, 0.03),
      totalLiabilities: generateFinancialData(280000, 5, 0.1, 0.03),
      totalEquity: generateFinancialData(130000, 5, 0.13, 0.04),
      cashAndEquivalents: generateFinancialData(55000, 5, 0.08, 0.09),
      shortTermInvestments: generateFinancialData(20000, 5, 0.07, 0.06),
      accountsReceivable: generateFinancialData(30000, 5, 0.09, 0.05),
      inventory: generateFinancialData(35000, 5, 0.1, 0.06),
      propertyPlantEquipment: generateFinancialData(160000, 5, 0.12, 0.03),
      goodwill: generateFinancialData(20000, 5, 0.03, 0.02),
      intangibleAssets: generateFinancialData(5000, 5, 0.04, 0.03),
      accountsPayable: generateFinancialData(80000, 5, 0.09, 0.04),
      shortTermDebt: generateFinancialData(10000, 5, 0.06, 0.07),
      longTermDebt: generateFinancialData(120000, 5, 0.07, 0.04)
    },
    incomeStatement: {
      revenue: generateFinancialData(500000, 5, 0.15, 0.04),
      costOfRevenue: generateFinancialData(300000, 5, 0.14, 0.03),
      grossProfit: generateFinancialData(200000, 5, 0.16, 0.04),
      operatingExpenses: generateFinancialData(160000, 5, 0.13, 0.05),
      operatingIncome: generateFinancialData(40000, 5, 0.2, 0.08),
      netIncome: generateFinancialData(30000, 5, 0.22, 0.1),
      eps: generateFinancialData(2.9, 5, 0.23, 0.09),
      ebitda: generateFinancialData(70000, 5, 0.18, 0.07)
    },
    cashFlow: {
      operatingCashFlow: generateFinancialData(70000, 5, 0.16, 0.07),
      capitalExpenditures: generateFinancialData(-60000, 5, 0.14, 0.08),
      freeCashFlow: generateFinancialData(10000, 5, 0.25, 0.15),
      dividendsPaid: generateFinancialData(0, 5, 0, 0),
      netInvestingCashFlow: generateFinancialData(-65000, 5, 0.13, 0.1),
      netFinancingCashFlow: generateFinancialData(15000, 5, 0.1, 0.12),
      netChangeInCash: generateFinancialData(20000, 5, 0.15, 0.2)
    },
    ratios: {
      peRatio: generateFinancialData(60, 5, 0.05, 0.15),
      pbRatio: generateFinancialData(14, 5, 0.04, 0.12),
      psRatio: generateFinancialData(3.6, 5, 0.03, 0.13),
      evToEbitda: generateFinancialData(30, 5, 0.04, 0.11),
      returnOnEquity: generateFinancialData(0.23, 5, 0.02, 0.08),
      returnOnAssets: generateFinancialData(0.07, 5, 0.02, 0.07),
      netProfitMargin: generateFinancialData(0.06, 5, 0.02, 0.06),
      grossProfitMargin: generateFinancialData(0.4, 5, 0.01, 0.04),
      revenueGrowth: generateFinancialData(0.15, 5, -0.01, 0.07),
      epsGrowth: generateFinancialData(0.23, 5, -0.02, 0.12),
      debtToEquity: generateFinancialData(1, 5, -0.03, 0.08),
      currentRatio: generateFinancialData(1.1, 5, 0.01, 0.05),
      quickRatio: generateFinancialData(0.8, 5, 0.01, 0.06),
      assetTurnover: generateFinancialData(1.2, 5, 0.01, 0.04),
      inventoryTurnover: generateFinancialData(8.5, 5, 0.03, 0.07)
    },
    marketCap: 1700000000000,
    currentPrice: 165.09,
    yearHigh: 185.10,
    yearLow: 101.15,
    dividendYield: 0,
    beta: 1.22
  },
  'META': {
    company: mockCompanies[4],
    stockPrices: generateStockPrices(472.22, 1095, 0.022), // 3 years
    balanceSheet: {
      totalAssets: generateFinancialData(180000, 5, 0.08, 0.02),
      totalLiabilities: generateFinancialData(50000, 5, 0.06, 0.02),
      totalEquity: generateFinancialData(130000, 5, 0.09, 0.03),
      cashAndEquivalents: generateFinancialData(15000, 5, 0.05, 0.08),
      shortTermInvestments: generateFinancialData(30000, 5, 0.04, 0.05),
      accountsReceivable: generateFinancialData(20000, 5, 0.06, 0.04),
      inventory: generateFinancialData(1000, 5, 0.03, 0.05),
      propertyPlantEquipment: generateFinancialData(60000, 5, 0.07, 0.02),
      goodwill: generateFinancialData(20000, 5, 0.01, 0.01),
      intangibleAssets: generateFinancialData(2000, 5, 0.02, 0.02),
      accountsPayable: generateFinancialData(5000, 5, 0.06, 0.03),
      shortTermDebt: generateFinancialData(2000, 5, 0.04, 0.06),
      longTermDebt: generateFinancialData(15000, 5, 0.05, 0.03)
    },
    incomeStatement: {
      revenue: generateFinancialData(120000, 5, 0.12, 0.04),
      costOfRevenue: generateFinancialData(25000, 5, 0.1, 0.03),
      grossProfit: generateFinancialData(95000, 5, 0.13, 0.04),
      operatingExpenses: generateFinancialData(65000, 5, 0.15, 0.05),
      operatingIncome: generateFinancialData(30000, 5, 0.09, 0.08),
      netIncome: generateFinancialData(25000, 5, 0.08, 0.09),
      eps: generateFinancialData(9.5, 5, 0.1, 0.08),
      ebitda: generateFinancialData(40000, 5, 0.09, 0.07)
    },
    cashFlow: {
      operatingCashFlow: generateFinancialData(50000, 5, 0.1, 0.06),
      capitalExpenditures: generateFinancialData(-25000, 5, 0.12, 0.07),
      freeCashFlow: generateFinancialData(25000, 5, 0.08, 0.09),
      dividendsPaid: generateFinancialData(0, 5, 0, 0),
      netInvestingCashFlow: generateFinancialData(-30000, 5, 0.11, 0.08),
      netFinancingCashFlow: generateFinancialData(-15000, 5, 0.07, 0.1),
      netChangeInCash: generateFinancialData(5000, 5, 0.05, 0.15)
    },
    ratios: {
      peRatio: generateFinancialData(30, 5, 0.03, 0.12),
      pbRatio: generateFinancialData(6, 5, 0.02, 0.1),
      psRatio: generateFinancialData(6.5, 5, 0.02, 0.11),
      evToEbitda: generateFinancialData(20, 5, 0.03, 0.09),
      returnOnEquity: generateFinancialData(0.19, 5, 0.01, 0.06),
      returnOnAssets: generateFinancialData(0.14, 5, 0.01, 0.05),
      netProfitMargin: generateFinancialData(0.21, 5, 0.01, 0.04),
      grossProfitMargin: generateFinancialData(0.79, 5, 0.005, 0.03),
      revenueGrowth: generateFinancialData(0.12, 5, -0.01, 0.05),
      epsGrowth: generateFinancialData(0.1, 5, -0.015, 0.07),
      debtToEquity: generateFinancialData(0.13, 5, -0.01, 0.02),
      currentRatio: generateFinancialData(4.5, 5, 0.01, 0.04),
      quickRatio: generateFinancialData(4.4, 5, 0.01, 0.05),
      assetTurnover: generateFinancialData(0.67, 5, 0.005, 0.03),
      inventoryTurnover: generateFinancialData(25, 5, 0.02, 0.06)
    },
    marketCap: 1200000000000,
    currentPrice: 472.22,
    yearHigh: 531.49,
    yearLow: 244.61,
    dividendYield: 0,
    beta: 1.34
  },
  'TSLA': {
    company: mockCompanies[5],
    stockPrices: generateStockPrices(252.08, 1095, 0.025), // 3 years, higher volatility
    balanceSheet: {
      totalAssets: generateFinancialData(90000, 5, 0.25, 0.05),
      totalLiabilities: generateFinancialData(40000, 5, 0.2, 0.05),
      totalEquity: generateFinancialData(50000, 5, 0.3, 0.06),
      cashAndEquivalents: generateFinancialData(20000, 5, 0.15, 0.1),
      shortTermInvestments: generateFinancialData(5000, 5, 0.1, 0.08),
      accountsReceivable: generateFinancialData(3000, 5, 0.2, 0.07),
      inventory: generateFinancialData(8000, 5, 0.25, 0.08),
      propertyPlantEquipment: generateFinancialData(30000, 5, 0.3, 0.04),
      goodwill: generateFinancialData(200, 5, 0.05, 0.02),
      intangibleAssets: generateFinancialData(300, 5, 0.06, 0.03),
      accountsPayable: generateFinancialData(12000, 5, 0.22, 0.05),
      shortTermDebt: generateFinancialData(3000, 5, 0.1, 0.08),
      longTermDebt: generateFinancialData(10000, 5, 0.12, 0.06)
    },
    incomeStatement: {
      revenue: generateFinancialData(80000, 5, 0.3, 0.06),
      costOfRevenue: generateFinancialData(60000, 5, 0.28, 0.05),
      grossProfit: generateFinancialData(20000, 5, 0.35, 0.07),
      operatingExpenses: generateFinancialData(12000, 5, 0.25, 0.08),
      operatingIncome: generateFinancialData(8000, 5, 0.4, 0.12),
      netIncome: generateFinancialData(7000, 5, 0.45, 0.15),
      eps: generateFinancialData(2.2, 5, 0.4, 0.14),
      ebitda: generateFinancialData(12000, 5, 0.38, 0.1)
    },
    cashFlow: {
      operatingCashFlow: generateFinancialData(15000, 5, 0.35, 0.1),
      capitalExpenditures: generateFinancialData(-8000, 5, 0.3, 0.12),
      freeCashFlow: generateFinancialData(7000, 5, 0.4, 0.15),
      dividendsPaid: generateFinancialData(0, 5, 0, 0),
      netInvestingCashFlow: generateFinancialData(-10000, 5, 0.28, 0.13),
      netFinancingCashFlow: generateFinancialData(5000, 5, 0.2, 0.15),
      netChangeInCash: generateFinancialData(10000, 5, 0.25, 0.2)
    },
    ratios: {
      peRatio: generateFinancialData(100, 5, 0.1, 0.25),
      pbRatio: generateFinancialData(15, 5, 0.08, 0.2),
      psRatio: generateFinancialData(8, 5, 0.07, 0.18),
      evToEbitda: generateFinancialData(60, 5, 0.09, 0.22),
      returnOnEquity: generateFinancialData(0.14, 5, 0.03, 0.1),
      returnOnAssets: generateFinancialData(0.08, 5, 0.03, 0.09),
      netProfitMargin: generateFinancialData(0.09, 5, 0.03, 0.08),
      grossProfitMargin: generateFinancialData(0.25, 5, 0.02, 0.06),
      revenueGrowth: generateFinancialData(0.3, 5, -0.03, 0.1),
      epsGrowth: generateFinancialData(0.4, 5, -0.04, 0.15),
      debtToEquity: generateFinancialData(0.26, 5, -0.02, 0.05),
      currentRatio: generateFinancialData(1.6, 5, 0.02, 0.07),
      quickRatio: generateFinancialData(1.2, 5, 0.02, 0.08),
      assetTurnover: generateFinancialData(0.89, 5, 0.01, 0.05),
      inventoryTurnover: generateFinancialData(7.5, 5, 0.04, 0.1)
    },
    marketCap: 800000000000,
    currentPrice: 252.08,
    yearHigh: 299.29,
    yearLow: 138.80,
    dividendYield: 0,
    beta: 2.01
  },
  'NVDA': {
    company: mockCompanies[6],
    stockPrices: generateStockPrices(890.99, 1095, 0.023), // 3 years
    balanceSheet: {
      totalAssets: generateFinancialData(60000, 5, 0.2, 0.04),
      totalLiabilities: generateFinancialData(20000, 5, 0.15, 0.04),
      totalEquity: generateFinancialData(40000, 5, 0.22, 0.05),
      cashAndEquivalents: generateFinancialData(15000, 5, 0.12, 0.09),
      shortTermInvestments: generateFinancialData(10000, 5, 0.1, 0.07),
      accountsReceivable: generateFinancialData(5000, 5, 0.18, 0.06),
      inventory: generateFinancialData(3000, 5, 0.16, 0.07),
      propertyPlantEquipment: generateFinancialData(5000, 5, 0.14, 0.03),
      goodwill: generateFinancialData(4000, 5, 0.05, 0.02),
      intangibleAssets: generateFinancialData(2000, 5, 0.06, 0.03),
      accountsPayable: generateFinancialData(2000, 5, 0.15, 0.04),
      shortTermDebt: generateFinancialData(1000, 5, 0.08, 0.07),
      longTermDebt: generateFinancialData(10000, 5, 0.1, 0.05)
    },
    incomeStatement: {
      revenue: generateFinancialData(60000, 5, 0.25, 0.05),
      costOfRevenue: generateFinancialData(20000, 5, 0.2, 0.04),
      grossProfit: generateFinancialData(40000, 5, 0.28, 0.06),
      operatingExpenses: generateFinancialData(15000, 5, 0.18, 0.07),
      operatingIncome: generateFinancialData(25000, 5, 0.35, 0.1),
      netIncome: generateFinancialData(20000, 5, 0.38, 0.12),
      eps: generateFinancialData(8.1, 5, 0.4, 0.11),
      ebitda: generateFinancialData(28000, 5, 0.33, 0.09)
    },
    cashFlow: {
      operatingCashFlow: generateFinancialData(25000, 5, 0.3, 0.08),
      capitalExpenditures: generateFinancialData(-4000, 5, 0.2, 0.1),
      freeCashFlow: generateFinancialData(21000, 5, 0.32, 0.12),
      dividendsPaid: generateFinancialData(-1000, 5, 0.15, 0.03),
      netInvestingCashFlow: generateFinancialData(-8000, 5, 0.22, 0.11),
      netFinancingCashFlow: generateFinancialData(-10000, 5, 0.18, 0.13),
      netChangeInCash: generateFinancialData(7000, 5, 0.2, 0.18)
    },
    ratios: {
      peRatio: generateFinancialData(90, 5, 0.08, 0.2),
      pbRatio: generateFinancialData(45, 5, 0.07, 0.18),
      psRatio: generateFinancialData(30, 5, 0.06, 0.16),
      evToEbitda: generateFinancialData(80, 5, 0.07, 0.19),
      returnOnEquity: generateFinancialData(0.5, 5, 0.03, 0.09),
      returnOnAssets: generateFinancialData(0.33, 5, 0.03, 0.08),
      netProfitMargin: generateFinancialData(0.33, 5, 0.02, 0.07),
      grossProfitMargin: generateFinancialData(0.67, 5, 0.01, 0.05),
      revenueGrowth: generateFinancialData(0.25, 5, -0.02, 0.08),
      epsGrowth: generateFinancialData(0.4, 5, -0.03, 0.13),
      debtToEquity: generateFinancialData(0.28, 5, -0.02, 0.04),
      currentRatio: generateFinancialData(3.8, 5, 0.02, 0.06),
      quickRatio: generateFinancialData(3.5, 5, 0.02, 0.07),
      assetTurnover: generateFinancialData(1, 5, 0.01, 0.04),
      inventoryTurnover: generateFinancialData(6.7, 5, 0.03, 0.09)
    },
    marketCap: 2200000000000,
    currentPrice: 890.99,
    yearHigh: 974.00,
    yearLow: 222.97,
    dividendYield: 0.0004,
    beta: 1.65
  },
  'SSNLF': {
    company: mockCompanies[7],
    stockPrices: generateStockPrices(59.80, 1095, 0.014), // 3 years
    balanceSheet: {
      totalAssets: generateFinancialData(380000, 5, 0.07, 0.03),
      totalLiabilities: generateFinancialData(120000, 5, 0.06, 0.03),
      totalEquity: generateFinancialData(260000, 5, 0.08, 0.04),
      cashAndEquivalents: generateFinancialData(100000, 5, 0.05, 0.08),
      shortTermInvestments: generateFinancialData(30000, 5, 0.04, 0.06),
      accountsReceivable: generateFinancialData(35000, 5, 0.06, 0.05),
      inventory: generateFinancialData(30000, 5, 0.05, 0.06),
      propertyPlantEquipment: generateFinancialData(120000, 5, 0.08, 0.03),
      goodwill: generateFinancialData(5000, 5, 0.02, 0.02),
      intangibleAssets: generateFinancialData(7000, 5, 0.03, 0.03),
      accountsPayable: generateFinancialData(25000, 5, 0.06, 0.04),
      shortTermDebt: generateFinancialData(10000, 5, 0.05, 0.07),
      longTermDebt: generateFinancialData(40000, 5, 0.04, 0.04)
    },
    incomeStatement: {
      revenue: generateFinancialData(230000, 5, 0.06, 0.05),
      costOfRevenue: generateFinancialData(150000, 5, 0.05, 0.04),
      grossProfit: generateFinancialData(80000, 5, 0.07, 0.05),
      operatingExpenses: generateFinancialData(50000, 5, 0.06, 0.06),
      operatingIncome: generateFinancialData(30000, 5, 0.08, 0.09),
      netIncome: generateFinancialData(25000, 5, 0.07, 0.1),
      eps: generateFinancialData(4.2, 5, 0.08, 0.09),
      ebitda: generateFinancialData(45000, 5, 0.07, 0.08)
    },
    cashFlow: {
      operatingCashFlow: generateFinancialData(40000, 5, 0.07, 0.07),
      capitalExpenditures: generateFinancialData(-35000, 5, 0.06, 0.08),
      freeCashFlow: generateFinancialData(5000, 5, 0.1, 0.15),
      dividendsPaid: generateFinancialData(-5000, 5, 0.05, 0.03),
      netInvestingCashFlow: generateFinancialData(-40000, 5, 0.06, 0.09),
      netFinancingCashFlow: generateFinancialData(-5000, 5, 0.04, 0.1),
      netChangeInCash: generateFinancialData(-5000, 5, 0.03, 0.18)
    },
    ratios: {
      peRatio: generateFinancialData(15, 5, 0.02, 0.1),
      pbRatio: generateFinancialData(1.4, 5, 0.01, 0.08),
      psRatio: generateFinancialData(1.6, 5, 0.01, 0.09),
      evToEbitda: generateFinancialData(8, 5, 0.02, 0.07),
      returnOnEquity: generateFinancialData(0.1, 5, 0.01, 0.05),
      returnOnAssets: generateFinancialData(0.07, 5, 0.01, 0.04),
      netProfitMargin: generateFinancialData(0.11, 5, 0.01, 0.03),
      grossProfitMargin: generateFinancialData(0.35, 5, 0.005, 0.02),
      revenueGrowth: generateFinancialData(0.06, 5, -0.005, 0.04),
      epsGrowth: generateFinancialData(0.08, 5, -0.01, 0.06),
      debtToEquity: generateFinancialData(0.19, 5, -0.005, 0.03),
      currentRatio: generateFinancialData(2.5, 5, 0.01, 0.03),
      quickRatio: generateFinancialData(2.1, 5, 0.01, 0.04),
      assetTurnover: generateFinancialData(0.6, 5, 0.005, 0.02),
      inventoryTurnover: generateFinancialData(5, 5, 0.02, 0.05)
    },
    marketCap: 400000000000,
    currentPrice: 59.80,
    yearHigh: 68.42,
    yearLow: 46.95,
    dividendYield: 0.02,
    beta: 0.85
  }
};

// Enrich mock data with calculated metrics
Object.keys(mockCompanyData).forEach(key => {
  const company = mockCompanyData[key];
  company.operationalMetrics = calculateOperationalMetrics(company);
  company.valuationMetrics = calculateValuationMetrics(company);
  company.perShareMetrics = calculatePerShareMetrics(company);
});