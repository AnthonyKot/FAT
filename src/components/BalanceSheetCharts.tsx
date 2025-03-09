import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import FinancialChart from './FinancialChart';

interface BalanceSheetChartsProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const BalanceSheetCharts: React.FC<BalanceSheetChartsProps> = ({ companyData, competitorData }) => {
  // Prepare chart data for assets comparison
  const assetsChartData = {
    labels: companyData.balanceSheet.totalAssets.map(item => item.year.toString()),
    datasets: [
      {
        label: `${companyData.company.name} - Total Assets`,
        data: companyData.balanceSheet.totalAssets.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: `${companyData.company.name} - Total Liabilities`,
        data: companyData.balanceSheet.totalLiabilities.map(item => item.value),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: `${companyData.company.name} - Total Equity`,
        data: companyData.balanceSheet.totalEquity.map(item => item.value),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Total Assets`,
          data: competitorData.balanceSheet.totalAssets.map(item => item.value),
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
  );
};

export default BalanceSheetCharts;