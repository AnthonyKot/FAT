/**
 * Financial Modeling Prep API sample responses
 * These constants can be used for mocking API calls in tests
 */

// Company Profile Response Interface
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

// Balance Sheet Response Interface
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

// Stock Quote Response Interface
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

// Key Metrics Response Interface
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

// Cash Flow Statement Response Interface
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

// Income Statement Response Interface
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

// Sample response data constants
export const sampleCompanyProfileResponse: CompanyProfileResponse[] = [
  {
    "symbol": "AAPL",
    "price": 241.395,
    "beta": 1.2,
    "volAvg": 50717047,
    "mktCap": 3626259829500,
    "lastDiv": 1,
    "range": "164.08-260.1",
    "changes": 4.095,
    "companyName": "Apple Inc.",
    "currency": "USD",
    "cik": "0000320193",
    "isin": "US0378331005",
    "cusip": "037833100",
    "exchange": "NASDAQ Global Select",
    "exchangeShortName": "NASDAQ",
    "industry": "Consumer Electronics",
    "website": "https://www.apple.com",
    "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod. It also provides AppleCare support and cloud services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts, as well as advertising services include third-party licensing arrangements and its own advertising platforms. In addition, the company offers various subscription-based services, such as Apple Arcade, a game subscription service; Apple Fitness+, a personalized fitness service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was founded in 1976 and is headquartered in Cupertino, California.",
    "ceo": "Mr. Timothy D. Cook",
    "sector": "Technology",
    "country": "US",
    "fullTimeEmployees": "150000",
    "phone": "(408) 996-1010",
    "address": "One Apple Park Way",
    "city": "Cupertino",
    "state": "CA",
    "zip": "95014",
    "dcfDiff": 80.5923,
    "dcf": 161.2476980274271,
    "image": "https://images.financialmodelingprep.com/symbol/AAPL.png",
    "ipoDate": "1980-12-12",
    "defaultImage": false,
    "isEtf": false,
    "isActivelyTrading": true,
    "isAdr": false,
    "isFund": false
  }
];

export const sampleBalanceSheetResponse: BalanceSheetResponse[] = [
  {
    "date": "2024-09-28",
    "symbol": "AAPL",
    "reportedCurrency": "USD",
    "cik": "0000320193",
    "fillingDate": "2024-11-01",
    "acceptedDate": "2024-11-01 06:01:36",
    "calendarYear": "2024",
    "period": "FY",
    "cashAndCashEquivalents": 29943000000,
    "shortTermInvestments": 35228000000,
    "cashAndShortTermInvestments": 65171000000,
    "netReceivables": 66243000000,
    "inventory": 7286000000,
    "otherCurrentAssets": 14287000000,
    "totalCurrentAssets": 152987000000,
    "propertyPlantEquipmentNet": 45680000000,
    "goodwill": 0,
    "intangibleAssets": 0,
    "goodwillAndIntangibleAssets": 0,
    "longTermInvestments": 91479000000,
    "taxAssets": 19499000000,
    "otherNonCurrentAssets": 55335000000,
    "totalNonCurrentAssets": 211993000000,
    "otherAssets": 0,
    "totalAssets": 364980000000,
    "accountPayables": 68960000000,
    "shortTermDebt": 22511000000,
    "taxPayables": 26601000000,
    "deferredRevenue": 8249000000,
    "otherCurrentLiabilities": 50071000000,
    "totalCurrentLiabilities": 176392000000,
    "longTermDebt": 96548000000,
    "deferredRevenueNonCurrent": 0,
    "deferredTaxLiabilitiesNonCurrent": 0,
    "otherNonCurrentLiabilities": 35090000000,
    "totalNonCurrentLiabilities": 131638000000,
    "otherLiabilities": 0,
    "capitalLeaseObligations": 12430000000,
    "totalLiabilities": 308030000000,
    "preferredStock": 0,
    "commonStock": 83276000000,
    "retainedEarnings": -19154000000,
    "accumulatedOtherComprehensiveIncomeLoss": -7172000000,
    "othertotalStockholdersEquity": 0,
    "totalStockholdersEquity": 56950000000,
    "totalEquity": 56950000000,
    "totalLiabilitiesAndStockholdersEquity": 364980000000,
    "minorityInterest": 0,
    "totalLiabilitiesAndTotalEquity": 364980000000,
    "totalInvestments": 126707000000,
    "totalDebt": 106629000000,
    "netDebt": 76686000000,
    "link": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/0000320193-24-000123-index.htm",
    "finalLink": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/aapl-20240928.htm"
  }
];

export const sampleStockQuoteResponse: StockQuoteResponse[] = [
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 241.395,
    "changesPercentage": 1.72566,
    "change": 4.095,
    "dayLow": 234.51,
    "dayHigh": 242.08,
    "yearHigh": 260.1,
    "yearLow": 164.08,
    "marketCap": 3626259829500,
    "priceAvg50": 240.221,
    "priceAvg200": 225.8813,
    "exchange": "NASDAQ",
    "volume": 56833360,
    "avgVolume": 50717047,
    "open": 236.95,
    "previousClose": 237.3,
    "eps": 6.97,
    "pe": 34.63,
    "earningsAnnouncement": "2025-04-30T10:59:00.000+0000",
    "sharesOutstanding": 15022100000,
    "timestamp": 1740776402
  }
];

export const sampleKeyMetricsResponse: KeyMetricsResponse[] = [
  {
    "symbol": "AAPL",
    "date": "2024-09-28",
    "calendarYear": "2024",
    "period": "FY",
    "revenuePerShare": 25.484914639368924,
    "netIncomePerShare": 6.109054070954992,
    "operatingCashFlowPerShare": 7.706965094592383,
    "freeCashFlowPerShare": 7.091275991064264,
    "cashPerShare": 4.247388013764271,
    "bookValuePerShare": 3.711600978715614,
    "tangibleBookValuePerShare": 3.711600978715614,
    "shareholdersEquityPerShare": 3.711600978715614,
    "interestDebtPerShare": 6.949329249507765,
    "marketCap": 3495160329570,
    "enterpriseValue": 3571846329570,
    "peRatio": 37.287278415656736,
    "priceToSalesRatio": 8.93822887866815,
    "pocfratio": 29.55638142954995,
    "pfcfRatio": 32.12256867269569,
    "pbRatio": 61.37243774486391,
    "ptbRatio": 61.37243774486391,
    "evToSales": 9.134339201273542,
    "enterpriseValueOverEBITDA": 26.524727497716487,
    "evToOperatingCashFlow": 30.204866893043786,
    "evToFreeCashFlow": 32.82735788662494,
    "earningsYield": 0.026818798327209237,
    "freeCashFlowYield": 0.03113076074921754,
    "debtToEquity": 1.872326602282704,
    "debtToAssets": 0.29215025480848267,
    "netDebtToEBITDA": 0.5694744580836323,
    "currentRatio": 0.8673125765340832,
    "interestCoverage": 0,
    "incomeQuality": 1.2615643936161134,
    "dividendYield": 0.0043585983369965175,
    "payoutRatio": 0.16252026969360758,
    "salesGeneralAndAdministrativeToRevenue": 0,
    "researchAndDdevelopementToRevenue": 0.08022299794136074,
    "intangiblesToTotalAssets": 0,
    "capexToOperatingCashFlow": 0.07988736110406414,
    "capexToRevenue": 0.02415896275269477,
    "capexToDepreciation": 0.8254259501965924,
    "stockBasedCompensationToRevenue": 0.02988990755303234,
    "grahamNumber": 22.587017267616833,
    "roic": 0.4430708117427921,
    "returnOnTangibleAssets": 0.25682503150857583,
    "grahamNetNet": -12.352478525015636,
    "workingCapital": -23405000000,
    "tangibleAssetValue": 56950000000,
    "netCurrentAssetValue": -155043000000,
    "investedCapital": 22275000000,
    "averageReceivables": 63614000000,
    "averagePayables": 65785500000,
    "averageInventory": 6808500000,
    "daysSalesOutstanding": 61.83255974529134,
    "daysPayablesOutstanding": 119.65847721913745,
    "daysOfInventoryOnHand": 12.642570548414087,
    "receivablesTurnover": 5.903038811648023,
    "payablesTurnover": 3.0503480278422272,
    "inventoryTurnover": 28.870710952511665,
    "roe": 1.6459350307287095,
    "capexPerShare": 0.6156891035281195
  }
];

export const sampleCashFlowResponse: CashFlowResponse[] = [
  {
    "date": "2024-09-28",
    "symbol": "AAPL",
    "reportedCurrency": "USD",
    "cik": "0000320193",
    "fillingDate": "2024-11-01",
    "acceptedDate": "2024-11-01 06:01:36",
    "calendarYear": "2024",
    "period": "FY",
    "netIncome": 93736000000,
    "depreciationAndAmortization": 11445000000,
    "deferredIncomeTax": 0,
    "stockBasedCompensation": 11688000000,
    "changeInWorkingCapital": 3651000000,
    "accountsReceivables": -5144000000,
    "inventory": -1046000000,
    "accountsPayables": 6020000000,
    "otherWorkingCapital": 3821000000,
    "otherNonCashItems": -2266000000,
    "netCashProvidedByOperatingActivities": 118254000000,
    "investmentsInPropertyPlantAndEquipment": -9447000000,
    "acquisitionsNet": 0,
    "purchasesOfInvestments": -48656000000,
    "salesMaturitiesOfInvestments": 62346000000,
    "otherInvestingActivites": -1308000000,
    "netCashUsedForInvestingActivites": 2935000000,
    "debtRepayment": -5998000000,
    "commonStockIssued": 0,
    "commonStockRepurchased": -94949000000,
    "dividendsPaid": -15234000000,
    "otherFinancingActivites": -5802000000,
    "netCashUsedProvidedByFinancingActivities": -121983000000,
    "effectOfForexChangesOnCash": 0,
    "netChangeInCash": -794000000,
    "cashAtEndOfPeriod": 29943000000,
    "cashAtBeginningOfPeriod": 30737000000,
    "operatingCashFlow": 118254000000,
    "capitalExpenditure": -9447000000,
    "freeCashFlow": 108807000000,
    "link": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/0000320193-24-000123-index.htm",
    "finalLink": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/aapl-20240928.htm"
  }
];

export const sampleIncomeStatementResponse: IncomeStatementResponse[] = [
  {
    "date": "2024-09-28",
    "symbol": "AAPL",
    "reportedCurrency": "USD",
    "cik": "0000320193",
    "fillingDate": "2024-11-01",
    "acceptedDate": "2024-11-01 06:01:36",
    "calendarYear": "2024",
    "period": "FY",
    "revenue": 391035000000,
    "costOfRevenue": 210352000000,
    "grossProfit": 180683000000,
    "grossProfitRatio": 0.4620634982,
    "researchAndDevelopmentExpenses": 31370000000,
    "generalAndAdministrativeExpenses": 0,
    "sellingAndMarketingExpenses": 0,
    "sellingGeneralAndAdministrativeExpenses": 26097000000,
    "otherExpenses": 0,
    "operatingExpenses": 57467000000,
    "costAndExpenses": 267819000000,
    "interestIncome": 0,
    "interestExpense": 0,
    "depreciationAndAmortization": 11445000000,
    "ebitda": 134661000000,
    "ebitdaratio": 0.3443707085,
    "operatingIncome": 123216000000,
    "operatingIncomeRatio": 0.3151022287,
    "totalOtherIncomeExpensesNet": 269000000,
    "incomeBeforeTax": 123485000000,
    "incomeBeforeTaxRatio": 0.3157901467,
    "incomeTaxExpense": 29749000000,
    "netIncome": 93736000000,
    "netIncomeRatio": 0.2397125577,
    "eps": 6.11,
    "epsdiluted": 6.08,
    "weightedAverageShsOut": 15343783000,
    "weightedAverageShsOutDil": 15408095000,
    "link": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/0000320193-24-000123-index.htm",
    "finalLink": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/aapl-20240928.htm"
  }
];

/**
 * Utility function to mock API responses for tests
 * @param endpoint The API endpoint to mock
 * @param symbol The company symbol
 * @returns Sample response data for the specified endpoint and symbol
 */
// Historical Price Response Interface
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

export const sampleHistoricalPriceResponse: HistoricalPriceResponse = {
  symbol: "AAPL",
  historical: [
    {
      date: "2024-09-28",
      open: 236.95,
      high: 242.08,
      low: 234.51,
      close: 241.395,
      volume: 56833360
    },
    {
      date: "2024-09-27",
      open: 237.3,
      high: 239.5,
      low: 235.02,
      close: 237.3,
      volume: 48217560
    },
    {
      date: "2024-09-26",
      open: 234.21,
      high: 237.83,
      low: 233.5,
      close: 237.41,
      volume: 43126600
    }
  ]
};

export const mockApiResponse = (endpoint: string, symbol: string = 'AAPL') => {
  switch (endpoint) {
    case 'profile':
      return sampleCompanyProfileResponse;
    case 'balance-sheet':
      return sampleBalanceSheetResponse;
    case 'income-statement':
      return sampleIncomeStatementResponse;
    case 'cash-flow-statement':
      return sampleCashFlowResponse;
    case 'key-metrics':
      return sampleKeyMetricsResponse;
    case 'quote':
      return sampleStockQuoteResponse;
    case 'historical-price':
      return sampleHistoricalPriceResponse;
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};