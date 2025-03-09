import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import Sparkline from './Sparkline';

interface CashFlowTableProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const CashFlowTable: React.FC<CashFlowTableProps> = ({ companyData, competitorData }) => {
  return (
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
              {companyData.cashFlow.operatingCashFlow.map(item => (
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
                  <Sparkline data={companyData.cashFlow.operatingCashFlow.map(item => item.value)} />
                </div>
              </td>
              {companyData.cashFlow.operatingCashFlow.map((item, index, arr) => {
                const prevItem = index > 0 ? arr[index - 1] : null;
                const changePercent = prevItem ? ((item.value - prevItem.value) / Math.abs(prevItem.value) * 100) : 0;
                const isSignificant = Math.abs(changePercent) > 10;
                
                return (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    <div className="flex items-center">
                      {formatLargeNumber(item.value)}
                      {prevItem && (
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
              {companyData.cashFlow.capitalExpenditures.map(item => (
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
                  <Sparkline data={companyData.cashFlow.freeCashFlow.map(item => item.value)} />
                </div>
              </td>
              {companyData.cashFlow.freeCashFlow.map((item, index, arr) => {
                const prevItem = index > 0 ? arr[index - 1] : null;
                const changePercent = prevItem ? ((item.value - prevItem.value) / Math.abs(prevItem.value) * 100) : 0;
                const isSignificant = Math.abs(changePercent) > 15;
                
                return (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    <div className="flex items-center">
                      {formatLargeNumber(item.value)}
                      {prevItem && (
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
              {companyData.cashFlow.dividendsPaid.map(item => (
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
              {companyData.cashFlow.netInvestingCashFlow.map(item => (
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
              {companyData.cashFlow.netFinancingCashFlow.map(item => (
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
                  <Sparkline data={companyData.cashFlow.netChangeInCash.map(item => item.value)} />
                </div>
              </td>
              {companyData.cashFlow.netChangeInCash.map((item, index, arr) => {
                const prevItem = index > 0 ? arr[index - 1] : null;
                const changePercent = prevItem ? ((item.value - prevItem.value) / Math.abs(prevItem.value) * 100) : 0;
                const isSignificant = Math.abs(changePercent) > 20;
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
  );
};

export default CashFlowTable;