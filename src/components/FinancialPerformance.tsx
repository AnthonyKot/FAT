import React from 'react';
import { CompanyData } from '../types';
import { formatPercentage, formatCurrencyAbbreviated } from '../utils/formatters';
import ChartTooltip from './ChartTooltip';

interface FinancialPerformanceProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const FinancialPerformance: React.FC<FinancialPerformanceProps> = ({ companyData, competitorData }) => {
  // Helper to get the most recent value by sorting data by year first
  const getLatestValue = (data: Array<{year: number, value: number}>) => {
    if (!data || data.length === 0) return 0;
    // Sort by year in descending order to get most recent first
    const sortedData = [...data].sort((a, b) => b.year - a.year);
    return sortedData[0]?.value ?? 0;
  };

  // Comparison calculations
  const revenue1 = getLatestValue(companyData.incomeStatement.revenue);
  const revenue2 = competitorData ? getLatestValue(competitorData.incomeStatement.revenue) : 0;
  const revenueGrowth1 = getLatestValue(companyData.ratios.revenueGrowth);
  const revenueGrowth2 = competitorData ? getLatestValue(competitorData.ratios.revenueGrowth) : 0;
  
  const netIncome1 = getLatestValue(companyData.incomeStatement.netIncome);
  const netIncome2 = competitorData ? getLatestValue(competitorData.incomeStatement.netIncome) : 0;
  
  const peRatio1 = getLatestValue(companyData.ratios.peRatio);
  const peRatio2 = competitorData ? getLatestValue(competitorData.ratios.peRatio) : 0;
  const isPEBetter = peRatio1 < peRatio2;
  
  const roe1 = getLatestValue(companyData.ratios.returnOnEquity);
  const roe2 = competitorData ? getLatestValue(competitorData.ratios.returnOnEquity) : 0;
  const isROEBetter = roe1 > roe2;
  
  const netMargin1 = getLatestValue(companyData.ratios.netProfitMargin);
  const netMargin2 = competitorData ? getLatestValue(competitorData.ratios.netProfitMargin) : 0;
  const isNetMarginBetter = netMargin1 > netMargin2;
  
  const debtToEquity1 = getLatestValue(companyData.ratios.debtToEquity);
  const debtToEquity2 = competitorData ? getLatestValue(competitorData.ratios.debtToEquity) : 0;
  const isDebtToEquityBetter = debtToEquity1 < debtToEquity2;

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-md font-medium text-gray-800 dark:text-dark-text-primary mb-2">Revenue & Growth</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                <ChartTooltip title="Revenue" termKey="revenue" size="sm" />
              </span>
              <div className="text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-400">{formatCurrencyAbbreviated(revenue1)}</span>
                {competitorData && (
                  <span className="ml-2 text-red-700 dark:text-red-400">vs {formatCurrencyAbbreviated(revenue2)}</span>
                )}
              </div>
            </div>
            {competitorData && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(revenue1 / (revenue1 + revenue2)) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                <ChartTooltip title="Revenue Growth" termKey="revenueGrowth" size="sm" />
              </span>
              <div className="text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-400">{formatPercentage(revenueGrowth1)}</span>
                {competitorData && (
                  <span className="ml-2 text-red-700 dark:text-red-400">vs {formatPercentage(revenueGrowth2)}</span>
                )}
              </div>
            </div>
            {competitorData && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${revenueGrowth1 > revenueGrowth2 ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                  style={{ width: `${(revenueGrowth1 / Math.max(revenueGrowth1, revenueGrowth2)) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                <ChartTooltip title="Net Income" termKey="netIncome" size="sm" />
              </span>
              <div className="text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-400">{formatCurrencyAbbreviated(netIncome1)}</span>
                {competitorData && (
                  <span className="ml-2 text-red-700 dark:text-red-400">vs {formatCurrencyAbbreviated(netIncome2)}</span>
                )}
              </div>
            </div>
            {competitorData && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(netIncome1 / (netIncome1 + netIncome2)) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-md font-medium text-gray-800 dark:text-dark-text-primary mb-2">Key Ratios</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                <ChartTooltip title="P/E Ratio" termKey="peRatio" size="sm" />
              </span>
              <div className="text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-400">{peRatio1.toFixed(2)}</span>
                {competitorData && (
                  <span className="ml-2 text-red-700 dark:text-red-400">vs {peRatio2.toFixed(2)}</span>
                )}
              </div>
            </div>
            {competitorData && (
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isPEBetter ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                    style={{ width: `${(Math.min(peRatio1, peRatio2) / Math.max(peRatio1, peRatio2)) * 100}%` }}
                  ></div>
                </div>
                <span className={`ml-2 text-xs ${isPEBetter ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isPEBetter ? 'Better' : 'Worse'}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                <ChartTooltip title="ROE" termKey="returnOnEquity" size="sm" />
              </span>
              <div className="text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-400">{formatPercentage(roe1)}</span>
                {competitorData && (
                  <span className="ml-2 text-red-700 dark:text-red-400">vs {formatPercentage(roe2)}</span>
                )}
              </div>
            </div>
            {competitorData && (
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isROEBetter ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                    style={{ width: `${(roe1 / Math.max(roe1, roe2)) * 100}%` }}
                  ></div>
                </div>
                <span className={`ml-2 text-xs ${isROEBetter ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isROEBetter ? 'Better' : 'Worse'}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                <ChartTooltip title="Net Margin" termKey="netProfitMargin" size="sm" />
              </span>
              <div className="text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-400">{formatPercentage(netMargin1)}</span>
                {competitorData && (
                  <span className="ml-2 text-red-700 dark:text-red-400">vs {formatPercentage(netMargin2)}</span>
                )}
              </div>
            </div>
            {competitorData && (
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isNetMarginBetter ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                    style={{ width: `${(netMargin1 / Math.max(netMargin1, netMargin2)) * 100}%` }}
                  ></div>
                </div>
                <span className={`ml-2 text-xs ${isNetMarginBetter ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isNetMarginBetter ? 'Better' : 'Worse'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPerformance;