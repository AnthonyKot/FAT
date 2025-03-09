# FinCompare

A financial data comparison tool for investment insights.

## Next Implementation Steps

1. **Activate Gemini AI Metric Importance Ranking**
   - Set the Gemini API key in the environment variables or config file
   - Enable the `ENABLE_AI_RANKING` feature flag in config.ts
   - Test the Gemini API integration with different industries and metrics
   - Fine-tune the prompt and response handling for optimal results

2. **Complete AI-Powered Dashboard Components**
   - Implement `OperationalEfficiencyDashboard` component following the Financial Health Dashboard pattern
   - Create `InvestorValueDashboard` component with personalized metric importance
   - Build `ResearchInnovationDashboard` for tech and R&D-focused analysis
   - Connect dashboard components to App.tsx with routing

2. **Connect Calculated Metrics to UI**
   - Update metric card components to use real data from CompanyData objects
   - Map metric names to data paths using METRIC_DATA_PATHS configuration
   - Implement metric trend calculations and visualizations
   - Add peer comparison functionality for each metric

3. **Enhance Visualization System**
   - Create visualization components based on AI recommendations
   - Implement dynamic chart type selection based on metric characteristics
   - Add drill-down capabilities for detailed metric analysis
   - Support multiple time period views (annual, quarterly, TTM)

4. **Improve User Experience**
   - Add dashboard preference persistence with localStorage
   - Implement dashboard layout customization
   - Create metric search and filtering capabilities
   - Build "export to PDF/image" functionality for reports

## Overview

Compare financial data between companies, with key metrics, charts, and analysis.

## Features

- Company and competitor selection
- Financial dashboards and metrics
- Interactive stock price charts
- Financial statements comparison
- Ratio analysis
- AI-powered metric importance ranking (powered by Google's Gemini API)
- Personalized metric recommendations based on user preferences
- Industry-specific insights and analysis
- Visualization recommendations for optimal data presentation

## Tech Stack

- React
- TypeScript
- TailwindCSS
- Mock data (API integration planned)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Access the app at http://localhost:5173

## Development Notes

Currently uses mock data. See `src/data/` directory.

UI components are in `src/components/` with customizable widgets for future flexibility.

## Next Features

### Recently Completed:
- **Component-level Code Splitting**: Extracted and modularized UI components for better maintainability
  - Created standalone MetricsSection component
  - Extracted KeyPerformanceIndicators as a separate component
  - Created FinancialMetrics component for financial analysis metrics
  - Extracted RatioAnalysisSummary as an independent component
  - Added KeyFinancialIndicators for cash flow metrics
  - Separated StockPriceHistory component
  - Improved overall component organization for future customization
- **Extended Metrics System**: Added comprehensive new metrics calculations
  - Implemented operational efficiency metrics (days of inventory, cash conversion cycle, etc.)
  - Added per-share metrics (revenue per share, FCF per share, etc.)
  - Created valuation metrics (Graham Number, PEG ratio, EV ratios)
  - Added R&D and capital efficiency tracking metrics

### In Progress:
- **Advanced Dashboard Implementation**: Creating specialized dashboard components
  - Implementing Financial Health Dashboard with risk assessment indicators
  - Building Operational Efficiency Panel with cash conversion visualization
  - Developing Investor Value Metrics section with buy/sell indicators
  - Creating Research & Innovation Tracker for R&D-focused companies
  - Building Capital Efficiency Dashboard with ROIC visualization

- **Customizable Metric Importance**: Allow users to weight financial metrics based on their investment priorities
  - Implement metric importance sliders for different financial dimensions
  - Save user preferences locally
  - Generate personalized company scores based on weighted metrics
  - Visualize metric importance in comparison charts

### Future Enhancements:
- Custom Analysis Assistant
- Company News Summarizer
- Sector/Industry Benchmarking
- Comparison Wizard
- Portfolio Simulator

## Metrics Classification for AI Importance Ranking

Below are comprehensive lists of metrics organized by dashboard component. These will be used for AI-based importance ranking per industry/sector.

### Financial Health Dashboard Metrics
- Debt-to-Equity Ratio
- Current Ratio
- Quick Ratio
- Interest Coverage Ratio
- Net Debt to EBITDA
- Debt-to-EBITDA
- Financial Leverage
- Current Liabilities to Total Assets
- Cash Ratio
- Working Capital Ratio
- Fixed Charge Coverage
- Solvency Ratio
- Altman Z-Score
- Operating Cash Flow to Current Liabilities
- Free Cash Flow to Debt

### Operational Efficiency Metrics
- Days of Inventory On Hand
- Days Sales Outstanding
- Days Payables Outstanding
- Cash Conversion Cycle
- Inventory Turnover
- Asset Turnover
- Fixed Asset Turnover
- Accounts Receivable Turnover
- Working Capital Turnover
- Operating Cycle
- Operating Margin
- EBITDA Margin
- SG&A to Revenue
- Revenue per Employee
- Operating Expenses to Revenue

### Investor Value Metrics
- Price-to-Earnings Ratio (P/E)
- Price-to-Book Ratio (P/B)
- Price-to-Sales Ratio (P/S)
- EV/EBITDA
- EV/Revenue
- EV/FCF
- PEG Ratio
- Graham Number
- Dividend Yield
- Dividend Payout Ratio
- Free Cash Flow Yield
- Shareholder Yield
- Return on Equity (ROE)
- Return on Assets (ROA)
- Return on Invested Capital (ROIC)
- Earnings Yield

### Research & Innovation Metrics
- R&D to Revenue
- CapEx to Revenue
- CapEx to Depreciation
- CapEx to Operating Cash Flow
- Patent Count Growth
- New Product Revenue Percentage
- Revenue per Patent
- R&D Effectiveness (Revenue Growth to R&D Ratio)
- Innovation Revenue Percentage
- Return on Research Capital
- R&D Growth Rate
- Technology Adoption Rate
- Innovation Investment Intensity

## Implementation Plan for Specialized Dashboards

### 1. Financial Health Dashboard
1. **Core Components**
   - Create `FinancialHealthScore` component with weighted metric algorithm
   - Implement `RiskAssessmentIndicators` component with trend visualization
   - Develop `FinancialStrengthCard` with color-coded metrics display
   - Build `LiquidityMetricsPanel` for current and quick ratios

2. **Key Visualizations**
   - Implement gauge charts for Debt/Equity, Interest Coverage, Current Ratio
   - Create historical trend charts for key risk metrics
   - Design financial strength scorecard with industry benchmarks
   - Build liquidity stress test simulation component

3. **Integration Tasks**
   - Connect dashboard to existing data adapter
   - Add industry benchmark comparison data
   - Implement conditional styling based on metric values
   - Create dashboard-specific tooltips with financial term explanations

### 2. Operational Efficiency Panel
1. **Core Components**
   - Build `CashConversionCycle` visualization component
   - Create `InventoryMetrics` component for inventory turnover analysis
   - Implement `OperationalTrendsChart` for metric changes over time
   - Develop `EfficiencyScorecard` for operational performance

2. **Key Visualizations**
   - Design circular flow diagram for cash conversion cycle
   - Implement bar charts for Days Inventory, Days Payable, Days Receivable
   - Create comparison charts with industry averages
   - Build trend indicators for operational improvement/decline

3. **Integration Tasks**
   - Connect to operational efficiency metric calculations
   - Add peer comparison functionality
   - Implement time period selector for trend analysis
   - Create exportable efficiency report component

### 3. Investor Value Metrics Section
1. **Core Components**
   - Implement `ValuationDashboard` with key investor metrics
   - Create `BuySellIndicator` component with Graham Number analysis
   - Develop `ShareholderReturnsPanel` for dividend and value metrics
   - Build `PeerValuationComparison` component

2. **Key Visualizations**
   - Design Graham Number vs. Current Price gauge chart
   - Implement FCF Yield and Dividend Yield trend charts
   - Create EV/EBITDA and PEG Ratio peer comparison charts
   - Build valuation multiples historical analysis

3. **Integration Tasks**
   - Connect to valuation metric calculations
   - Implement buy/sell threshold configuration
   - Add historical price correlation analysis
   - Create shareholder value trend visualization

## Additional Metrics & Visualizations

### Key Metrics to Implement from API Data

Based on the available API data, we recommend adding these high-impact metrics to the UI:

#### Per-Share Metrics
- **Revenue Per Share**: Shows company's revenue relative to outstanding shares
- **Net Income Per Share**: Similar to EPS but may include more comprehensive income figures
- **Operating Cash Flow Per Share**: Important metric of operational performance per share
- **Free Cash Flow Per Share**: Critical for valuation and sustainability analysis
- **Book Value Per Share**: Represents company's equity value per share
- **Tangible Book Value Per Share**: More conservative valuation excluding intangible assets

#### Operational Efficiency
- **Days of Inventory On Hand (100.62 days)**: Shows how long inventory is held before sale
- **Days Payables Outstanding (24.05 days)**: Time taken to pay suppliers
- **Inventory Turnover (3.63x)**: How many times inventory is sold and replaced in a period
- **Interest Coverage Ratio (46.14x)**: Ability to pay interest on outstanding debt
- **Income Quality (2.14)**: Ratio of operating cash flow to net income, indicating earnings quality

#### Valuation Metrics
- **Graham Number**: Intrinsic value formula based on EPS and Book Value
- **EV/EBITDA (4.12)**: Key valuation metric less affected by capital structure
- **Free Cash Flow Yield (5.31%)**: Shows FCF relative to market cap
- **PEG Ratio**: Ratio of P/E to growth rate, showing relative valuation
- **Enterprise Value Ratios**: Including EV/Sales and EV/FCF

#### Capital Management
- **ROIC (6.87%)**: Return on invested capital, showing efficiency of capital allocation
- **CapEx to Operating Cash Flow (73.64%)**: Shows portion of operating cash used for capital expenses
- **CapEx to Depreciation (1.26x)**: Indicates if company is investing enough to maintain/grow assets
- **R&D to Revenue (11.63%)**: Shows innovation investment intensity

#### Risk Assessment
- **Debt to Equity (0.05)**: Low ratio indicates conservative financial structure
- **Current Ratio (2.43)**: Strong short-term liquidity
- **Net Debt to EBITDA (-0.43)**: Negative ratio suggests excess cash relative to debt
- **Payout Ratio (32.39%)**: Sustainable dividend payout

### Fundamental Analysis
- **Dividend Payout Ratio**: `dividendsPaid / netIncome` - Shows percentage of earnings paid to shareholders
- **Dividend Coverage Ratio**: `netIncome / dividendsPaid` - How many times dividends are covered by earnings
- **Interest Coverage Ratio**: Calculate from income statement data to show ability to pay interest on debt
- **Cash Conversion Cycle**: Combine inventory, receivables, and payables turnover for operational efficiency
- **Free Cash Flow Yield**: `freeCashFlow / marketCap` - Measure of investment value relative to cash generated

### Risk Assessment
- **Financial Leverage Ratio**: `totalAssets / totalEquity` - Measure of financial risk
- **Altman Z-Score**: Predictor of bankruptcy probability using multiple financial ratios
- **Operating Leverage**: Calculate sensitivity of operating income to changes in revenue
- **Cash Burn Rate**: For unprofitable companies, calculate how quickly they're using cash
- **Liquidity Stress Test**: Simulate effects of market downturns on company liquidity

### Growth Metrics
- **Compound Annual Growth Rate (CAGR)**: For revenue, earnings, and cash flow over 3-5 year periods
- **Sustainable Growth Rate**: `ROE × (1 - Dividend Payout Ratio)` - Growth rate company can maintain without external financing
- **R&D as Percentage of Revenue**: For innovation-driven industries
- **Operating Cash Flow Growth**: Compare to earnings growth to assess quality of earnings
- **Capital Expenditure Ratio**: `capEx / depreciation` - Indicates if company is investing enough for future growth

### Valuation Enhancements
- **Discounted Cash Flow (DCF) Model**: Estimate intrinsic value based on projected cash flows
- **PEG Ratio**: `P/E ratio / earnings growth rate` - Valuation metric accounting for growth
- **EV/FCF Ratio**: `enterprise value / free cash flow` - Alternative to EV/EBITDA
- **EBITDA Margin**: `EBITDA / revenue` - Profitability without accounting for capital structure
- **Return on Invested Capital (ROIC)**: Measure of how efficiently capital is allocated

### Comparative Analysis
- **Peer Group Percentile Rankings**: Show where company stands relative to industry peers across key metrics
- **Industry-Specific KPIs**: Customize metrics based on company industry (e.g., same-store sales for retail)
- **Management Effectiveness Ratios**: Compare executive compensation to performance metrics
- **ESG Metrics Integration**: Environmental, social, and governance ratings if available
- **Economic Value Added (EVA)**: Measure of economic profit accounting for cost of capital

### Advanced Visualizations
- **Monte Carlo Simulations**: Probabilistic projections of future financial outcomes
- **Radar Charts**: For comparing multiple financial dimensions simultaneously
- **Correlation Matrices**: Show relationships between different financial metrics
- **Scatter Plots with Regression Lines**: Visualize relationships between metrics and identify outliers
- **Heat Maps**: Visual representation of financial statement changes over time
- **Waterfall Charts**: For visualizing changes in key metrics between periods
- **Contribution Analysis**: Visualize how different components contribute to overall performance

### UI Implementation Ideas

1. **Financial Health Dashboard**
   - Add a health score based on key metrics (Debt/Equity, Interest Coverage, Current Ratio)
   - Create gauge charts for critical metrics with industry benchmark indicators
   - Implement a financial strength scorecard with color-coded indicators
   - Display risk assessment metrics with trend indicators

2. **Operational Efficiency Panel**
   - Display inventory, receivables, and payables metrics with industry comparisons
   - Create a visualization of the cash conversion cycle
   - Show trends in operational metrics over time
   - Implement Days of Inventory On Hand, Days Payables Outstanding, and Inventory Turnover visuals

3. **Investor Value Metrics**
   - Create a section focused on shareholder returns and value metrics
   - Display Graham Number vs Current Price with buy/sell indicators
   - Show FCF Yield and Dividend Yield with historical trends
   - Add EV/EBITDA and PEG Ratio comparisons to peers

4. **Research & Innovation Tracker**
   - For tech and R&D-heavy companies, highlight R&D spending trends (using R&D to Revenue data)
   - Compare R&D spending to peers and show correlation with growth
   - Visualize R&D effectiveness (R&D spending vs revenue growth)
   - Track CapEx to Operating Cash Flow and CapEx to Depreciation ratios over time

5. **Capital Efficiency Dashboard**
   - Visualize ROIC with peer comparison
   - Display trends in capital allocation efficiency
   - Compare return on capital vs cost of capital
   - Show management effectiveness through capital allocation decisions