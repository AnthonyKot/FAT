import React, { useState } from 'react';
import { CompanyData } from '../types';
import FinancialChart from './FinancialChart';
import FinancialDataTable from './FinancialDataTable';

interface BalanceSheetProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ companyData, competitorData }) => {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  
  if (!companyData) return null;

  // Configure sections for the balance sheet table
  const balanceSheetSections = [
    {
      title: 'Assets',
      rows: [
        { label: 'Cash & Equivalents', dataKey: 'cashAndEquivalents' },
        { label: 'Accounts Receivable', dataKey: 'accountsReceivable' },
        { label: 'Inventory', dataKey: 'inventory' },
        { label: 'Total Assets', dataKey: 'totalAssets', isBold: true },
      ]
    },
    {
      title: 'Liabilities',
      rows: [
        { label: 'Accounts Payable', dataKey: 'accountsPayable' },
        { label: 'Short Term Debt', dataKey: 'shortTermDebt' },
        { label: 'Long Term Debt', dataKey: 'longTermDebt' },
        { label: 'Total Liabilities', dataKey: 'totalLiabilities', isBold: true },
      ]
    },
    {
      title: 'Equity',
      rows: [
        { label: 'Total Equity', dataKey: 'totalEquity', isBold: true },
      ]
    }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Balance Sheet Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare balance sheet items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>
      
      {/* Balance Sheet Charts */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialChart 
          title="Assets vs Liabilities" 
          chartType="bar"
          chartData={{
            labels: companyData.balanceSheet.totalAssets.map(item => item.year.toString()),
            datasets: [
              {
                label: 'Total Assets',
                values: companyData.balanceSheet.totalAssets,
                competitor: competitorData?.balanceSheet.totalAssets
              },
              {
                label: 'Total Liabilities',
                values: companyData.balanceSheet.totalLiabilities,
                competitor: competitorData?.balanceSheet.totalLiabilities
              }
            ]
          }}
          yAxisFormatType="currency"
        />
        <FinancialChart 
          title="Assets, Liabilities & Equity" 
          chartType="bar"
          chartData={{
            labels: companyData.balanceSheet.totalAssets.map(item => item.year.toString()),
            datasets: [
              {
                label: 'Total Assets',
                values: companyData.balanceSheet.totalAssets,
                competitor: competitorData?.balanceSheet.totalAssets
              },
              {
                label: 'Total Liabilities',
                values: companyData.balanceSheet.totalLiabilities,
                competitor: competitorData?.balanceSheet.totalLiabilities
              },
              {
                label: 'Total Equity',
                values: companyData.balanceSheet.totalEquity,
                competitor: competitorData?.balanceSheet.totalEquity
              }
            ]
          }}
          yAxisFormatType="currency"
        />
      </div>
      
      {/* Balance Sheet Table using the reusable component */}
      <FinancialDataTable
        companyData={companyData}
        competitorData={competitorData}
        sections={balanceSheetSections}
        statementType="balanceSheet"
        years={3}
      />
    </div>
  );
};

export default BalanceSheet;