// Configuration file for application settings

// API configuration
export const API_CONFIG = {
  // FinancialModelingPrep API key
  // In a production app, this would be loaded from environment variables
  // For example: FMP_API_KEY: import.meta.env.VITE_FMP_API_KEY || '',
  FMP_API_KEY: '01YNALmKYQUKzvd1vJrcsvrLSofuUTA8',//'uoo5z4vjEHjGx8lcqEv6XKng0ioW7cuY',
  
  // Base URL for FinancialModelingPrep API
  FMP_BASE_URL: 'https://financialmodelingprep.com/api/v3',
  
  // Cache duration in milliseconds (30 minutes)
  CACHE_DURATION: 30 * 60 * 1000,
  
  // Gemini API configuration
  // In a production app, this would be loaded from environment variables 
  // You can create a .env file with VITE_GEMINI_API_KEY=your_key
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyC-Zvq9JfdrVa39L7cK5RG40DTKicbTYiA',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  
  // Maximum number of metrics to include in a single Gemini request
  GEMINI_MAX_METRICS_PER_REQUEST: 45,
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
  // Enable AI-powered metric importance ranking
  ENABLE_AI_RANKING: true,
  // Enable logging of Gemini API requests and responses
  LOG_GEMINI_API: true,
  // Enable the new full overview page implementation
  ENABLE_FULL_OVERVIEW: true,
};

// Enum Definitions for Metrics
export enum MetricCategory {
  FINANCIAL_HEALTH = 'financialHealth',
  OPERATIONAL_EFFICIENCY = 'operationalEfficiency',
  INVESTOR_VALUE = 'investorValue',
  MARKET_PERFORMANCE_VOLATILITY = 'marketPerformanceVolatility',
  RESEARCH_INNOVATION = 'researchInnovation'
}

export enum FinancialMetric {
  // Financial Health metrics
  DEBT_TO_EQUITY = 'Debt-to-Equity Ratio',
  CURRENT_RATIO = 'Current Ratio',
  QUICK_RATIO = 'Quick Ratio',
  INTEREST_COVERAGE = 'Interest Coverage Ratio',
  NET_DEBT_TO_EBITDA = 'Net Debt to EBITDA',
  DEBT_TO_EBITDA = 'Debt-to-EBITDA',
  FINANCIAL_LEVERAGE = 'Financial Leverage',
  CURRENT_LIABILITIES_TO_ASSETS = 'Current Liabilities to Total Assets',
  CASH_RATIO = 'Cash Ratio',
  WORKING_CAPITAL_RATIO = 'Working Capital Ratio',
  FIXED_CHARGE_COVERAGE = 'Fixed Charge Coverage',
  SOLVENCY_RATIO = 'Solvency Ratio',
  ALTMAN_Z_SCORE = 'Altman Z-Score',
  OCF_TO_CURRENT_LIABILITIES = 'Operating Cash Flow to Current Liabilities',
  FCF_TO_DEBT = 'Free Cash Flow to Debt',
  
  // Operational Efficiency metrics
  DAYS_INVENTORY_ON_HAND = 'Days of Inventory On Hand',
  DAYS_SALES_OUTSTANDING = 'Days Sales Outstanding',
  DAYS_PAYABLES_OUTSTANDING = 'Days Payables Outstanding',
  CASH_CONVERSION_CYCLE = 'Cash Conversion Cycle',
  INVENTORY_TURNOVER = 'Inventory Turnover',
  ASSET_TURNOVER = 'Asset Turnover',
  FIXED_ASSET_TURNOVER = 'Fixed Asset Turnover',
  ACCOUNTS_RECEIVABLE_TURNOVER = 'Accounts Receivable Turnover',
  WORKING_CAPITAL_TURNOVER = 'Working Capital Turnover',
  OPERATING_CYCLE = 'Operating Cycle',
  OPERATING_MARGIN = 'Operating Margin',
  EBITDA_MARGIN = 'EBITDA Margin',
  SGA_TO_REVENUE = 'SG&A to Revenue',
  REVENUE_PER_EMPLOYEE = 'Revenue per Employee',
  OPEX_TO_REVENUE = 'Operating Expenses to Revenue',
  
  // Investor Value metrics
  PE_RATIO = 'Price-to-Earnings Ratio (P/E)',
  PB_RATIO = 'Price-to-Book Ratio (P/B)',
  PS_RATIO = 'Price-to-Sales Ratio (P/S)',
  EV_EBITDA = 'EV/EBITDA',
  EV_REVENUE = 'EV/Revenue',
  EV_FCF = 'EV/FCF',
  PEG_RATIO = 'PEG Ratio',
  GRAHAM_NUMBER = 'Graham Number',
  DIVIDEND_YIELD = 'Dividend Yield',
  DIVIDEND_PAYOUT_RATIO = 'Dividend Payout Ratio',
  FCF_YIELD = 'Free Cash Flow Yield',
  SHAREHOLDER_YIELD = 'Shareholder Yield',
  ROE = 'Return on Equity (ROE)',
  ROA = 'Return on Assets (ROA)',
  ROIC = 'Return on Invested Capital (ROIC)',
  EARNINGS_YIELD = 'Earnings Yield',
  NET_PROFIT_MARGIN = 'Net Profit Margin',
  GROSS_PROFIT_MARGIN = 'Gross Profit Margin',
  
  // Market Performance & Volatility metrics
  BETA = 'Beta',
  STOCK_PRICE_VOLATILITY = 'Stock Price Volatility',
  FIFTY_TWO_WEEK_RANGE = '52-Week Price Range',
  
  // Research & Innovation metrics
  RD_TO_REVENUE = 'R&D to Revenue',
  CAPEX_TO_REVENUE = 'CapEx to Revenue',
  CAPEX_TO_DEPRECIATION = 'CapEx to Depreciation',
  CAPEX_TO_OCF = 'CapEx to Operating Cash Flow',
  RD_GROWTH_RATE = 'R&D Growth Rate'
}

// Metric Categories for AI Importance Ranking
export const METRIC_CATEGORIES = {
  [MetricCategory.FINANCIAL_HEALTH]: [
    FinancialMetric.DEBT_TO_EQUITY,
    FinancialMetric.CURRENT_RATIO,
    FinancialMetric.QUICK_RATIO,
    FinancialMetric.INTEREST_COVERAGE,
    FinancialMetric.NET_DEBT_TO_EBITDA,
    FinancialMetric.DEBT_TO_EBITDA,
    FinancialMetric.FINANCIAL_LEVERAGE,
    FinancialMetric.CURRENT_LIABILITIES_TO_ASSETS,
    FinancialMetric.CASH_RATIO,
    FinancialMetric.WORKING_CAPITAL_RATIO,
    FinancialMetric.FIXED_CHARGE_COVERAGE,
    FinancialMetric.SOLVENCY_RATIO,
    FinancialMetric.ALTMAN_Z_SCORE,
    FinancialMetric.OCF_TO_CURRENT_LIABILITIES,
    FinancialMetric.FCF_TO_DEBT
  ],
  [MetricCategory.OPERATIONAL_EFFICIENCY]: [
    FinancialMetric.DAYS_INVENTORY_ON_HAND,
    FinancialMetric.DAYS_SALES_OUTSTANDING,
    FinancialMetric.DAYS_PAYABLES_OUTSTANDING,
    FinancialMetric.CASH_CONVERSION_CYCLE,
    FinancialMetric.INVENTORY_TURNOVER,
    FinancialMetric.ASSET_TURNOVER,
    FinancialMetric.FIXED_ASSET_TURNOVER,
    FinancialMetric.ACCOUNTS_RECEIVABLE_TURNOVER,
    FinancialMetric.WORKING_CAPITAL_TURNOVER,
    FinancialMetric.OPERATING_CYCLE,
    FinancialMetric.OPERATING_MARGIN,
    FinancialMetric.EBITDA_MARGIN,
    FinancialMetric.SGA_TO_REVENUE,
    FinancialMetric.REVENUE_PER_EMPLOYEE,
    FinancialMetric.OPEX_TO_REVENUE
  ],
  [MetricCategory.INVESTOR_VALUE]: [
    FinancialMetric.PE_RATIO,
    FinancialMetric.PB_RATIO,
    FinancialMetric.PS_RATIO,
    FinancialMetric.EV_EBITDA,
    FinancialMetric.EV_REVENUE,
    FinancialMetric.EV_FCF,
    FinancialMetric.PEG_RATIO,
    FinancialMetric.GRAHAM_NUMBER,
    FinancialMetric.DIVIDEND_YIELD,
    FinancialMetric.DIVIDEND_PAYOUT_RATIO,
    FinancialMetric.FCF_YIELD,
    FinancialMetric.SHAREHOLDER_YIELD,
    FinancialMetric.ROE,
    FinancialMetric.ROA,
    FinancialMetric.ROIC,
    FinancialMetric.EARNINGS_YIELD,
    FinancialMetric.NET_PROFIT_MARGIN,
    FinancialMetric.GROSS_PROFIT_MARGIN
  ],
  [MetricCategory.MARKET_PERFORMANCE_VOLATILITY]: [
    FinancialMetric.BETA,
    FinancialMetric.STOCK_PRICE_VOLATILITY,
    FinancialMetric.FIFTY_TWO_WEEK_RANGE
  ],
  [MetricCategory.RESEARCH_INNOVATION]: [
    FinancialMetric.RD_TO_REVENUE,
    FinancialMetric.CAPEX_TO_REVENUE,
    FinancialMetric.CAPEX_TO_DEPRECIATION,
    FinancialMetric.CAPEX_TO_OCF,
    FinancialMetric.RD_GROWTH_RATE
  ]
};

// Map metric names to data paths in the CompanyData object
export const METRIC_DATA_PATHS: Record<FinancialMetric, string> = {
  // Financial Health metrics
  [FinancialMetric.DEBT_TO_EQUITY]: 'ratios.debtToEquity',
  [FinancialMetric.CURRENT_RATIO]: 'ratios.currentRatio',
  [FinancialMetric.QUICK_RATIO]: 'ratios.quickRatio',
  [FinancialMetric.INTEREST_COVERAGE]: 'operationalMetrics.interestCoverageRatio',
  [FinancialMetric.NET_DEBT_TO_EBITDA]: 'valuationMetrics.netDebtToEbitda',
  [FinancialMetric.DEBT_TO_EBITDA]: 'valuationMetrics.debtToEbitda',
  [FinancialMetric.FINANCIAL_LEVERAGE]: 'ratios.financialLeverage',
  [FinancialMetric.CURRENT_LIABILITIES_TO_ASSETS]: 'ratios.currentLiabilitiesToAssets',
  [FinancialMetric.CASH_RATIO]: 'ratios.cashRatio',
  [FinancialMetric.WORKING_CAPITAL_RATIO]: 'ratios.workingCapitalRatio',
  [FinancialMetric.FIXED_CHARGE_COVERAGE]: 'ratios.fixedChargeCoverage',
  [FinancialMetric.SOLVENCY_RATIO]: 'ratios.solvencyRatio',
  [FinancialMetric.ALTMAN_Z_SCORE]: 'ratios.altmanZScore',
  [FinancialMetric.OCF_TO_CURRENT_LIABILITIES]: 'ratios.ocfToCurrentLiabilities',
  [FinancialMetric.FCF_TO_DEBT]: 'ratios.fcfToDebt',
  
  // Operational Efficiency metrics
  [FinancialMetric.DAYS_INVENTORY_ON_HAND]: 'operationalMetrics.daysOfInventoryOnHand',
  [FinancialMetric.DAYS_SALES_OUTSTANDING]: 'operationalMetrics.daysSalesOutstanding',
  [FinancialMetric.DAYS_PAYABLES_OUTSTANDING]: 'operationalMetrics.daysPayablesOutstanding',
  [FinancialMetric.CASH_CONVERSION_CYCLE]: 'operationalMetrics.cashConversionCycle',
  [FinancialMetric.INVENTORY_TURNOVER]: 'ratios.inventoryTurnover',
  [FinancialMetric.ASSET_TURNOVER]: 'ratios.assetTurnover',
  [FinancialMetric.FIXED_ASSET_TURNOVER]: 'ratios.fixedAssetTurnover',
  [FinancialMetric.ACCOUNTS_RECEIVABLE_TURNOVER]: 'ratios.accountsReceivableTurnover',
  [FinancialMetric.WORKING_CAPITAL_TURNOVER]: 'ratios.workingCapitalTurnover',
  [FinancialMetric.OPERATING_CYCLE]: 'operationalMetrics.operatingCycle',
  [FinancialMetric.OPERATING_MARGIN]: 'ratios.operatingMargin',
  [FinancialMetric.EBITDA_MARGIN]: 'ratios.ebitdaMargin',
  [FinancialMetric.SGA_TO_REVENUE]: 'ratios.sgaToRevenue',
  [FinancialMetric.REVENUE_PER_EMPLOYEE]: 'ratios.revenuePerEmployee',
  [FinancialMetric.OPEX_TO_REVENUE]: 'ratios.opexToRevenue',
  
  // Investor Value metrics
  [FinancialMetric.PE_RATIO]: 'ratios.peRatio',
  [FinancialMetric.PB_RATIO]: 'ratios.pbRatio',
  [FinancialMetric.PS_RATIO]: 'ratios.psRatio',
  [FinancialMetric.EV_EBITDA]: 'ratios.evToEbitda',
  [FinancialMetric.EV_REVENUE]: 'valuationMetrics.evToSales',
  [FinancialMetric.EV_FCF]: 'valuationMetrics.evToFcf',
  [FinancialMetric.PEG_RATIO]: 'valuationMetrics.pegRatio',
  [FinancialMetric.GRAHAM_NUMBER]: 'valuationMetrics.grahamNumber',
  [FinancialMetric.DIVIDEND_YIELD]: 'dividendYield',
  [FinancialMetric.DIVIDEND_PAYOUT_RATIO]: 'ratios.dividendPayoutRatio',
  [FinancialMetric.FCF_YIELD]: 'valuationMetrics.freeCashFlowYield',
  [FinancialMetric.SHAREHOLDER_YIELD]: 'valuationMetrics.shareholderYield',
  [FinancialMetric.ROE]: 'ratios.returnOnEquity',
  [FinancialMetric.ROA]: 'ratios.returnOnAssets',
  [FinancialMetric.ROIC]: 'valuationMetrics.returnOnInvestedCapital',
  [FinancialMetric.EARNINGS_YIELD]: 'ratios.earningsYield',
  [FinancialMetric.NET_PROFIT_MARGIN]: 'ratios.netProfitMargin',
  [FinancialMetric.GROSS_PROFIT_MARGIN]: 'ratios.grossProfitMargin',
  
  // Market Performance & Volatility metrics
  [FinancialMetric.BETA]: 'marketMetrics.beta',
  [FinancialMetric.STOCK_PRICE_VOLATILITY]: 'marketMetrics.stockPriceVolatility',
  [FinancialMetric.FIFTY_TWO_WEEK_RANGE]: 'marketMetrics.fiftyTwoWeekRange',
  
  // Research & Innovation metrics
  [FinancialMetric.RD_TO_REVENUE]: 'operationalMetrics.rdToRevenue',
  [FinancialMetric.CAPEX_TO_REVENUE]: 'ratios.capexToRevenue',
  [FinancialMetric.CAPEX_TO_DEPRECIATION]: 'ratios.capexToDepreciation',
  [FinancialMetric.CAPEX_TO_OCF]: 'operationalMetrics.capexToOperatingCash',
  [FinancialMetric.RD_GROWTH_RATE]: 'innovationMetrics.rdGrowthRate'
};