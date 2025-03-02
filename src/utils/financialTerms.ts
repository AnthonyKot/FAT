export interface FinancialTerm {
  term: string;
  definition: string;
  category?: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'ratio' | 'valuation' | 'general';
}

const financialTerms: Record<string, FinancialTerm> = {
  // Balance Sheet Terms
  "totalAssets": {
    term: "Total Assets",
    definition: "The total economic value of everything a company owns, including current and non-current assets.",
    category: "balance_sheet"
  },
  "totalLiabilities": {
    term: "Total Liabilities",
    definition: "The total debts and obligations a company owes to external parties.",
    category: "balance_sheet"
  },
  "totalEquity": {
    term: "Total Equity",
    definition: "The remaining value of a company after subtracting total liabilities from total assets, representing shareholders' ownership.",
    category: "balance_sheet"
  },
  "cashAndEquivalents": {
    term: "Cash and Equivalents",
    definition: "Highly liquid assets including cash and investments that can be converted to cash within 90 days.",
    category: "balance_sheet"
  },
  "shortTermInvestments": {
    term: "Short-Term Investments",
    definition: "Investments expected to be converted to cash within a year, such as marketable securities.",
    category: "balance_sheet"
  },
  "accountsReceivable": {
    term: "Accounts Receivable",
    definition: "Money owed to a company by its customers for products or services delivered but not yet paid for.",
    category: "balance_sheet"
  },
  "inventory": {
    term: "Inventory",
    definition: "Goods available for sale or raw materials used in production.",
    category: "balance_sheet"
  },
  "propertyPlantEquipment": {
    term: "Property, Plant & Equipment",
    definition: "Long-term tangible assets used in the operation of a business, such as land, buildings, and machinery.",
    category: "balance_sheet"
  },
  "goodwill": {
    term: "Goodwill",
    definition: "An intangible asset that represents the excess of the purchase price over the fair value of assets acquired in a business combination.",
    category: "balance_sheet"
  },
  "intangibleAssets": {
    term: "Intangible Assets",
    definition: "Non-physical assets such as patents, trademarks, copyrights, and customer relationships.",
    category: "balance_sheet"
  },
  "accountsPayable": {
    term: "Accounts Payable",
    definition: "Money a company owes to its suppliers or vendors for goods or services purchased on credit.",
    category: "balance_sheet"
  },
  "shortTermDebt": {
    term: "Short-Term Debt",
    definition: "Debt obligations due within one year, including the current portion of long-term debt and short-term loans.",
    category: "balance_sheet"
  },
  "longTermDebt": {
    term: "Long-Term Debt",
    definition: "Debt obligations due after one year, such as bonds, mortgages, and long-term loans.",
    category: "balance_sheet"
  },

  // Income Statement Terms
  "revenue": {
    term: "Revenue",
    definition: "The total amount of money a company generates from its business activities before any expenses are deducted.",
    category: "income_statement"
  },
  "costOfRevenue": {
    term: "Cost of Revenue",
    definition: "Direct costs attributable to the production of goods sold or services provided, including materials, labor, and manufacturing overhead.",
    category: "income_statement"
  },
  "grossProfit": {
    term: "Gross Profit",
    definition: "Revenue minus cost of goods sold, representing the profit from core business activities before operating expenses.",
    category: "income_statement"
  },
  "operatingExpenses": {
    term: "Operating Expenses",
    definition: "Regular expenses incurred in the normal operation of a business, such as salaries, rent, utilities, and marketing costs.",
    category: "income_statement"
  },
  "operatingIncome": {
    term: "Operating Income",
    definition: "Profit generated from core business operations, calculated by subtracting operating expenses from gross profit.",
    category: "income_statement"
  },
  "netIncome": {
    term: "Net Income",
    definition: "The company's total profit after all expenses, taxes, and costs have been deducted from revenue.",
    category: "income_statement"
  },
  "eps": {
    term: "Earnings Per Share (EPS)",
    definition: "Net income divided by the number of outstanding shares, indicating profitability on a per-share basis.",
    category: "income_statement"
  },
  "ebitda": {
    term: "EBITDA",
    definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization; a measure of a company's overall financial performance.",
    category: "income_statement"
  },

  // Cash Flow Terms
  "operatingCashFlow": {
    term: "Operating Cash Flow",
    definition: "Cash generated from day-to-day business operations, indicating a company's ability to generate positive cash flow from its core business.",
    category: "cash_flow"
  },
  "capitalExpenditures": {
    term: "Capital Expenditures",
    definition: "Funds used by a company to acquire, upgrade, and maintain physical assets such as property, buildings, technology, or equipment.",
    category: "cash_flow"
  },
  "freeCashFlow": {
    term: "Free Cash Flow",
    definition: "Cash a company generates after accounting for cash outflows to support operations and maintain capital assets, calculated as operating cash flow minus capital expenditures.",
    category: "cash_flow"
  },
  "dividendsPaid": {
    term: "Dividends Paid",
    definition: "Cash distributed to shareholders as a portion of the company's earnings.",
    category: "cash_flow"
  },
  "netInvestingCashFlow": {
    term: "Net Investing Cash Flow",
    definition: "Cash flow from investment activities, including purchases and sales of long-term assets and investments.",
    category: "cash_flow"
  },
  "netFinancingCashFlow": {
    term: "Net Financing Cash Flow",
    definition: "Cash flow from financing activities, including debt issuance and repayment, equity issuance and repurchase, and dividend payments.",
    category: "cash_flow"
  },
  "netChangeInCash": {
    term: "Net Change in Cash",
    definition: "The increase or decrease in cash and cash equivalents over a period, calculated as the sum of operating, investing, and financing cash flows.",
    category: "cash_flow"
  },

  // Ratio Terms
  "peRatio": {
    term: "P/E Ratio",
    definition: "Price to Earnings ratio measures a company's current share price relative to its earnings per share (EPS). A higher P/E suggests investors expect higher growth in the future.",
    category: "ratio"
  },
  "pbRatio": {
    term: "P/B Ratio",
    definition: "Price to Book ratio compares a company's market value to its book value. A lower P/B may indicate an undervalued stock, while a higher P/B may suggest overvaluation or strong future growth prospects.",
    category: "ratio"
  },
  "psRatio": {
    term: "P/S Ratio",
    definition: "Price to Sales ratio compares a company's market capitalization to its revenue. Useful for evaluating companies with little or no earnings.",
    category: "ratio"
  },
  "evToEbitda": {
    term: "EV/EBITDA",
    definition: "Enterprise Value to EBITDA ratio is a valuation metric that compares a company's enterprise value to its earnings before interest, taxes, depreciation, and amortization. Lower values generally indicate a more attractive investment.",
    category: "ratio"
  },
  "returnOnEquity": {
    term: "Return on Equity (ROE)",
    definition: "Net income divided by shareholders' equity, measuring a company's profitability by revealing how much profit it generates with the money shareholders have invested.",
    category: "ratio"
  },
  "returnOnAssets": {
    term: "Return on Assets (ROA)",
    definition: "Net income divided by total assets, indicating how efficiently management is using assets to generate earnings.",
    category: "ratio"
  },
  "netProfitMargin": {
    term: "Net Profit Margin",
    definition: "Net profit as a percentage of revenue, showing how much of each dollar of revenue is converted into profit after all expenses.",
    category: "ratio"
  },
  "grossProfitMargin": {
    term: "Gross Profit Margin",
    definition: "Gross profit as a percentage of revenue, indicating how efficiently a company uses its materials and labor to produce and sell products.",
    category: "ratio"
  },
  "revenueGrowth": {
    term: "Revenue Growth",
    definition: "The percentage increase in revenue over a specific period, indicating a company's ability to grow its top line.",
    category: "ratio"
  },
  "epsGrowth": {
    term: "EPS Growth",
    definition: "The percentage increase in earnings per share over a specific period, indicating a company's ability to grow its bottom line on a per-share basis.",
    category: "ratio"
  },
  "debtToEquity": {
    term: "Debt to Equity",
    definition: "Total liabilities divided by shareholders' equity, indicating a company's financial leverage and risk. Higher ratios suggest higher risk.",
    category: "ratio"
  },
  "currentRatio": {
    term: "Current Ratio",
    definition: "Current assets divided by current liabilities, measuring a company's ability to pay short-term obligations. A ratio above 1 indicates good short-term financial strength.",
    category: "ratio"
  },
  "quickRatio": {
    term: "Quick Ratio",
    definition: "Current assets minus inventory, divided by current liabilities. Also known as the 'acid-test ratio', it measures a company's ability to pay short-term obligations with its most liquid assets.",
    category: "ratio"
  },
  "assetTurnover": {
    term: "Asset Turnover",
    definition: "Revenue divided by average total assets, indicating how efficiently a company uses its assets to generate revenue.",
    category: "ratio"
  },
  "inventoryTurnover": {
    term: "Inventory Turnover",
    definition: "Cost of goods sold divided by average inventory, indicating how many times a company sells its inventory in a period. Higher turnover suggests efficient inventory management.",
    category: "ratio"
  },

  // General Financial Terms
  "marketCap": {
    term: "Market Capitalization",
    definition: "The total market value of a company's outstanding shares, calculated by multiplying the share price by the number of shares outstanding.",
    category: "general"
  },
  "dividendYield": {
    term: "Dividend Yield",
    definition: "Annual dividends per share divided by share price, expressed as a percentage, indicating the return on investment from dividends alone.",
    category: "general"
  },
  "beta": {
    term: "Beta",
    definition: "A measure of a stock's volatility compared to the overall market. A beta greater than 1 indicates higher volatility, while a beta less than 1 indicates lower volatility.",
    category: "general"
  },
  "52weekHigh": {
    term: "52-Week High",
    definition: "The highest price at which a stock has traded during the past 52 weeks (one year).",
    category: "general"
  },
  "52weekLow": {
    term: "52-Week Low",
    definition: "The lowest price at which a stock has traded during the past 52 weeks (one year).",
    category: "general"
  }
};

export default financialTerms;

export const getTermDefinition = (key: string): FinancialTerm | undefined => {
  return financialTerms[key];
};

export const getAllTermsByCategory = (category: FinancialTerm['category']): FinancialTerm[] => {
  return Object.values(financialTerms).filter(term => term.category === category);
};