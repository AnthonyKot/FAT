import React, { useState } from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber, formatPercentage } from '../utils/formatters';
import FinancialChart from './FinancialChart';

interface IncomeStatementProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const IncomeStatement: React.FC<IncomeStatementProps> = ({ companyData, competitorData }) => {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  
  if (!companyData) return null;
  
  // Prepare chart data for revenue and profit
  const revenueAndProfitChartData = {
    labels: companyData.incomeStatement.revenue.map(item => item.year.toString()),
    datasets: [
      {
        label: `${companyData.company.name} - Revenue`,
        data: companyData.incomeStatement.revenue.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: `${companyData.company.name} - Gross Profit`,
        data: companyData.incomeStatement.grossProfit.map(item => item.value),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: `${companyData.company.name} - Net Income`,
        data: companyData.incomeStatement.netIncome.map(item => item.value),
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Revenue`,
          data: competitorData.incomeStatement.revenue.map(item => item.value),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        }
      ] : [])
    ]
  };
  
  // Prepare chart data for EPS
  const epsChartData = {
    labels: companyData.incomeStatement.eps.map(item => item.year.toString()),
    datasets: [
      {
        label: `${companyData.company.name} - EPS`,
        data: companyData.incomeStatement.eps.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - EPS`,
          data: competitorData.incomeStatement.eps.map(item => item.value),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        }
      ] : [])
    ]
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Income Statement Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare income statement items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Revenue & Profit</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeframe('1Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '1Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                1Y
              </button>
              <button 
                onClick={() => setTimeframe('3Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '3Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                3Y
              </button>
              <button 
                onClick={() => setTimeframe('5Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '5Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                5Y
              </button>
            </div>
          </div>
          <FinancialChart 
            chartData={revenueAndProfitChartData} 
            chartType="bar"
            yAxisLabel="Amount ($)"
            tooltipPrefix="$"
            tooltipCallback={(value: number) => formatLargeNumber(value)}
            title="Revenue and Profit"
            termKey="revenue"
            description="Comparison of revenue, gross profit, and net income over time."
            colorScheme="income"
          />
        </div>
        
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Earnings Per Share (EPS)</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeframe('1Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '1Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                1Y
              </button>
              <button 
                onClick={() => setTimeframe('3Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '3Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                3Y
              </button>
              <button 
                onClick={() => setTimeframe('5Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '5Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                5Y
              </button>
            </div>
          </div>
          <FinancialChart 
            chartData={epsChartData} 
            chartType="line"
            yAxisLabel="EPS ($)"
            tooltipPrefix="$"
            title="Earnings Per Share"
            termKey="eps"
            description="Trend of earnings per share (EPS) over time."
            colorScheme="income"
          />
        </div>
      </div>
      
      {/* Income Statement Table */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Income Statement Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                  Item
                </th>
                {companyData.incomeStatement.revenue.slice().reverse().map(item => (
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Revenue
                </td>
                {companyData.incomeStatement.revenue.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.incomeStatement.revenue[competitorData.incomeStatement.revenue.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Cost of Revenue
                </td>
                {companyData.incomeStatement.costOfRevenue.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.incomeStatement.costOfRevenue[competitorData.incomeStatement.costOfRevenue.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-green-50 dark:bg-green-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Gross Profit
                </td>
                {companyData.incomeStatement.grossProfit.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.incomeStatement.grossProfit[competitorData.incomeStatement.grossProfit.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Gross Margin
                </td>
                {companyData.incomeStatement.grossProfit.slice().reverse().map((item, index) => {
                  const revenue = companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1 - index].value;
                  const margin = item.value / revenue;
                  return (
                    <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                      {formatPercentage(margin)}
                    </td>
                  );
                })}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatPercentage(
                      competitorData.incomeStatement.grossProfit[competitorData.incomeStatement.grossProfit.length - 1].value / 
                      competitorData.incomeStatement.revenue[competitorData.incomeStatement.revenue.length - 1].value
                    )}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Operating Expenses
                </td>
                {companyData.incomeStatement.operatingExpenses.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.incomeStatement.operatingExpenses[competitorData.incomeStatement.operatingExpenses.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-blue-50 dark:bg-blue-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Operating Income
                </td>
                {companyData.incomeStatement.operatingIncome.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.incomeStatement.operatingIncome[competitorData.incomeStatement.operatingIncome.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Operating Margin
                </td>
                {companyData.incomeStatement.operatingIncome.slice().reverse().map((item, index) => {
                  const revenue = companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1 - index].value;
                  const margin = item.value / revenue;
                  return (
                    <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                      {formatPercentage(margin)}
                    </td>
                  );
                })}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatPercentage(
                      competitorData.incomeStatement.operatingIncome[competitorData.incomeStatement.operatingIncome.length - 1].value / 
                      competitorData.incomeStatement.revenue[competitorData.incomeStatement.revenue.length - 1].value
                    )}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  EBITDA
                </td>
                {companyData.incomeStatement.ebitda.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.incomeStatement.ebitda[competitorData.incomeStatement.ebitda.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-purple-50 dark:bg-purple-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Net Income
                </td>
                {companyData.incomeStatement.netIncome.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.incomeStatement.netIncome[competitorData.incomeStatement.netIncome.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Net Margin
                </td>
                {companyData.incomeStatement.netIncome.slice().reverse().map((item, index) => {
                  const revenue = companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1 - index].value;
                  const margin = item.value / revenue;
                  return (
                    <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                      {formatPercentage(margin)}
                    </td>
                  );
                })}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatPercentage(
                      competitorData.incomeStatement.netIncome[competitorData.incomeStatement.netIncome.length - 1].value / 
                      competitorData.incomeStatement.revenue[competitorData.incomeStatement.revenue.length - 1].value
                    )}
                  </td>
                )}
              </tr>
              <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Earnings Per Share (EPS)
                </td>
                {companyData.incomeStatement.eps.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    ${item.value.toFixed(2)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    ${competitorData.incomeStatement.eps[competitorData.incomeStatement.eps.length - 1].value.toFixed(2)}
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

export default IncomeStatement;