import React from 'react';
import { CompanyData } from '../types';
import FinancialChart from './FinancialChart';

interface ValuationChartsProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const ValuationCharts: React.FC<ValuationChartsProps> = ({ companyData, competitorData }) => {
  // Helper function to sort data chronologically (past to present)
  const sortByYear = (data: Array<{ year: number, value: number }> | undefined) => {
    if (!data || data.length === 0) return [];
    // Sort by year ascending (past to present)
    return [...data].sort((a, b) => a.year - b.year);
  };

  // Replace negative big abs values by minus average 
  const averagingNegative = (data: Array<{ year: number, value: number }> | undefined) => {
    if (!data || data.length === 0) return [];
    const sum = data.reduce((acc, val) => acc + Math.abs(val.value), 0);
    const average = sum / data.length;
    return data.map(item => item.value < -average ? -average : item.value);
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-6 sm:mb-8">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">Valuation Ratios</h2>

      {/* P/E Ratio Chart */}
      <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">P/E Ratio</h3>
        <FinancialChart
          chartData={{
            labels: sortByYear(companyData.ratios?.peRatio).map(item => item.year.toString()),
            datasets: [
              {
                label: companyData.company.name,
                data: averagingNegative(sortByYear(companyData.ratios?.peRatio)),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2
              },
              ...(competitorData && competitorData.ratios?.peRatio ? [{
                label: competitorData.company.name,
                data: averagingNegative(sortByYear(competitorData.ratios?.peRatio)),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2
              }] : [])
            ]
          }}
          chartType="bar"
          yAxisLabel="Ratio Value"
          description="Price to Earnings Ratio: Lower means potentially undervalued"
          termKey="peRatio"
        />
      </div>

      {/* Grid of individual ratio charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* P/B Ratio Chart */}
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">P/B Ratio</h3>
          <FinancialChart 
            chartData={{
              labels: sortByYear(companyData.ratios?.pbRatio).map(item => item.year.toString()),
              datasets: [
                {
                  label: companyData.company.name,
                  data: sortByYear(companyData.ratios?.pbRatio).map(item => item.value),
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 2
                },
                ...(competitorData && competitorData.ratios?.pbRatio ? [{
                  label: competitorData.company.name,
                  data: sortByYear(competitorData.ratios?.pbRatio).map(item => item.value),
                  backgroundColor: 'rgba(239, 68, 68, 0.5)',
                  borderColor: 'rgb(239, 68, 68)',
                  borderWidth: 2
                }] : [])
              ]
            }} 
            chartType="bar"
            yAxisLabel="Ratio Value"
            description="Price to Book Ratio: Compares market value to book value"
            termKey="pbRatio"
          />
        </div>
        
        {/* P/S Ratio Chart */}
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">P/S Ratio</h3>
          <FinancialChart 
            chartData={{
              labels: sortByYear(companyData.ratios?.psRatio).map(item => item.year.toString()),
              datasets: [
                {
                  label: companyData.company.name,
                  data: sortByYear(companyData.ratios?.psRatio).map(item => item.value),
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 2
                },
                ...(competitorData && competitorData.ratios?.psRatio ? [{
                  label: competitorData.company.name,
                  data: sortByYear(competitorData.ratios?.psRatio).map(item => item.value),
                  backgroundColor: 'rgba(239, 68, 68, 0.5)',
                  borderColor: 'rgb(239, 68, 68)',
                  borderWidth: 2
                }] : [])
              ]
            }} 
            chartType="bar"
            yAxisLabel="Ratio Value"
            description="Price to Sales Ratio: Useful for companies without earnings"
            termKey="psRatio"
          />
        </div>
      </div>

      {/* EV/EBITDA Chart */}
      <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">EV/EBITDA</h3>
        <FinancialChart
          chartData={{
            labels: sortByYear(companyData.ratios?.evToEbitda).map(item => item.year.toString()),
            datasets: [
              {
                label: companyData.company.name,
                data: sortByYear(companyData.ratios?.evToEbitda).map(item => item.value),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2
              },
              ...(competitorData && competitorData.ratios?.evToEbitda ? [{
                label: competitorData.company.name,
                data: sortByYear(competitorData.ratios?.evToEbitda).map(item => item.value),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2
              }] : [])
            ]
          }}
          chartType="bar"
          yAxisLabel="Ratio Value"
          description="Enterprise Value to EBITDA: More capital structure neutral"
          termKey="evToEbitda"
        />
      </div>
    </div>
  );
};

export default ValuationCharts;