import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import FinancialChart from './FinancialChart';

interface IncomeStatementChartsProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const IncomeStatementCharts: React.FC<IncomeStatementChartsProps> = ({ companyData, competitorData }) => {
  // Prepare chart data for revenue
  const revenueChartData = {
    labels: companyData.incomeStatement.revenue.map(item => item.year.toString()),
    datasets: [
      {
        label: `${companyData.company.name} - Revenue`,
        data: companyData.incomeStatement.revenue.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
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

  // Prepare chart data for gross profit
  const grossProfitChartData = {
    labels: companyData.incomeStatement.revenue.map(item => item.year.toString()),
    datasets: [
      {
        label: `${companyData.company.name} - Gross Profit`,
        data: companyData.incomeStatement.grossProfit.map(item => item.value),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Gross Profit`,
          data: competitorData.incomeStatement.grossProfit.map(item => item.value),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        }
      ] : [])
    ]
  };

  // Prepare chart data for net income
  const netIncomeChartData = {
    labels: companyData.incomeStatement.revenue.map(item => item.year.toString()),
    datasets: [
      {
        label: `${companyData.company.name} - Net Income`,
        data: companyData.incomeStatement.netIncome.map(item => item.value),
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [
        {
          label: `${competitorData.company.name} - Net Income`,
          data: competitorData.incomeStatement.netIncome.map(item => item.value),
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
        <FinancialChart 
          chartData={netIncomeChartData} 
          chartType="bar"
          yAxisLabel="Amount ($)"
          tooltipPrefix="$"
          tooltipCallback={(value: number) => formatLargeNumber(value)}
          title="Net Income"
          termKey="netIncome"
          description="Comparison of net income over time."
          colorScheme="income"
        />
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
        <FinancialChart 
          chartData={grossProfitChartData} 
          chartType="bar"
          yAxisLabel="Amount ($)"
          tooltipPrefix="$"
          tooltipCallback={(value: number) => formatLargeNumber(value)}
          title="Gross Profit"
          termKey="grossProfit"
          description="Comparison of gross profit."
          colorScheme="income"
        />
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
        <FinancialChart 
          chartData={revenueChartData} 
          chartType="bar"
          yAxisLabel="Amount ($)"
          tooltipPrefix="$"
          tooltipCallback={(value: number) => formatLargeNumber(value)}
          title="Revenue"
          termKey="revenue"
          description="Comparison of revenue over time."
          colorScheme="income"
        />
      </div>
      
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
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
  );
};

export default IncomeStatementCharts;