import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import FinancialChart from './FinancialChart';

interface FinancialChartSectionProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const FinancialChartSection: React.FC<FinancialChartSectionProps> = ({ companyData, competitorData }) => {
  // Helper function to sort data chronologically (past to present)
  const sortByYear = (data: Array<{ year: number, value: number }> | undefined) => {
    if (!data || data.length === 0) return [];
    // Sort by year ascending (past to present)
    return [...data].sort((a, b) => a.year - b.year);
  };
  
  // Sort company's revenue data chronologically
  const sortedCompanyRevenue = sortByYear(companyData.incomeStatement.revenue);
  
  // Sort competitor's revenue data if available
  const sortedCompetitorRevenue = competitorData ? 
    sortByYear(competitorData.incomeStatement.revenue) : [];
    
  const revenueChartData = {
    labels: sortedCompanyRevenue.map(item => item.year.toString()),
    datasets: [
      {
        label: companyData.company.name,
        data: sortedCompanyRevenue.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [{
        label: competitorData.company.name,
        data: sortedCompetitorRevenue.map(item => item.value),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }] : [])
    ]
  };
  
  // Prepare chart data for profit margins
  // Sort margins data chronologically
  const sortedNetMargin = sortByYear(companyData.ratios?.netProfitMargin);
  const sortedGrossMargin = sortByYear(companyData.ratios?.grossProfitMargin);
  
  // Sort competitor margin data if available
  const sortedCompetitorNetMargin = competitorData ? 
    sortByYear(competitorData.ratios?.netProfitMargin) : [];
  const sortedCompetitorGrossMargin = competitorData ? 
    sortByYear(competitorData.ratios?.grossProfitMargin) : [];
  
  // Use net margin years for labels, or gross margin if net margin not available
  const marginYears = sortedNetMargin.length > 0 ? 
    sortedNetMargin.map(item => item.year.toString()) : 
    sortedGrossMargin.map(item => item.year.toString());
    
  const grossMarginChartData = {
    labels: marginYears,
    datasets: [
      {
        label: `${companyData.company.name} - Gross Margin`,
        data: sortedGrossMargin.map(item => item.value * 100),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      ...(sortedCompetitorGrossMargin.length > 0 ? [
        {
          label: `${competitorData?.company.name} - Gross Margin`,
          data: sortedCompetitorGrossMargin.map(item => item.value * 100),
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 2
        }
      ] : [])
    ]
  };

  const netMarginChartData = {
    labels: marginYears,
    datasets: [
      {
        label: `${companyData.company.name} - Net Margin`,
        data: sortedNetMargin.map(item => item.value * 100),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      ...(sortedCompetitorNetMargin.length > 0 ? [
        {
          label: `${competitorData?.company.name} - Net Margin`,
          data: sortedCompetitorNetMargin.map(item => item.value * 100),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        }
      ] : []),
    ]
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4 mb-8">
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 sm:mb-4 gap-2 xs:gap-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Revenue Comparison</h2>
        </div>
        <FinancialChart 
          chartData={revenueChartData} 
          chartType="bar"
          yAxisLabel="Revenue"
          tooltipPrefix="$"
          tooltipCallback={(value: number) => formatLargeNumber(value)}
          yAxisFormatType="currency"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 sm:mb-4 gap-2 xs:gap-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Gross Margins</h2>
          </div>
          <div style={{ height: '250px' }}>
            <FinancialChart
              chartData={grossMarginChartData}
              chartType="line"
              yAxisLabel="Percentage (%)"
              tooltipSuffix="%"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 sm:mb-4 gap-2 xs:gap-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Profit Margins</h2>
          </div>
          <div style={{ height: '250px' }}>
            <FinancialChart 
              chartData={netMarginChartData} 
              chartType="line"
              yAxisLabel="Percentage (%)"
              tooltipSuffix="%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialChartSection;