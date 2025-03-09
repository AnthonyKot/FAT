import React from 'react';
import { CompanyData } from '../types';
import FinancialChart from './FinancialChart';
import ChartTooltip from './ChartTooltip';
import ReportButton from './ReportButton';

interface FinancialRatioComparisonProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const FinancialRatioComparison: React.FC<FinancialRatioComparisonProps> = ({ companyData, competitorData }) => {
  // Prepare data for the valuation ratios comparison chart
  const prepareValuationRatiosChart = () => {
    // Helper to get the most recent value by sorting data by year first
    const getLatestValue = (data: Array<{year: number, value: number}>) => {
      if (!data || data.length === 0) return 0;
      // Sort by year in descending order to get most recent first
      const sortedData = [...data].sort((a, b) => b.year - a.year);
      return sortedData[0]?.value ?? 0;
    };
    
    const ratios = [
      { key: 'P/E Ratio', value1: getLatestValue(companyData.ratios.peRatio), value2: competitorData ? getLatestValue(competitorData.ratios.peRatio) : 0, termKey: 'peRatio' },
      { key: 'ROE', value1: getLatestValue(companyData.ratios.returnOnEquity) * 100, value2: competitorData ? getLatestValue(competitorData.ratios.returnOnEquity) * 100 : 0, termKey: 'returnOnEquity', suffix: '%' },
      { key: 'Net Margin', value1: getLatestValue(companyData.ratios.netProfitMargin) * 100, value2: competitorData ? getLatestValue(competitorData.ratios.netProfitMargin) * 100 : 0, termKey: 'netProfitMargin', suffix: '%' }
    ];
    
    return {
      labels: ratios.map(r => r.key),
      datasets: [
        {
          label: companyData.company.name,
          data: ratios.map(r => r.value1),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          termKeys: ratios.map(r => r.termKey)
        },
        ...(competitorData ? [{
          label: competitorData.company.name,
          data: ratios.map(r => r.value2),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
          termKeys: ratios.map(r => r.termKey)
        }] : [])
      ]
    };
  };

  // Prepare data for the financial health ratios comparison chart
  const prepareFinancialHealthRatiosChart = () => {
    // Helper to get the most recent value by sorting data by year first
    const getLatestValue = (data: Array<{year: number, value: number}>) => {
      if (!data || data.length === 0) return 0;
      // Sort by year in descending order to get most recent first
      const sortedData = [...data].sort((a, b) => b.year - a.year);
      return sortedData[0]?.value ?? 0;
    };
    
    const ratios = [
      { key: 'Debt to Equity', value1: getLatestValue(companyData.ratios.debtToEquity), value2: competitorData ? getLatestValue(competitorData.ratios.debtToEquity) : 0, termKey: 'debtToEquity' },
      { key: 'Current Ratio', value1: getLatestValue(companyData.ratios.currentRatio), value2: competitorData ? getLatestValue(competitorData.ratios.currentRatio) : 0, termKey: 'currentRatio' },
      { key: 'Quick Ratio', value1: getLatestValue(companyData.ratios.quickRatio), value2: competitorData ? getLatestValue(competitorData.ratios.quickRatio) : 0, termKey: 'quickRatio' }
    ];
    
    return {
      labels: ratios.map(r => r.key),
      datasets: [
        {
          label: companyData.company.name,
          data: ratios.map(r => r.value1),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          termKeys: ratios.map(r => r.termKey)
        },
        ...(competitorData ? [{
          label: competitorData.company.name,
          data: ratios.map(r => r.value2),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
          termKeys: ratios.map(r => r.termKey)
        }] : [])
      ]
    };
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">Financial Ratios</h2>
        <ReportButton
          companyData={companyData}
          competitorData={competitorData}
          targetElementId="ratios-charts"
          type="chartOnly"
        />
      </div>
      
      <div id="ratios-charts" className="grid grid-cols-1 gap-6">
        {/* Valuation and Profitability Ratios */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">Valuation & Profitability</h3>
            <ChartTooltip 
              title="Valuation & Profitability Ratios" 
              termKey="peRatio" 
              customDefinition="These ratios measure a company's value relative to its financials and its ability to generate profits."
            />
          </div>
          <FinancialChart
            chartData={prepareValuationRatiosChart()}
            chartType="bar"
            title="Valuation & Profitability Ratios"
            termKey="peRatio"
            description="P/E Ratio: Lower values may indicate better value. ROE & Net Margin: Higher values indicate better profitability."
          />
        </div>
        
        {/* Financial Health Ratios */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">Financial Health</h3>
            <ChartTooltip 
              title="Financial Health Ratios" 
              termKey="debtToEquity" 
              customDefinition="These ratios measure a company's leverage and ability to meet its financial obligations."
            />
          </div>
          <FinancialChart
            chartData={prepareFinancialHealthRatiosChart()}
            chartType="bar"
            title="Financial Health Ratios"
            termKey="debtToEquity"
            description="Debt to Equity: Lower is better. Current & Quick Ratios: Higher values indicate better liquidity and ability to pay short-term debts."
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialRatioComparison;