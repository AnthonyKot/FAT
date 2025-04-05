# FinCompare - Financial Data Comparison Tool

## Overview

FinCompare is a comprehensive financial data comparison tool built with React, TypeScript, and TailwindCSS that allows users to compare financial data between companies. The application provides interactive dashboards, charts, and AI-powered insights to help users make informed investment decisions.

## Repository Structure

The repository is organized as follows:

- **src/**: Main source code directory
  - **components/**: UI components that make up the application interface
  - **utils/**: Utility functions and services
  - **data/**: Mock data and sample responses
- **Root directory**: Contains configuration files and documentation

## Key Features

### 1. Company Selection and Comparison

Users can select a primary company and a competitor for comparison. This functionality is implemented in:
- <ref_file file="/home/ubuntu/repos/FAT/src/components/CompanySelector.tsx" />
- <ref_file file="/home/ubuntu/repos/FAT/src/components/CompetitorSelector.tsx" />

The company selection process is handled in the App component:
<ref_snippet file="/home/ubuntu/repos/FAT/src/App.tsx" lines="29-63" />

### 2. Financial Dashboards and Metrics

The application provides various financial dashboards and metrics, including:

- **Overview**: Summary of key financial information
  <ref_file file="/home/ubuntu/repos/FAT/src/components/Overview.tsx" />
  
- **Financial Statements**:
  - <ref_file file="/home/ubuntu/repos/FAT/src/components/BalanceSheet.tsx" />
  - <ref_file file="/home/ubuntu/repos/FAT/src/components/IncomeStatement.tsx" />
  - <ref_file file="/home/ubuntu/repos/FAT/src/components/CashFlow.tsx" />

- **Ratio Analysis**: Financial ratio comparisons
  <ref_file file="/home/ubuntu/repos/FAT/src/components/RatioAnalysis.tsx" />

- **Financial Health Dashboard**: Comprehensive financial health metrics
  <ref_file file="/home/ubuntu/repos/FAT/src/components/FinancialHealthDashboard.tsx" />

### 3. Interactive Stock Price Charts

The application features interactive stock price charts for visual comparison:
- <ref_file file="/home/ubuntu/repos/FAT/src/components/StockPriceChart.tsx" />
- <ref_file file="/home/ubuntu/repos/FAT/src/components/StockPriceHistory.tsx" />

### 4. AI-Powered Metric Importance Ranking

One of the key features is AI-powered metric importance ranking using Google's Gemini API:
<ref_file file="/home/ubuntu/repos/FAT/src/utils/GeminiRanking.ts" />

The AI integration generates recommendations based on company metrics:
<ref_snippet file="/home/ubuntu/repos/FAT/src/utils/GeminiRanking.ts" lines="54-79" />

## Data Flow

### 1. Data Structure

The application uses a comprehensive data structure defined in the types.ts file:
<ref_file file="/home/ubuntu/repos/FAT/src/types.ts" />

Key data interfaces include:
- `Company`: Basic company information
- `CompanyData`: Comprehensive financial data
- `BalanceSheetData`, `IncomeStatementData`, `CashFlowData`: Financial statements
- `RatioData`: Financial ratios
- `OperationalMetrics`, `ValuationMetrics`: Advanced metrics

### 2. Mock Data

Currently, the application uses mock data defined in mockData.ts:
<ref_file file="/home/ubuntu/repos/FAT/src/data/mockData.ts" />

The mock data is generated using helper functions:
<ref_snippet file="/home/ubuntu/repos/FAT/src/data/mockData.ts" lines="64-101" />

### 3. Data Fetching

Data fetching is handled through the dataFetcher utility:
<ref_file file="/home/ubuntu/repos/FAT/src/utils/dataFetcher.ts" />

## Application Flow

1. **Initialization**: The application initializes in App.tsx
2. **Company Selection**: Users select a company and optionally a competitor
3. **Data Fetching**: Financial data is fetched for the selected companies
4. **Data Display**: Data is displayed in various components based on the selected tab
5. **AI Analysis**: Gemini API provides metric importance ranking and recommendations

## Future Development Plans

The repository includes detailed plans for future development:
- <ref_file file="/home/ubuntu/repos/FAT/DETAILED_PLAN.md" />
- <ref_file file="/home/ubuntu/repos/FAT/IDEAS.md" />

Key planned features include:
1. Enhanced AI-driven recommendations
2. Improved user experience with actionable insights
3. Advanced visualization capabilities
4. User-centric dashboard improvements

## Setup and Usage

### Prerequisites
- Node.js and npm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Access
The application can be accessed at http://localhost:5173

## Current Implementation Status

The application currently uses mock data, with API integration planned for future versions. The UI components and core functionality are implemented, with ongoing work on AI-powered features.
