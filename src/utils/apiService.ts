import FinancialModelingPrepAPI from './FinancialModelingPrepAPI';
import { API_CONFIG, FEATURES } from './config';
// Import types directly from the types.ts file instead
import { cachedFetch } from './cacheUtils';

// Define our response types here to avoid circular dependencies
export interface CompanyProfileResponse {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export interface BalanceSheetResponse {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  cashAndShortTermInvestments: number;
  netReceivables: number;
  inventory: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  propertyPlantEquipmentNet: number;
  goodwill: number;
  intangibleAssets: number;
  goodwillAndIntangibleAssets: number;
  longTermInvestments: number;
  taxAssets: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;
  otherAssets: number;
  totalAssets: number;
  accountPayables: number;
  shortTermDebt: number;
  taxPayables: number;
  deferredRevenue: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  deferredRevenueNonCurrent: number;
  deferredTaxLiabilitiesNonCurrent: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  otherLiabilities: number;
  capitalLeaseObligations: number;
  totalLiabilities: number;
  preferredStock: number;
  commonStock: number;
  retainedEarnings: number;
  accumulatedOtherComprehensiveIncomeLoss: number;
  othertotalStockholdersEquity: number;
  totalStockholdersEquity: number;
  totalEquity: number;
  totalLiabilitiesAndStockholdersEquity: number;
  minorityInterest: number;
  totalLiabilitiesAndTotalEquity: number;
  totalInvestments: number;
  totalDebt: number;
  netDebt: number;
  link: string;
  finalLink: string;
}

export interface IncomeStatementResponse {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  generalAndAdministrativeExpenses: number;
  sellingAndMarketingExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  otherExpenses: number;
  operatingExpenses: number;
  costAndExpenses: number;
  interestIncome: number;
  interestExpense: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebitdaratio: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  totalOtherIncomeExpensesNet: number;
  incomeBeforeTax: number;
  incomeBeforeTaxRatio: number;
  incomeTaxExpense: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
  link: string;
  finalLink: string;
}

export interface CashFlowResponse {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  netIncome: number;
  depreciationAndAmortization: number;
  deferredIncomeTax: number;
  stockBasedCompensation: number;
  changeInWorkingCapital: number;
  accountsReceivables: number;
  inventory: number;
  accountsPayables: number;
  otherWorkingCapital: number;
  otherNonCashItems: number;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  acquisitionsNet: number;
  purchasesOfInvestments: number;
  salesMaturitiesOfInvestments: number;
  otherInvestingActivites: number;
  netCashUsedForInvestingActivites: number;
  debtRepayment: number;
  commonStockIssued: number;
  commonStockRepurchased: number;
  dividendsPaid: number;
  otherFinancingActivites: number;
  netCashUsedProvidedByFinancingActivities: number;
  effectOfForexChangesOnCash: number;
  netChangeInCash: number;
  cashAtEndOfPeriod: number;
  cashAtBeginningOfPeriod: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  link: string;
  finalLink: string;
}

export interface KeyMetricsResponse {
  symbol: string;
  date: string;
  calendarYear: string;
  period: string;
  revenuePerShare: number;
  netIncomePerShare: number;
  operatingCashFlowPerShare: number;
  freeCashFlowPerShare: number;
  cashPerShare: number;
  bookValuePerShare: number;
  tangibleBookValuePerShare: number;
  shareholdersEquityPerShare: number;
  interestDebtPerShare: number;
  marketCap: number;
  enterpriseValue: number;
  peRatio: number;
  priceToSalesRatio: number;
  pocfratio: number;
  pfcfRatio: number;
  pbRatio: number;
  ptbRatio: number;
  evToSales: number;
  enterpriseValueOverEBITDA: number;
  evToOperatingCashFlow: number;
  evToFreeCashFlow: number;
  earningsYield: number;
  freeCashFlowYield: number;
  debtToEquity: number;
  debtToAssets: number;
  netDebtToEBITDA: number;
  currentRatio: number;
  interestCoverage: number;
  incomeQuality: number;
  dividendYield: number;
  payoutRatio: number;
  salesGeneralAndAdministrativeToRevenue: number;
  researchAndDdevelopementToRevenue: number;
  intangiblesToTotalAssets: number;
  capexToOperatingCashFlow: number;
  capexToRevenue: number;
  capexToDepreciation: number;
  stockBasedCompensationToRevenue: number;
  grahamNumber: number;
  roic: number;
  returnOnTangibleAssets: number;
  grahamNetNet: number;
  workingCapital: number;
  tangibleAssetValue: number;
  netCurrentAssetValue: number;
  investedCapital: number;
  averageReceivables: number;
  averagePayables: number;
  averageInventory: number;
  daysSalesOutstanding: number;
  daysPayablesOutstanding: number;
  daysOfInventoryOnHand: number;
  receivablesTurnover: number;
  payablesTurnover: number;
  inventoryTurnover: number;
  roe: number;
  capexPerShare: number;
}

export interface StockQuoteResponse {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export interface HistoricalPriceResponse {
  symbol: string;
  historical: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjClose?: number;
    unadjustedVolume?: number;
    change?: number;
    changePercent?: number;
    vwap?: number;
    label?: string;
    changeOverTime?: number;
  }[];
}

const fmpAPI = new FinancialModelingPrepAPI();

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
    
    console.log(`Getting mock data for endpoint: ${mockEndpoint}`);
    
    // Map endpoint to mock data type
    const mockDataType = MOCK_DATA_MAP[mockEndpoint] || mockEndpoint;
    
    // Get data from the correct file
    const mockData = mockApiResponse(mockDataType);
    
    if (!mockData) {
      throw new Error(`No mock data found for endpoint: ${mockEndpoint}`);
    }
    
    return mockData;
  } catch (error) {
    console.error('Error getting mock data:', error);
    return {};
  }
}

const MOCK_DATA_MAP: { [key: string]: string } = {
  'balance-sheet': 'balance-sheet',
  'cash-flow': 'cash-flow',
  'income-statement': 'income-statement',
  'key-metrics': 'key-metrics',
};


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
  
  // If API_CONFIG.API_KEY is empty, throw an error
  if (!API_CONFIG.API_KEY) {
    throw new Error('API key is not configured. Please set your FinancialModelingPrep API key in config.ts.');
  }

  // Create cache key from the endpoint and params
  const queryString = new URLSearchParams({ ...params, apikey: API_CONFIG.API_KEY }).toString();
  const url = `${API_CONFIG.API_BASE_URL}${endpoint}?${queryString}`;
  const cacheKey = `${endpoint}_${JSON.stringify(params)}`;

  // Use the persistent cache utility
  return cachedFetch<T>(
    async () => {
      try {
        // Make the API request
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorResponse = await response.text();
          throw new Error(`API request failed with status: ${response.status}, message: ${errorResponse}`);
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
  return fmpAPI.get(`/profile/${ticker}`);
}

/**
 * Get company income statement
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getIncomeStatement(ticker: string, limit: number = 5): Promise<IncomeStatementResponse[]> {
  return fmpAPI.get(`/income-statement/${ticker}`, { limit: limit.toString() });
}

/**
 * Get company balance sheet
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getBalanceSheet(ticker: string, limit: number = 5): Promise<BalanceSheetResponse[]> {
  return fmpAPI.get(`/balance-sheet-statement/${ticker}`, { limit: limit.toString() });
}

/**
 * Get company cash flow statement
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getCashFlowStatement(ticker: string, limit: number = 5): Promise<CashFlowResponse[]> {
  return fmpAPI.get(`/cash-flow-statement/${ticker}`, { limit: limit.toString() });
}

/**
 * Get company key metrics
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getKeyMetrics(ticker: string, limit: number = 5): Promise<KeyMetricsResponse[]> {
  return fmpAPI.get(`/key-metrics/${ticker}`, { limit: limit.toString() });
}

/**
 * Get company financial growth metrics
 * @param ticker - Company stock ticker symbol
 * @param limit - Number of years to retrieve (default: 5)
 */
export async function getFinancialGrowth(ticker: string, limit: number = 5): Promise<any> {
  return fmpAPI.get(`/financial-growth/${ticker}`, { limit: limit.toString() });
}

/**
 * Get stock quote (latest price and trading information)
 * @param ticker - Company stock ticker symbol
 */
export async function getStockQuote(ticker: string): Promise<StockQuoteResponse[]> {
  return fmpAPI.get(`/quote/${ticker}`);
}

/**
 * Get historical stock prices for a company
 * @param ticker - Company stock ticker symbol
 * @param from - Start date (YYYY-MM-DD)
 * @param to - End date (YYYY-MM-DD)
 */
export async function getHistoricalStockPrices(ticker: string, from: string, to: string): Promise<HistoricalPriceResponse> {
  return fmpAPI.get(`/historical-price-full/${ticker}`, { from, to });
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
    const results = await fmpAPI.get<{symbol: string, name: string, currency: string, stockExchange: string, exchangeShortName: string}[]>(`/search`, { query, limit: limit.toString() });
    
    // Filter to only US exchanges (most free plans only support US stocks)
    const usExchangeIdentifiers = ['NYSE', 'NASDAQ', 'AMEX', 'CBOE', 'US'];
    
    return results;
  } catch (error) {
    console.error('Error searching companies:', error);
    // Return empty array in case of error
    return [];
  }
}
