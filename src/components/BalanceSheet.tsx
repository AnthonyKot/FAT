import React, { useState } from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import FinancialChart from './FinancialChart';

interface BalanceSheetProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ companyData, competitorData }) => {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  
  if (!companyData) return null;
  
  // Prepare chart data for assets comparison
  const assetsChartData = {
    labels: companyData.balanceSheet.totalAssets.map(item => item.year.toString()).reverse(),
    datasets: [
      {
        label: `${companyData.company.name} - Total Assets`,
        data: companyData.balanceSheet.totalAssets.map(item => item.value).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: `${companyData.company.name} - Total Liabilities`,
        data: companyData.balanceSheet.totalLiabilities.map(item => item.value).reverse(),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: `${companyData.company.name} - Total Equity`,
        data: companyData.balanceSheet.totalEquity.map(item => item.value).reverse(),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Total Assets`,
          data: competitorData.balanceSheet.totalAssets.map(item => item.value).reverse(),
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 2
        }
      ] : [])
    ]
  };
  
  // Prepare chart data for asset composition
  const assetCompositionChartData = {
    labels: ['Cash', 'Investments', 'Receivables', 'Inventory', 'PP&E', 'Goodwill', 'Intangibles'],
    datasets: [
      {
        label: companyData.company.name,
        data: [
          companyData.balanceSheet.cashAndEquivalents[companyData.balanceSheet.cashAndEquivalents.length - 1].value,
          companyData.balanceSheet.shortTermInvestments[companyData.balanceSheet.shortTermInvestments.length - 1].value,
          companyData.balanceSheet.accountsReceivable[companyData.balanceSheet.accountsReceivable.length - 1].value,
          companyData.balanceSheet.inventory[companyData.balanceSheet.inventory.length - 1].value,
          companyData.balanceSheet.propertyPlantEquipment[companyData.balanceSheet.propertyPlantEquipment.length - 1].value,
          companyData.balanceSheet.goodwill[companyData.balanceSheet.goodwill.length - 1].value,
          companyData.balanceSheet.intangibleAssets[companyData.balanceSheet.intangibleAssets.length - 1].value
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [{
        label: competitorData.company.name,
        data: [
          competitorData.balanceSheet.cashAndEquivalents[competitorData.balanceSheet.cashAndEquivalents.length - 1].value,
          competitorData.balanceSheet.shortTermInvestments[competitorData.balanceSheet.shortTermInvestments.length - 1].value,
          competitorData.balanceSheet.accountsReceivable[competitorData.balanceSheet.accountsReceivable.length - 1].value,
          competitorData.balanceSheet.inventory[competitorData.balanceSheet.inventory.length - 1].value,
          competitorData.balanceSheet.propertyPlantEquipment[competitorData.balanceSheet.propertyPlantEquipment.length - 1].value,
          competitorData.balanceSheet.goodwill[competitorData.balanceSheet.goodwill.length - 1].value,
          competitorData.balanceSheet.intangibleAssets[competitorData.balanceSheet.intangibleAssets.length - 1].value
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }] : [])
    ]
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Balance Sheet Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare balance sheet items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
          <FinancialChart 
            chartData={assetsChartData} 
            chartType="line"
            yAxisLabel="Amount ($)"
            tooltipPrefix="$"
            tooltipCallback={(value: number) => formatLargeNumber(value)}
            title="Assets, Liabilities & Equity"
            termKey="totalAssets"
            description="Comparison of assets, liabilities, and equity over time."
            colorScheme="balance"
          />
        </div>
        
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
          <FinancialChart 
            chartData={assetCompositionChartData} 
            chartType="bar"
            yAxisLabel="Amount ($)"
            tooltipPrefix="$"
            tooltipCallback={(value: number) => formatLargeNumber(value)}
            title="Asset Composition"
            termKey="totalAssets"
            description="Breakdown of different asset categories in the most recent reporting period."
            colorScheme="balance"
          />
        </div>
      </div>
      
      {/* Balance Sheet Table */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Balance Sheet Details {companyData.company.symbol}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                  Item
                </th>
                {companyData.balanceSheet.totalAssets.slice().reverse().map(item => (
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
              {/* Assets */}
              <tr className="bg-blue-50 dark:bg-blue-900/20">
                <td colSpan={companyData.balanceSheet.totalAssets.length + (competitorData ? 2 : 1)} className="px-6 py-2 text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Assets
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Cash & Equivalents
                </td>
                {companyData.balanceSheet.cashAndEquivalents.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.cashAndEquivalents[competitorData.balanceSheet.cashAndEquivalents.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Short-Term Investments
                </td>
                {companyData.balanceSheet.shortTermInvestments.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.shortTermInvestments[competitorData.balanceSheet.shortTermInvestments.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Accounts Receivable
                </td>
                {companyData.balanceSheet.accountsReceivable.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.accountsReceivable[competitorData.balanceSheet.accountsReceivable.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Inventory
                </td>
                {companyData.balanceSheet.inventory.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.inventory[competitorData.balanceSheet.inventory.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Property, Plant & Equipment
                </td>
                {companyData.balanceSheet.propertyPlantEquipment.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.propertyPlantEquipment[competitorData.balanceSheet.propertyPlantEquipment.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Goodwill
                </td>
                {companyData.balanceSheet.goodwill.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.goodwill[competitorData.balanceSheet.goodwill.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Intangible Assets
                </td>
                {companyData.balanceSheet.intangibleAssets.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.intangibleAssets[competitorData.balanceSheet.intangibleAssets.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-blue-50 dark:bg-blue-900/30">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Total Assets
                </td>
                {companyData.balanceSheet.totalAssets.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.totalAssets[competitorData.balanceSheet.totalAssets.length - 1].value)}
                  </td>
                )}
              </tr>
              
              {/* Liabilities */}
              <tr className="bg-red-50 dark:bg-red-900/20">
                <td colSpan={companyData.balanceSheet.totalAssets.length + (competitorData ? 2 : 1)} className="px-6 py-2 text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Liabilities
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Accounts Payable
                </td>
                {companyData.balanceSheet.accountsPayable.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.accountsPayable[competitorData.balanceSheet.accountsPayable.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Short-Term Debt
                </td>
                {companyData.balanceSheet.shortTermDebt.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.shortTermDebt[competitorData.balanceSheet.shortTermDebt.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Long-Term Debt
                </td>
                {companyData.balanceSheet.longTermDebt.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.longTermDebt[competitorData.balanceSheet.longTermDebt.length - 1].value)}
                  </td>
                )}
              </tr>
              <tr className="bg-red-50 dark:bg-red-900/30">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Total Liabilities
                </td>
                {companyData.balanceSheet.totalLiabilities.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.totalLiabilities[competitorData.balanceSheet.totalLiabilities.length - 1].value)}
                  </td>
                )}
              </tr>
              
              {/* Equity */}
              <tr className="bg-green-50 dark:bg-green-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  Total Equity
                </td>
                {companyData.balanceSheet.totalEquity.slice().reverse().map(item => (
                  <td key={item.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                    {formatLargeNumber(item.value)}
                  </td>
                ))}
                {competitorData && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-gray-800">
                    {formatLargeNumber(competitorData.balanceSheet.totalEquity[competitorData.balanceSheet.totalEquity.length - 1].value)}
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

export default BalanceSheet;