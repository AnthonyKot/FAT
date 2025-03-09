import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import FinancialChart from './FinancialChart';

interface CashFlowChartsProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const CashFlowCharts: React.FC<CashFlowChartsProps> = ({ companyData, competitorData }) => {
  // Prepare chart data for operating cash flow comparison
  const operatingChartData = {
    labels: companyData.cashFlow.operatingCashFlow.map(item => item.year.toString()),
    datasets: [
      {
        label: `${companyData.company.name} - Operating CF`,
        data: companyData.cashFlow.operatingCashFlow.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Operating CF`,
          data: competitorData.cashFlow.operatingCashFlow.map(item => item.value),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        },
      ] : [])
    ]
  };

  // Prepare chart data for free cash flow comparison
  const freeCashFlowChartData = {
    labels: companyData.cashFlow.operatingCashFlow.map(item => item.year.toString()),
    datasets: [
      {
        label: `${companyData.company.name} - Free CF`,
        data: companyData.cashFlow.freeCashFlow.map(item => item.value),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Free CF`,
          data: competitorData.cashFlow.freeCashFlow.map(item => item.value),
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 2
        },
      ] : [])
    ]
  };

  // Prepare chart data for cash flow components
  const cashFlowComponentsChartData = {
    labels: companyData.cashFlow.operatingCashFlow.map(item => item.year.toString()),
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
  );
};

export default CashFlowCharts;