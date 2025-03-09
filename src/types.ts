export interface Company {
  id: string;
  name: string;
  symbol: string;
  industry: string;
  logo?: string;
}

export interface FinancialData {
  year: number;
  quarter?: number;
  value: number;
}

export interface BalanceSheetData {
  totalAssets: FinancialData[];
  totalLiabilities: FinancialData[];
  totalEquity: FinancialData[];
  cashAndEquivalents: FinancialData[];
  shortTermInvestments: FinancialData[];
  accountsReceivable: FinancialData[];
  inventory: FinancialData[];
  propertyPlantEquipment: FinancialData[];
  goodwill: FinancialData[];
  intangibleAssets: FinancialData[];
  accountsPayable: FinancialData[];
  shortTermDebt: FinancialData[];
  longTermDebt: FinancialData[];
}

export interface IncomeStatementData {
  revenue: FinancialData[];
  costOfRevenue: FinancialData[];
  grossProfit: FinancialData[];
  operatingExpenses: FinancialData[];
  operatingIncome: FinancialData[];
  netIncome: FinancialData[];
  eps: FinancialData[];
  ebitda: FinancialData[];
}

export interface CashFlowData {
  operatingCashFlow: FinancialData[];
  capitalExpenditures: FinancialData[];
  freeCashFlow: FinancialData[];
  dividendsPaid: FinancialData[];
  netInvestingCashFlow: FinancialData[];
  netFinancingCashFlow: FinancialData[];
  netChangeInCash: FinancialData[];
}

export interface RatioData {
  // Valuation
  peRatio: FinancialData[];
  pbRatio: FinancialData[];
  psRatio: FinancialData[];
  evToEbitda: FinancialData[];
  
  // Profitability
  returnOnEquity: FinancialData[];
  returnOnAssets: FinancialData[];
  netProfitMargin: FinancialData[];
  grossProfitMargin: FinancialData[];
  
  // Growth
  revenueGrowth: FinancialData[];
  epsGrowth: FinancialData[];
  
  // Risk
  debtToEquity: FinancialData[];
  currentRatio: FinancialData[];
  quickRatio: FinancialData[];
  
  // Efficiency
  assetTurnover: FinancialData[];
  inventoryTurnover: FinancialData[];
}

export interface StockPriceData {
  date: string;
  price: number;
}

export interface OperationalMetrics {
  daysOfInventoryOnHand?: FinancialData[];
  daysPayablesOutstanding?: FinancialData[];
  daysSalesOutstanding?: FinancialData[];
  cashConversionCycle?: FinancialData[];
  interestCoverageRatio?: FinancialData[];
  incomeQuality?: FinancialData[]; // Operating Cash Flow to Net Income
  rdToRevenue?: FinancialData[];
  capexToOperatingCash?: FinancialData[];
  capexToDepreciation?: FinancialData[];
}

export interface ValuationMetrics {
  grahamNumber?: FinancialData[];
  freeCashFlowYield?: FinancialData[];
  pegRatio?: FinancialData[];
  evToSales?: FinancialData[];
  evToFcf?: FinancialData[];
  returnOnInvestedCapital?: FinancialData[];
  netDebtToEbitda?: FinancialData[];
}

export interface PerShareMetrics {
  revenuePerShare?: FinancialData[];
  netIncomePerShare?: FinancialData[]; // Similar to EPS but might include comprehensive income
  operatingCashFlowPerShare?: FinancialData[];
  freeCashFlowPerShare?: FinancialData[];
  bookValuePerShare?: FinancialData[];
  tangibleBookValuePerShare?: FinancialData[];
}

export interface CompanyData {
  company: Company;
  balanceSheet: BalanceSheetData;
  incomeStatement: IncomeStatementData;
  cashFlow: CashFlowData;
  ratios: RatioData;
  marketCap: number;
  currentPrice: number;
  yearHigh: number;
  yearLow: number;
  dividendYield: number;
  beta: number;
  stockPrices: StockPriceData[];
  operationalMetrics?: OperationalMetrics;
  valuationMetrics?: ValuationMetrics;
  perShareMetrics?: PerShareMetrics;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth?: number;
  }[];
}