# FinCompare

A financial data comparison tool for investment insights.

## Overview

FinCompare is a personal financial analysis tool designed to help with selecting suitable stocks for investment. The application allows you to compare financial data between companies, visualize key metrics, and gain AI-powered insights about which metrics matter most for specific industries and companies.

## Features

- Company and competitor selection
- Financial dashboards and metrics
- Interactive stock price charts
- Financial statements comparison (Income Statement, Balance Sheet, Cash Flow)
- Ratio analysis with industry benchmarking
- Financial health assessment
- AI-powered metric importance ranking (powered by Google's Gemini API)
- Personalized metric recommendations based on user preferences
- Industry-specific insights and analysis
- Visualization recommendations for optimal data presentation

## Tech Stack

- React
- TypeScript
- TailwindCSS
- Chart.js for data visualization
- Mock data with Financial Modeling Prep (FMP) API integration
- Google Gemini API for AI-powered recommendations

## Project Structure

```
src/
├── components/           # UI components
│   ├── BalanceSheet.tsx  # Balance sheet visualization
│   ├── CashFlow.tsx      # Cash flow statement visualization
│   ├── FinancialChart.tsx # General-purpose financial chart component
│   ├── FinancialMetrics.tsx # Financial metrics display
│   ├── FinancialRatioComparison.tsx # Ratio comparison visualization
│   ├── FullOverview.tsx  # Enhanced overview with AI ranking
│   ├── IncomeStatement.tsx # Income statement visualization
│   ├── KeyFinancialIndicators.tsx # Key financial indicators
│   ├── Overview.tsx      # Basic company overview
│   └── ... 
├── utils/                # Utility functions and services
│   ├── aiService.ts      # AI recommendation service interface
│   ├── apiService.ts     # API client for financial data
│   ├── chartColors.ts    # Chart styling utilities
│   ├── config.ts         # Application configuration and feature flags
│   ├── dataAdapter.ts    # Transforms API data to application format
│   ├── dataFetcher.ts    # Central data fetching orchestrator
│   ├── GeminiRanking.ts  # Gemini API integration
│   └── MockRanking.ts    # Mock AI ranking for development
├── data/                 # Mock data for development
├── types/                # TypeScript type definitions
└── App.tsx               # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/AnthonyKot/FAT.git
cd FAT
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Access the application
Open http://localhost:5173 in your browser

## Usage

1. Select a company using the company selector
2. Optionally select a competitor for comparison
3. View financial metrics, charts, and analysis
4. Use the tabs to navigate between different views:
   - Overview
   - Financial Statements (Income Statement, Balance Sheet, Cash Flow)
   - Ratio Analysis
   - Financial Health Dashboard

## Configuration

The application uses feature flags to control functionality. See `src/utils/config.ts` for available options.

### API Integration

By default, the application uses mock data. To use the real Financial Modeling Prep API:

1. Set the `ENABLE_REAL_API` flag to `true` in the configuration
2. Obtain an API key from Financial Modeling Prep
3. Set up your API key in the appropriate configuration file

### AI Integration

The application uses Google's Gemini API for metric importance ranking:

1. Set the `ENABLE_AI_RANKING` flag to `true`
2. Configure your Gemini API key as needed

## Development Notes

- Currently uses mock data for development. See `src/data/` directory.
- UI components are modular and can be customized.
- The application follows a component-based architecture for future flexibility.

## Key Financial Metrics

The application analyzes various financial metrics, including:

### Profitability Metrics
- Net Profit Margin
- Operating Profit Margin
- Return on Equity (ROE)
- Return on Assets (ROA)

### Growth Metrics
- Revenue Growth Rate
- Earnings Growth Rate
- Free Cash Flow Growth

### Financial Health Metrics
- Debt-to-Equity Ratio
- Free Cash Flow Yield
- Current Ratio
- Interest Coverage Ratio

## License

[MIT License]

## Contact

[Anthony Kot - kotatut@gmail.com]
