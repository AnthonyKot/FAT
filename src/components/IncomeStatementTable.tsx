import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber, formatPercentage } from '../utils/formatters';

interface IncomeStatementTableProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const IncomeStatementTable: React.FC<IncomeStatementTableProps> = ({ companyData, competitorData }) => {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Income Statement Details {companyData.company.symbol}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                Item
              </th>
              {companyData.incomeStatement.revenue.map(item => (
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
              {companyData.incomeStatement.revenue.map(item => (
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
              {companyData.incomeStatement.costOfRevenue.map(item => (
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
              {companyData.incomeStatement.grossProfit.map(item => (
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
              {companyData.incomeStatement.grossProfit.map((item, index) => {
                const revenue = companyData.incomeStatement.revenue[index].value;
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
              {companyData.incomeStatement.operatingExpenses.map(item => (
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
              {companyData.incomeStatement.operatingIncome.map(item => (
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
              {companyData.incomeStatement.operatingIncome.map((item, index) => {
                const revenue = companyData.incomeStatement.revenue[index].value;
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
              {companyData.incomeStatement.ebitda.map(item => (
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
              {companyData.incomeStatement.netIncome.map(item => (
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
              {companyData.incomeStatement.netIncome.map((item, index) => {
                const revenue = companyData.incomeStatement.revenue[index].value;
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
              {companyData.incomeStatement.eps.map(item => (
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
  );
};

export default IncomeStatementTable;