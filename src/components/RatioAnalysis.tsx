import React, { useState } from 'react';
import { CompanyData } from '../types';
import { formatPercentage } from '../utils/formatters';
import FinancialChart from './FinancialChart';
import ChartTooltip from './ChartTooltip';
import ReportButton from './ReportButton';

interface RatioAnalysisProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const RatioAnalysis: React.FC<RatioAnalysisProps> = ({ companyData, competitorData }) => {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  const [category, setCategory] = useState<'valuation' | 'profitability' | 'growth' | 'risk' | 'efficiency'>('valuation');
  
  if (!companyData) return null;
  
  // Prepare chart data for selected category
  const getCategoryData = () => {
    switch (category) {
      case 'valuation':
        return {
          labels: companyData.ratios.peRatio.map(item => item.year.toString()),
          datasets: [
            {
              label: `${companyData.company.name} - P/E Ratio`,
              data: companyData.ratios.peRatio.map(item => item.value),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - P/B Ratio`,
              data: companyData.ratios.pbRatio.map(item => item.value),
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - P/S Ratio`,
              data: companyData.ratios.psRatio.map(item => item.value),
              backgroundColor: 'rgba(245, 158, 11, 0.5)',
              borderColor: 'rgb(245, 158, 11)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - EV/EBITDA`,
              data: companyData.ratios.evToEbitda.map(item => item.value),
              backgroundColor: 'rgba(139, 92, 246, 0.5)',
              borderColor: 'rgb(139, 92, 246)',
              borderWidth: 2
            },
            ...(competitorData ? [
              {
                label: `${competitorData.company.name} - P/E Ratio`,
                data: competitorData.ratios.peRatio.map(item => item.value),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2,
                borderDash: [5, 5]
              },
              {
                label: `${competitorData.company.name} - P/B Ratio`,
                data: competitorData.ratios.pbRatio.map(item => item.value),
                backgroundColor: 'rgba(52, 211, 153, 0.5)',
                borderColor: 'rgb(52, 211, 153)',
                borderWidth: 2,
                borderDash: [5, 5]
              }
            ] : [])
          ]
        };
      case 'profitability':
        return {
          labels: companyData.ratios.returnOnEquity.map(item => item.year.toString()),
          datasets: [
            {
              label: `${companyData.company.name} - ROE`,
              data: companyData.ratios.returnOnEquity.map(item => item.value * 100),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - ROA`,
              data: companyData.ratios.returnOnAssets.map(item => item.value * 100),
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - Net Margin`,
              data: companyData.ratios.netProfitMargin.map(item => item.value * 100),
              backgroundColor: 'rgba(245, 158, 11, 0.5)',
              borderColor: 'rgb(245, 158, 11)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - Gross Margin`,
              data: companyData.ratios.grossProfitMargin.map(item => item.value * 100),
              backgroundColor: 'rgba(139, 92, 246, 0.5)',
              borderColor: 'rgb(139, 92, 246)',
              borderWidth: 2
            },
            ...(competitorData ? [
              {
                label: `${competitorData.company.name} - ROE`,
                data: competitorData.ratios.returnOnEquity.map(item => item.value * 100),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2,
                borderDash: [5, 5]
              },
              {
                label: `${competitorData.company.name} - Net Margin`,
                data: competitorData.ratios.netProfitMargin.map(item => item.value * 100),
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
                borderColor: 'rgb(245, 158, 11)',
                borderWidth: 2,
                borderDash: [5, 5]
              }
            ] : [])
          ]
        };
      case 'growth':
        return {
          labels: companyData.ratios.revenueGrowth.map(item => item.year.toString()),
          datasets: [
            {
              label: `${companyData.company.name} - Revenue Growth`,
              data: companyData.ratios.revenueGrowth.map(item => item.value * 100),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - EPS Growth`,
              data: companyData.ratios.epsGrowth.map(item => item.value * 100),
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2
            },
            ...(competitorData ? [
              {
                label: `${competitorData.company.name} - Revenue Growth`,
                data: competitorData.ratios.revenueGrowth.map(item => item.value * 100),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2,
                borderDash: [5, 5]
              },
              {
                label: `${competitorData.company.name} - EPS Growth`,
                data: competitorData.ratios.epsGrowth.map(item => item.value * 100),
                backgroundColor: 'rgba(52, 211, 153, 0.5)',
                borderColor: 'rgb(52, 211, 153)',
                borderWidth: 2,
                borderDash: [5, 5]
              }
            ] : [])
          ]
        };
      case 'risk':
        return {
          labels: companyData.ratios.debtToEquity.map(item => item.year.toString()),
          datasets: [
            {
              label: `${companyData.company.name} - Debt to Equity`,
              data: companyData.ratios.debtToEquity.map(item => item.value),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - Current Ratio`,
              data: companyData.ratios.currentRatio.map(item => item.value),
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - Quick Ratio`,
              data: companyData.ratios.quickRatio.map(item => item.value),
              backgroundColor: 'rgba(245, 158, 11, 0.5)',
              borderColor: 'rgb(245, 158, 11)',
              borderWidth: 2
            },
            ...(competitorData ? [
              {
                label: `${competitorData.company.name} - Debt to Equity`,
                data: competitorData.ratios.debtToEquity.map(item => item.value),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2,
                borderDash: [5, 5]
              },
              {
                label: `${competitorData.company.name} - Current Ratio`,
                data: competitorData.ratios.currentRatio.map(item => item.value),
                backgroundColor: 'rgba(52, 211, 153, 0.5)',
                borderColor: 'rgb(52, 211, 153)',
                borderWidth: 2,
                borderDash: [5, 5]
              }
            ] : [])
          ]
        };
      case 'efficiency':
        return {
          labels: companyData.ratios.assetTurnover.map(item => item.year.toString()),
          datasets: [
            {
              label: `${companyData.company.name} - Asset Turnover`,
              data: companyData.ratios.assetTurnover.map(item => item.value),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2
            },
            {
              label: `${companyData.company.name} - Inventory Turnover`,
              data: companyData.ratios.inventoryTurnover.map(item => item.value),
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2
            },
            ...(competitorData ? [
              {
                label: `${competitorData.company.name} - Asset Turnover`,
                data: competitorData.ratios.assetTurnover.map(item => item.value),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2,
                borderDash: [5, 5]
              },
              {
                label: `${competitorData.company.name} - Inventory Turnover`,
                data: competitorData.ratios.inventoryTurnover.map(item => item.value),
                backgroundColor: 'rgba(52, 211, 153, 0.5)',
                borderColor: 'rgb(52, 211, 153)',
                borderWidth: 2,
                borderDash: [5, 5]
              }
            ] : [])
          ]
        };
      default:
        return { labels: [], datasets: [] };
    }
  };
  
  const chartData = getCategoryData();
  
  // Get explanations for each ratio category
  const getCategoryExplanation = () => {
    switch (category) {
      case 'valuation':
        return {
          title: 'Valuation Ratios',
          description: 'Valuation ratios measure a company\'s current share price relative to various financial metrics like earnings, book value, or sales.',
          ratios: [
            { name: 'P/E Ratio', description: 'Price to Earnings ratio shows how much investors are willing to pay for $1 of company earnings.' },
            { name: 'P/B Ratio', description: 'Price to Book ratio compares a company\'s market value to its book value.' },
            { name: 'P/S Ratio', description: 'Price to Sales ratio compares a company\'s stock price to its revenue.' },
            { name: 'EV/EBITDA', description: 'Enterprise Value to EBITDA ratio is used to determine the value of a company.' }
          ]
        };
      case 'profitability':
        return {
          title: 'Profitability Ratios',
          description: 'Profitability ratios assess a company\'s ability to generate earnings relative to its revenue, assets, or equity.',
          ratios: [
            { name: 'ROE', description: 'Return on Equity measures how efficiently a company uses its equity to generate profits.' },
            { name: 'ROA', description: 'Return on Assets shows how efficiently management is using assets to generate earnings.' },
            { name: 'Net Margin', description: 'Net Profit Margin measures how much net income is generated as a percentage of revenue.' },
            { name: 'Gross Margin', description: 'Gross Profit Margin indicates the percentage of revenue that exceeds the cost of goods sold.' }
          ]
        };
      case 'growth':
        return {
          title: 'Growth Ratios',
          description: 'Growth ratios measure a company\'s ability to increase size over time.',
          ratios: [
            { name: 'Revenue Growth', description: 'Measures the year-over-year increase in revenue.' },
            { name: 'EPS Growth', description: 'Measures the year-over-year increase in earnings per share.' }
          ]
        };
      case 'risk':
        return {
          title: 'Risk & Solvency Ratios',
          description: 'Risk ratios evaluate how sustainable a company\'s operations are in terms of debt and liquidity.',
          ratios: [
            { name: 'Debt to Equity', description: 'Compares a company\'s total debt to its shareholder equity.' },
            { name: 'Current Ratio', description: 'Measures a company\'s ability to pay short-term obligations.' },
            { name: 'Quick Ratio', description: 'Similar to current ratio but excludes inventory, showing ability to pay short-term obligations with liquid assets.' }
          ]
        };
      case 'efficiency':
        return {
          title: 'Efficiency Ratios',
          description: 'Efficiency ratios measure how effectively a company uses its assets and manages its liabilities.',
          ratios: [
            { name: 'Asset Turnover', description: 'Measures how efficiently a company uses its assets to generate revenue.' },
            { name: 'Inventory Turnover', description: 'Shows how many times a company\'s inventory is sold and replaced over a period.' }
          ]
        };
      default:
        return { title: '', description: '', ratios: [] };
    }
  };
  
  const categoryExplanation = getCategoryExplanation();
  
  // Comparison table data
  const getComparisonData = () => {
    switch (category) {
      case 'valuation':
        return [
          {
            name: 'P/E Ratio',
            company: companyData.ratios.peRatio[companyData.ratios.peRatio.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.peRatio[competitorData.ratios.peRatio.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.peRatio[companyData.ratios.peRatio.length - 1].value < 
               competitorData.ratios.peRatio[competitorData.ratios.peRatio.length - 1].value) : false
          },
          {
            name: 'P/B Ratio',
            company: companyData.ratios.pbRatio[companyData.ratios.pbRatio.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.pbRatio[competitorData.ratios.pbRatio.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.pbRatio[companyData.ratios.pbRatio.length - 1].value < 
               competitorData.ratios.pbRatio[competitorData.ratios.pbRatio.length - 1].value) : false
          },
          {
            name: 'P/S Ratio',
            company: companyData.ratios.psRatio[companyData.ratios.psRatio.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.psRatio[competitorData.ratios.psRatio.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.psRatio[companyData.ratios.psRatio.length - 1].value < 
               competitorData.ratios.psRatio[competitorData.ratios.psRatio.length - 1].value) : false
          },
          {
            name: 'EV/EBITDA',
            company: companyData.ratios.evToEbitda[companyData.ratios.evToEbitda.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.evToEbitda[competitorData.ratios.evToEbitda.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.evToEbitda[companyData.ratios.evToEbitda.length - 1].value < 
               competitorData.ratios.evToEbitda[competitorData.ratios.evToEbitda.length - 1].value) : false
          }
        ];
      case 'profitability':
        return [
          {
            name: 'ROE',
            company: formatPercentage(companyData.ratios.returnOnEquity[companyData.ratios.returnOnEquity.length - 1].value),
            competitor: competitorData ? formatPercentage(competitorData.ratios.returnOnEquity[competitorData.ratios.returnOnEquity.length - 1].value) : '-',
            better: competitorData ? 
              (companyData.ratios.returnOnEquity[companyData.ratios.returnOnEquity.length - 1].value > 
               competitorData.ratios.returnOnEquity[competitorData.ratios.returnOnEquity.length - 1].value) : false
          },
          {
            name: 'ROA',
            company: formatPercentage(companyData.ratios.returnOnAssets[companyData.ratios.returnOnAssets.length - 1].value),
            competitor: competitorData ? formatPercentage(competitorData.ratios.returnOnAssets[competitorData.ratios.returnOnAssets.length - 1].value) : '-',
            better: competitorData ? 
              (companyData.ratios.returnOnAssets[companyData.ratios.returnOnAssets.length - 1].value > 
               competitorData.ratios.returnOnAssets[competitorData.ratios.returnOnAssets.length - 1].value) : false
          },
          {
            name: 'Net Margin',
            company: formatPercentage(companyData.ratios.netProfitMargin[companyData.ratios.netProfitMargin.length - 1].value),
            competitor: competitorData ? formatPercentage(competitorData.ratios.netProfitMargin[competitorData.ratios.netProfitMargin.length - 1].value) : '-',
            better: competitorData ? 
              (companyData.ratios.netProfitMargin[companyData.ratios.netProfitMargin.length - 1].value > 
               competitorData.ratios.netProfitMargin[competitorData.ratios.netProfitMargin.length - 1].value) : false
          },
          {
            name: 'Gross Margin',
            company: formatPercentage(companyData.ratios.grossProfitMargin[companyData.ratios.grossProfitMargin.length - 1].value),
            competitor: competitorData ? formatPercentage(competitorData.ratios.grossProfitMargin[competitorData.ratios.grossProfitMargin.length - 1].value) : '-',
            better: competitorData ? 
              (companyData.ratios.grossProfitMargin[companyData.ratios.grossProfitMargin.length - 1].value > 
               competitorData.ratios.grossProfitMargin[competitorData.ratios.grossProfitMargin.length - 1].value) : false
          }
        ];
      case 'growth':
        return [
          {
            name: 'Revenue Growth',
            company: formatPercentage(companyData.ratios.revenueGrowth[companyData.ratios.revenueGrowth.length - 1].value),
            competitor: competitorData ? formatPercentage(competitorData.ratios.revenueGrowth[competitorData.ratios.revenueGrowth.length - 1].value) : '-',
            better: competitorData ? 
              (companyData.ratios.revenueGrowth[companyData.ratios.revenueGrowth.length - 1].value > 
               competitorData.ratios.revenueGrowth[competitorData.ratios.revenueGrowth.length - 1].value) : false
          },
          {
            name: 'EPS Growth',
            company: formatPercentage(companyData.ratios.epsGrowth[companyData.ratios.epsGrowth.length - 1].value),
            competitor: competitorData ? formatPercentage(competitorData.ratios.epsGrowth[competitorData.ratios.epsGrowth.length - 1].value) : '-',
            better: competitorData ? 
              (companyData.ratios.epsGrowth[companyData.ratios.epsGrowth.length - 1].value > 
               competitorData.ratios.epsGrowth[competitorData.ratios.epsGrowth.length - 1].value) : false
          }
        ];
      case 'risk':
        return [
          {
            name: 'Debt to Equity',
            company: companyData.ratios.debtToEquity[companyData.ratios.debtToEquity.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.debtToEquity[competitorData.ratios.debtToEquity.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.debtToEquity[companyData.ratios.debtToEquity.length - 1].value < 
               competitorData.ratios.debtToEquity[competitorData.ratios.debtToEquity.length - 1].value) : false
          },
          {
            name: 'Current Ratio',
            company: companyData.ratios.currentRatio[companyData.ratios.currentRatio.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.currentRatio[competitorData.ratios.currentRatio.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.currentRatio[companyData.ratios.currentRatio.length - 1].value > 
               competitorData.ratios.currentRatio[competitorData.ratios.currentRatio.length - 1].value) : false
          },
          {
            name: 'Quick Ratio',
            company: companyData.ratios.quickRatio[companyData.ratios.quickRatio.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.quickRatio[competitorData.ratios.quickRatio.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.quickRatio[companyData.ratios.quickRatio.length - 1].value > 
               competitorData.ratios.quickRatio[competitorData.ratios.quickRatio.length - 1].value) : false
          }
        ];
      case 'efficiency':
        return [
          {
            name: 'Asset Turnover',
            company: companyData.ratios.assetTurnover[companyData.ratios.assetTurnover.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.assetTurnover[competitorData.ratios.assetTurnover.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.assetTurnover[companyData.ratios.assetTurnover.length - 1].value > 
               competitorData.ratios.assetTurnover[competitorData.ratios.assetTurnover.length - 1].value) : false
          },
          {
            name: 'Inventory Turnover',
            company: companyData.ratios.inventoryTurnover[companyData.ratios.inventoryTurnover.length - 1].value.toFixed(2),
            competitor: competitorData ? competitorData.ratios.inventoryTurnover[competitorData.ratios.inventoryTurnover.length - 1].value.toFixed(2) : '-',
            better: competitorData ? 
              (companyData.ratios.inventoryTurnover[companyData.ratios.inventoryTurnover.length - 1].value > 
               competitorData.ratios.inventoryTurnover[competitorData.ratios.inventoryTurnover.length - 1].value) : false
          }
        ];
      default:
        return [];
    }
  };
  
  const comparisonData = getComparisonData();
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Ratio Analysis</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">Compare financial ratios between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
        </div>
        <ReportButton 
          companyData={companyData} 
          competitorData={competitorData} 
          targetElementId="ratio-analysis-section"
          type="chartOnly"
        />
      </div>
      
      {/* Category Selector */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 mb-6">
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => setCategory('valuation')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              category === 'valuation' 
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Valuation
          </button>
          <button
            onClick={() => setCategory('profitability')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              category === 'profitability' 
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Profitability
          </button>
          <button
            onClick={() => setCategory('growth')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              category === 'growth' 
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Growth
          </button>
          <button
            onClick={() => setCategory('risk')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              category === 'risk' 
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Risk
          </button>
          <button
            onClick={() => setCategory('efficiency')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              category === 'efficiency' 
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Efficiency
          </button>
        </div>
      </div>
      
      {/* Ratio Explanation */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-2">{categoryExplanation.title}</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary mb-4">{categoryExplanation.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryExplanation.ratios.map((ratio, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-dark-text-primary mb-1">{ratio.name}</h3>
              <p className="text-xs text-gray-600 dark:text-dark-text-secondary">{ratio.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Ratio Chart */}
      <div id="ratio-analysis-section" className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">{categoryExplanation.title} Trends</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setTimeframe('1Y')} 
              className={`px-2 py-1 text-xs rounded ${timeframe === '1Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              1Y
            </button>
            <button 
              onClick={() => setTimeframe('3Y')} 
              className={`px-2 py-1 text-xs rounded ${timeframe === '3Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              3Y
            </button>
            <button 
              onClick={() => setTimeframe('5Y')} 
              className={`px-2 py-1 text-xs rounded ${timeframe === '5Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              5Y
            </button>
          </div>
        </div>
        <FinancialChart 
          chartData={chartData} 
          chartType={category === 'growth' || category === 'profitability' ? 'line' : 'bar'}
          yAxisLabel={category === 'growth' || category === 'profitability' ? 'Percentage (%)' : 'Ratio Value'}
          tooltipSuffix={category === 'growth' || category === 'profitability' ? '%' : ''}
          title={categoryExplanation.title}
          termKey={
            category === 'valuation' ? 'peRatio' : 
            category === 'profitability' ? 'returnOnEquity' : 
            category === 'growth' ? 'revenueGrowth' : 
            category === 'risk' ? 'debtToEquity' : 
            'assetTurnover'
          }
          description={`This chart shows historical trends for key ${categoryExplanation.title.toLowerCase()} metrics. Hover over each data point for detailed information and definitions.`}
          colorScheme={category} // Apply the appropriate color scheme based on current category
        />
      </div>
      
      {/* Comparison Table */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Ratio Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                  Ratio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                  {companyData.company.name}
                </th>
                {competitorData && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                    {competitorData.company.name}
                  </th>
                )}
                {competitorData && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                    Comparison
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-dark-border">
              {comparisonData.map((item, index) => {
                // Map ratio name to termKey
                const getTermKey = (name: string) => {
                  switch (name) {
                    case 'P/E Ratio': return 'peRatio';
                    case 'P/B Ratio': return 'pbRatio';
                    case 'P/S Ratio': return 'psRatio';
                    case 'EV/EBITDA': return 'evToEbitda';
                    case 'ROE': return 'returnOnEquity';
                    case 'ROA': return 'returnOnAssets';
                    case 'Net Margin': return 'netProfitMargin';
                    case 'Gross Margin': return 'grossProfitMargin';
                    case 'Revenue Growth': return 'revenueGrowth';
                    case 'EPS Growth': return 'epsGrowth';
                    case 'Debt to Equity': return 'debtToEquity';
                    case 'Current Ratio': return 'currentRatio';
                    case 'Quick Ratio': return 'quickRatio';
                    case 'Asset Turnover': return 'assetTurnover';
                    case 'Inventory Turnover': return 'inventoryTurnover';
                    default: return '';
                  }
                };
                
                const termKey = getTermKey(item.name);
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                      {termKey ? (
                        <ChartTooltip title={item.name} termKey={termKey} size="sm" />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                      {item.company}
                    </td>
                    {competitorData && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                        {item.competitor}
                      </td>
                    )}
                    {competitorData && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.better ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                        }`}>
                          {item.better ? 'Better' : 'Worse'}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Analysis Summary */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Ratio Analysis Summary</h2>
        <div className="prose max-w-none text-gray-600 dark:text-dark-text-secondary">
          <p>
            This ratio analysis helps in assessing {companyData.company.name}'s financial performance 
            {competitorData ? ` compared to ${competitorData.company.name}` : ''} across multiple dimensions:
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Valuation:</strong> {companyData.company.name}'s P/E ratio of {companyData.ratios.peRatio[companyData.ratios.peRatio.length - 1].value.toFixed(2)} indicates 
              {competitorData ? (companyData.ratios.peRatio[companyData.ratios.peRatio.length - 1].value < competitorData.ratios.peRatio[competitorData.ratios.peRatio.length - 1].value ? 
                ' a more attractive valuation compared to its competitor.' : 
                ' a potentially overvalued position relative to its competitor.') : 
                ' how the market currently values its earnings.'}
            </li>
            <li>
              <strong>Profitability:</strong> With a net profit margin of {formatPercentage(companyData.ratios.netProfitMargin[companyData.ratios.netProfitMargin.length - 1].value)}, 
              the company {competitorData ? 
                (companyData.ratios.netProfitMargin[companyData.ratios.netProfitMargin.length - 1].value > competitorData.ratios.netProfitMargin[competitorData.ratios.netProfitMargin.length - 1].value ? 
                  'demonstrates stronger profitability than its competitor.' : 
                  'shows lower profitability compared to its competitor.') : 
                'demonstrates its efficiency in converting revenue into actual profit.'}
            </li>
            <li>
              <strong>Growth:</strong> The company's revenue is growing at {formatPercentage(companyData.ratios.revenueGrowth[companyData.ratios.revenueGrowth.length - 1].value)} annually, 
              which is {competitorData ? 
                (companyData.ratios.revenueGrowth[companyData.ratios.revenueGrowth.length - 1].value > competitorData.ratios.revenueGrowth[competitorData.ratios.revenueGrowth.length - 1].value ? 
                  'faster than its competitor.' : 
                  'slower than its competitor.') : 
                'an indicator of its market expansion capabilities.'}
            </li>
            <li>
              <strong>Risk:</strong> With a debt-to-equity ratio of {companyData.ratios.debtToEquity[companyData.ratios.debtToEquity.length - 1].value.toFixed(2)}, 
              the company {competitorData ? 
                (companyData.ratios.debtToEquity[companyData.ratios.debtToEquity.length - 1].value < competitorData.ratios.debtToEquity[competitorData.ratios.debtToEquity.length - 1].value ? 
                  'carries less debt relative to its equity compared to its competitor, indicating lower financial risk.' : 
                  'carries more debt relative to its equity compared to its competitor, suggesting higher financial risk.') : 
                'has this level of debt relative to its equity.'}
            </li>
          </ul>
          <p className="mt-4">
            {competitorData ? 
              `Overall, when comparing ${companyData.company.name} to ${competitorData.company.name}, the analysis suggests that ` + 
              (
                (companyData.ratios.peRatio[companyData.ratios.peRatio.length - 1].value < competitorData.ratios.peRatio[competitorData.ratios.peRatio.length - 1].value) && 
                (companyData.ratios.netProfitMargin[companyData.ratios.netProfitMargin.length - 1].value > competitorData.ratios.netProfitMargin[competitorData.ratios.netProfitMargin.length - 1].value) ? 
                  `${companyData.company.name} may represent a more attractive investment opportunity with better valuation and higher profitability.` : 
                  `investors should carefully weigh the trade-offs between valuation, growth, profitability, and risk when making investment decisions.`
              ) :
              `This ratio analysis provides a comprehensive view of ${companyData.company.name}'s financial health and performance. To gain further insights, consider comparing these metrics with industry averages and competitors.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatioAnalysis;