import React from 'react';
import { CompanyData, FinancialData } from '../types';
import { formatLargeNumber, formatPercentage } from '../utils/formatters';
import Sparkline from './Sparkline';

interface GenericTableProps {
  title: string,
  data: {
    headers: string[],
    rows: {
      [key: string]: {
        values: {
          year: number,
          value: number
        }[]
      }
    }
  },
  competitorData?: CompanyData | null;
}

const GenericTable: React.FC<GenericTableProps> = ({ title, data, competitorData }) => {
  const { headers, rows } = data;
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">{title}</h2>
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
              {rows && Object.keys(rows).map(rowKey => {
                return rows[rowKey].values.slice().reverse().map((item, index, arr) => {
                  const prevItem = index > 0 ? arr[index - 1] : null;
                  const changePercent = prevItem ? ((item.value - prevItem.value) / Math.abs(prevItem.value) * 100) : 0;
                  const isSignificant = Math.abs(changePercent) > 10;
                  const isPositive = item.value > 0;
                  return (
                    <th key={item.year} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                      {item.year}
                    </th>
                  )
                })
              })}
              {competitorData && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider bg-gray-100 dark:bg-gray-700">
                  {competitorData.company.symbol} (Latest)
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-dark-border">
            {rows && Object.keys(rows).map(rowKey => {
              const row = rows[rowKey];
              return (
                <tr key={rowKey} className={rowKey.startsWith("total") ? "bg-blue-50 dark:bg-blue-900/30" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    <div className="flex items-center">
                      {rowKey}
                      {rowKey === 'Operating Cash Flow' || rowKey === 'Free Cash Flow' || rowKey === 'Net Change in Cash' ? <Sparkline data={rows[rowKey].values.map(item => item.value)} /> : null}
                    </div>
                  </td>
                  {row.values.slice().reverse().map((item, index, arr) => {
                    const prevItem = index > 0 ? arr[index - 1] : null;
                    const changePercent = prevItem ? ((item.value - prevItem.value) / Math.abs(prevItem.value) * 100) : 0;
                    const isSignificant = Math.abs(changePercent) > 10;
                    const isPositive = item.value > 0;
                    return (
                      <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                        <div className="flex items-center">
                          <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {formatLargeNumber(item.value)}
                          </span>
                          {prevItem && (
                            <span className={`ml-2 ${changePercent > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} ${isSignificant ? 'font-bold' : ''}`}>
                              {changePercent > 0 ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                  {competitorData && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                      {formatLargeNumber(competitorData.cashFlow[rowKey][competitorData.cashFlow[rowKey].length - 1].value)}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
