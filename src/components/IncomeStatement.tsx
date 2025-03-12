import React from 'react';
import { CompanyData } from '../types';
import FinancialChart from './FinancialChart';
import FinancialDataTable from './FinancialDataTable';

interface IncomeStatementProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const IncomeStatement: React.FC<IncomeStatementProps> = ({ companyData, competitorData }) => {  
  if (!companyData) return null;

  // Configure sections for the income statement table
  const incomeStatementSections = [
    {
      rows: [
        { label: 'Revenue', dataKey: 'revenue' },
        { label: 'Cost of Revenue', dataKey: 'costOfRevenue' },
        { label: 'Gross Profit', dataKey: 'grossProfit' },
        { label: 'Operating Expenses', dataKey: 'operatingExpenses' },
        { label: 'Operating Income', dataKey: 'operatingIncome' },
        { label: 'Net Income', dataKey: 'netIncome', isBold: true },
        { label: 'EPS', dataKey: 'eps', isBold: true }
      ]
    }
  ];

  // Special formatter for EPS values
  const epsFormatter = (value: number): string => {
    if (value < 10) {
      // For small values like EPS, show more decimal places
      return `$${value.toFixed(2)}`;
    }
    return `$${Math.round(value / 1000000).toLocaleString()}M`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Income Statement Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare income statement items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>
      
      {/* Income Statement Charts */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialChart 
          title="Revenue vs Net Income" 
          chartType="bar"
          chartData={{
            labels: companyData.incomeStatement.revenue.map(item => item.year.toString()),
            datasets: [
              {
                label: 'Revenue',
                values: companyData.incomeStatement.revenue,
                competitor: competitorData?.incomeStatement.revenue
              },
              {
                label: 'Net Income',
                values: companyData.incomeStatement.netIncome,
                competitor: competitorData?.incomeStatement.netIncome
              }
            ]
          }}
          yAxisFormatType="currency"
        />
        <FinancialChart 
          title="Gross Profit & Operating Income" 
          chartType="bar"
          chartData={{
            labels: companyData.incomeStatement.grossProfit.map(item => item.year.toString()),
            datasets: [
              {
                label: 'Gross Profit',
                values: companyData.incomeStatement.grossProfit,
                competitor: competitorData?.incomeStatement.grossProfit
              },
              {
                label: 'Operating Income',
                values: companyData.incomeStatement.operatingIncome,
                competitor: competitorData?.incomeStatement.operatingIncome
              }
            ]
          }}
          yAxisFormatType="currency"
        />
      </div>
      
      {/* Income Statement Table */}
      <FinancialDataTable
        companyData={companyData}
        competitorData={competitorData}
        sections={incomeStatementSections}
        statementType="incomeStatement"
        years={3}
        formatter={epsFormatter}
      />
    </div>
  );
};

export default IncomeStatement;