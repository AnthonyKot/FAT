import React from 'react';
import { CompanyData } from '../types';
import FinancialChart from './FinancialChart';
import FinancialDataTable from './FinancialDataTable';

interface CashFlowProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const CashFlow: React.FC<CashFlowProps> = ({ companyData, competitorData }) => {
  if (!companyData) return null;

  // Configure sections for the cash flow table
  const cashFlowSections = [
    {
      rows: [
        { label: 'Operating Cash Flow', dataKey: 'operatingCashFlow' },
        { label: 'Capital Expenditures', dataKey: 'capitalExpenditures' },
        { label: 'Free Cash Flow', dataKey: 'freeCashFlow', isBold: true },
        { label: 'Dividends Paid', dataKey: 'dividendsPaid' },
        { label: 'Net Investing Cash Flow', dataKey: 'netInvestingCashFlow' },
        { label: 'Net Financing Cash Flow', dataKey: 'netFinancingCashFlow' },
        { label: 'Net Change in Cash', dataKey: 'netChangeInCash', isBold: true },
      ]
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Cash Flow Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare cash flow items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>

      {/* Cash Flow Charts */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialChart 
          title="Operating Cash Flow vs Free Cash Flow" 
          chartType="bar"
          chartData={{
            labels: companyData.cashFlow.operatingCashFlow.map(item => item.year.toString()),
            datasets: [
              {
                label: 'Operating Cash Flow',
                values: companyData.cashFlow.operatingCashFlow,
                competitor: competitorData?.cashFlow.operatingCashFlow
              },
              {
                label: 'Free Cash Flow',
                values: companyData.cashFlow.freeCashFlow,
                competitor: competitorData?.cashFlow.freeCashFlow
              }
            ]
          }}
          yAxisFormatType="currency"
        />
        <FinancialChart 
          title="Cash Flow Components" 
          chartType="bar"
          chartData={{
            labels: companyData.cashFlow.operatingCashFlow.map(item => item.year.toString()),
            datasets: [
              {
                label: 'Operating CF',
                values: companyData.cashFlow.operatingCashFlow,
                competitor: competitorData?.cashFlow.operatingCashFlow
              },
              {
                label: 'Investing CF',
                values: companyData.cashFlow.netInvestingCashFlow,
                competitor: competitorData?.cashFlow.netInvestingCashFlow
              },
              {
                label: 'Financing CF',
                values: companyData.cashFlow.netFinancingCashFlow,
                competitor: competitorData?.cashFlow.netFinancingCashFlow
              }
            ]
          }}
          yAxisFormatType="currency"
        />
      </div>

      {/* Cash Flow Analysis */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Cash Flow Analysis</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Operating Cash Flow</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {companyData.company.name}'s operating cash flow 
              {companyData.cashFlow.operatingCashFlow[0].value > companyData.cashFlow.operatingCashFlow[1].value 
                ? ' has increased compared to the previous year, indicating improved operational efficiency and healthy business operations.' 
                : ' has decreased compared to the previous year, which may indicate challenges in core business operations or changes in working capital management.'}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Free Cash Flow</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Free cash flow is 
              {companyData.cashFlow.freeCashFlow[0].value > 0 
                ? ' positive, suggesting the company has cash available for debt payments, dividends, and future investments.' 
                : ' negative, which may indicate heavy investments or potential concerns about long-term financial stability.'}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Capital Expenditure</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Capital expenditures represent 
              {Math.abs(companyData.cashFlow.capitalExpenditures[0].value) / companyData.cashFlow.operatingCashFlow[0].value > 0.5 
                ? ' a significant portion of operating cash flow, indicating substantial investments in long-term assets.' 
                : ' a moderate portion of operating cash flow, balancing investments with maintaining liquidity.'}
            </p>
          </div>
        </div>
      </div>

      {/* Cash Flow Table */}
      <FinancialDataTable
        companyData={companyData}
        competitorData={competitorData}
        sections={cashFlowSections}
        statementType="cashFlow"
        years={3}
      />
    </div>
  );
};

export default CashFlow;