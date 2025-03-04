import React, { useState } from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import FinancialChart from './FinancialChart';

// Simple sparkline component for visual trend indicators
const Sparkline: React.FC<{ data: number[], height?: number, width?: number, color?: string, positiveColor?: string, negativeColor?: string }> = ({ 
  data, 
  height = 30, 
  width = 80, 
  positiveColor = "#10B981", 
  negativeColor = "#EF4444"
}) => {
  const normalizedData = [...data];
  const min = Math.min(...normalizedData);
  const max = Math.max(...normalizedData);
  const range = max - min;
  
  // Calculate if trend is positive
  const isPositive = normalizedData[normalizedData.length - 1] > normalizedData[0];
  const strokeColor = isPositive ? positiveColor : negativeColor;
  
  const points = normalizedData.map((value, index) => {
    const x = (index / (normalizedData.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="ml-2">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        points={points}
      />
      {isPositive && (
        <circle 
          cx={(normalizedData.length - 1) / (normalizedData.length - 1) * width} 
          cy={height - ((normalizedData[normalizedData.length - 1] - min) / range) * height} 
          r="3" 
          fill={positiveColor} 
        />
      )}
    </svg>
  );
};

interface CashFlowProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const CashFlow: React.FC<CashFlowProps> = ({ companyData, competitorData }) => {
  if (!companyData) return null;
  
  // Prepare chart data for cash flow comparison
  const operatingChartData = {
    labels: companyData.cashFlow.operatingCashFlow.map(item => item.year.toString()).reverse(),
    datasets: [
      {
        label: `${companyData.company.name} - Operating CF`,
        data: companyData.cashFlow.operatingCashFlow.map(item => item.value).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Operating CF`,
          data: competitorData.cashFlow.operatingCashFlow.map(item => item.value).reverse(),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        },
      ] : [])
    ]
  };

  const freeCashFlowChartData = {
    labels: companyData.cashFlow.operatingCashFlow.map(item => item.year.toString()).reverse(),
    datasets: [
      {
        label: `${companyData.company.name} - Free CF`,
        data: companyData.cashFlow.freeCashFlow.map(item => item.value).reverse(),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Free CF`,
          data: competitorData.cashFlow.freeCashFlow.map(item => item.value).reverse(),
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 2
        },
      ] : [])
    ]
  };

  // Prepare chart data for cash flow components
  const cashFlowComponentsChartData = {
    labels: companyData.cashFlow.operatingCashFlow.map(item => item.year.toString()).reverse(),
    datasets: [
      {
        label: `Operating CF`,
        data: companyData.cashFlow.operatingCashFlow.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: `Investing CF`,
        data: companyData.cashFlow.netInvestingCashFlow.map(item => item.value),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: `Financing CF`,
        data: companyData.cashFlow.netFinancingCashFlow.map(item => item.value),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: `Net Change in Cash`,
        data: companyData.cashFlow.netChangeInCash.map(item => item.value),
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      }
    ]
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Cash Flow Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare cash flow items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
          <FinancialChart 
            chartData={operatingChartData} 
            chartType="line"
            yAxisLabel="Amount ($)"
            tooltipPrefix="$"
            tooltipCallback={(value: number) => formatLargeNumber(value)}
            title="Cash Flow Trends"
            termKey="operatingCashFlow"
            description="Comparison of operating, free, and net change in cash over time."
            colorScheme="cashflow"
          />
        </div>
        
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
          <FinancialChart 
            chartData={cashFlowComponentsChartData} 
            chartType="bar"
            yAxisLabel="Amount ($)"
            tooltipPrefix="$"
            tooltipCallback={(value: number) => formatLargeNumber(value)}
            title="Cash Flow Components"
            termKey="operatingCashFlow"
            description="Breakdown of operating, investing, and financing cash flows."
            colorScheme="cashflow"
          />
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
          <FinancialChart
            chartData={freeCashFlowChartData}
            chartType="line"
            yAxisLabel="Amount ($)"
            tooltipPrefix="$"
            tooltipCallback={(value: number) => formatLargeNumber(value)}
            title="Free Cash Flow Trends"
            termKey="freeCashFlow"
            description="Comparison of free cash over time."
            colorScheme="cashflow"
          />
        </div>
      </div>

      {/* Cash Flow Analysis */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Cash Flow Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 dark:text-dark-text-primary mb-3">Cash Flow Efficiency</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Operating CF to Revenue</span>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  {(companyData.cashFlow.operatingCashFlow[companyData.cashFlow.operatingCashFlow.length - 1].value /
                    companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1].value * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (companyData.cashFlow.operatingCashFlow[companyData.cashFlow.operatingCashFlow.length - 1].value /
                      companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1].value * 100))}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Free CF to Operating CF</span>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  {(companyData.cashFlow.freeCashFlow[companyData.cashFlow.freeCashFlow.length - 1].value /
                    companyData.cashFlow.operatingCashFlow[companyData.cashFlow.operatingCashFlow.length - 1].value * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (companyData.cashFlow.freeCashFlow[companyData.cashFlow.freeCashFlow.length - 1].value /
                      companyData.cashFlow.operatingCashFlow[companyData.cashFlow.operatingCashFlow.length - 1].value * 100))}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">CapEx to Revenue</span>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  {(Math.abs(companyData.cashFlow.capitalExpenditures[companyData.cashFlow.capitalExpenditures.length - 1].value) /
                    companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1].value * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (Math.abs(companyData.cashFlow.capitalExpenditures[companyData.cashFlow.capitalExpenditures.length - 1].value) /
                      companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1].value * 100))}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-800 dark:text-dark-text-primary mb-3">Cash Flow Trends</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">1</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                <span className="font-medium text-gray-900 dark:text-dark-text-primary">Operating Cash Flow:</span> {
                  companyData.cashFlow.operatingCashFlow[0].value >
                    companyData.cashFlow.operatingCashFlow[1].value
                    ? 'Increasing trend indicates strong operational performance.'
                    : 'Decreasing trend may indicate operational challenges.'
                }
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">2</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                <span className="font-medium text-gray-900 dark:text-dark-text-primary">Free Cash Flow:</span> {
                  companyData.cashFlow.freeCashFlow[0].value >
                    companyData.cashFlow.freeCashFlow[1].value
                    ? 'Positive growth suggests increasing financial flexibility.'
                    : 'Declining free cash flow may limit future investment opportunities.'
                }
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">3</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                <span className="font-medium text-gray-900 dark:text-dark-text-primary">Capital Expenditures:</span> {
                  Math.abs(companyData.cashFlow.capitalExpenditures[0].value) >
                    Math.abs(companyData.cashFlow.capitalExpenditures[1].value)
                    ? 'Increasing investment in long-term assets may drive future growth.'
                    : 'Reduced capital spending could indicate caution or limited growth opportunities.'
                }
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">4</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                <span className="font-medium text-gray-900 dark:text-dark-text-primary">Cash Return to Shareholders:</span> {
                  Math.abs(companyData.cashFlow.dividendsPaid[companyData.cashFlow.dividendsPaid.length - 1].value) > 0
                    ? 'Company returns value to shareholders through dividends.'
                    : 'No dividend payments may indicate focus on reinvestment or growth.'
                }
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Cash Flow Table */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Cash Flow Details ({companyData.company.symbol})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                  <div className="flex items-center">
                    Item
                    <span className="text-xs ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full">Trends</span>
                  </div>
                </th>
                {companyData.cashFlow.operatingCashFlow.slice().reverse().map(item => (
                  <th key={item.year} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                    {item.year}
                  </th>
                ))}
                {competitorData && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider bg-gray-100 dark:bg-gray-700">
                    {competitorData.company.symbol} (Latest)
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-dark-border">
              <tr className="bg-blue-50 dark:bg-blue-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  <div className="flex items-center">
                    Operating Cash Flow
                    <Sparkline data={companyData.cashFlow.operatingCashFlow.map(item => item.value).reverse()} />
                  </div>
                </td>
                {companyData.cashFlow.operatingCashFlow.slice().reverse().map((item, index, arr) => {
                  const prevYear = index ? arr[index - 1] : null;
                  const changePercent = prevYear ? ((item.value - prevYear.value) / Math.abs(prevYear.value) * 100) : 0;
                  const isSignificant = Math.abs(changePercent) > 10;
                  
                  return (
                    <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                      <div className="flex items-center">
                        {formatLargeNumber(item.value)}
                        {prevYear && (
                          <span className={`ml-2 ${changePercent > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} ${isSignificant ? 'font-bold' : ''}`}>
                            {changePercent > 0 ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.cashFlow.operatingCashFlow[competitorData.cashFlow.operatingCashFlow.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Capital Expenditures
                </td>
                {companyData.cashFlow.capitalExpenditures.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.cashFlow.capitalExpenditures[competitorData.cashFlow.capitalExpenditures.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-green-50 dark:bg-green-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  <div className="flex items-center">
                    Free Cash Flow
                    <Sparkline data={companyData.cashFlow.freeCashFlow.map(item => item.value).reverse()} />
                  </div>
                </td>
                {companyData.cashFlow.freeCashFlow.slice().reverse().map((item, index, arr) => {
                  const prevYear = index ? arr[index - 1] : null;
                  const changePercent = prevYear ? ((item.value - prevYear.value) / Math.abs(prevYear.value) * 100) : 0;
                  const isSignificant = Math.abs(changePercent) > 15;
                  
                  return (
                    <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                      <div className="flex items-center">
                        {formatLargeNumber(item.value)}
                        {prevYear && (
                          <span className={`ml-2 ${changePercent > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} ${isSignificant ? 'font-bold' : ''}`}>
                            {changePercent > 0 ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.cashFlow.freeCashFlow[0].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Dividends Paid
                </td>
                {companyData.cashFlow.dividendsPaid.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.cashFlow.dividendsPaid[0].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-red-50 dark:bg-red-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Net Investing Cash Flow
                </td>
                {companyData.cashFlow.netInvestingCashFlow.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.cashFlow.netInvestingCashFlow[0].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Net Financing Cash Flow
                </td>
                {companyData.cashFlow.netFinancingCashFlow.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.cashFlow.netFinancingCashFlow[0].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-purple-50 dark:bg-purple-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  <div className="flex items-center">
                    Net Change in Cash
                    <Sparkline data={companyData.cashFlow.netChangeInCash.map(item => item.value).reverse()} />
                  </div>
                </td>
                {companyData.cashFlow.netChangeInCash.slice().reverse().map((item, index, arr) => {
                  const prevYear = index ? arr[index - 1] : null;
                  const changePercent = prevYear ? ((item.value - prevYear.value) / Math.abs(prevYear.value) * 100) : 0;
                  const isSignificant = Math.abs(changePercent) > 20;
                  const isPositive = item.value > 0;
                  
                  return (
                    <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                      <div className="flex items-center">
                        <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {formatLargeNumber(item.value)}
                        </span>
                        {prevYear && (
                          <span className={`ml-2 ${changePercent > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} ${isSignificant ? 'font-bold' : ''}`}>
                            {changePercent > 0 ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.cashFlow.netChangeInCash[0].value)}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashFlow;