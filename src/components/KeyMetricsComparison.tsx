import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import FinancialChart from './FinancialChart';
import ReportButton from './ReportButton';

interface KeyMetricsComparisonProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const KeyMetricsComparison: React.FC<KeyMetricsComparisonProps> = ({ companyData, competitorData }) => {
  // Prepare data for key metrics comparison chart
  const prepareMetricsChart = () => {
    const getLatestValue = (data: any[]) => data[data.length - 1]?.value ?? 0;
    
    const metrics = [
      { key: 'Revenue', value1: getLatestValue(companyData.incomeStatement.revenue), value2: competitorData ? getLatestValue(competitorData.incomeStatement.revenue) : 0 },
      { key: 'Net Income', value1: getLatestValue(companyData.incomeStatement.netIncome), value2: competitorData ? getLatestValue(competitorData.incomeStatement.netIncome) : 0 },
      { key: 'EBITDA', value1: getLatestValue(companyData.incomeStatement.ebitda), value2: competitorData ? getLatestValue(competitorData.incomeStatement.ebitda) : 0 },
      { key: 'Total Assets', value1: getLatestValue(companyData.balanceSheet.totalAssets), value2: competitorData ? getLatestValue(competitorData.balanceSheet.totalAssets) : 0 },
      { key: 'Total Liabilities', value1: getLatestValue(companyData.balanceSheet.totalLiabilities), value2: competitorData ? getLatestValue(competitorData.balanceSheet.totalLiabilities) : 0 }
    ];
    
    // Scale values to make the chart more readable (e.g., millions)
    const scaleValues = (values: number[]) => {
      const max = Math.max(...values);
      if (max > 1_000_000_000) {
        return values.map(v => v / 1_000_000_000);
      } else if (max > 1_000_000) {
        return values.map(v => v / 1_000_000);
      } else if (max > 1_000) {
        return values.map(v => v / 1_000);
      }
      return values;
    };
    
    const values = metrics.map(m => m.value1);
    if (competitorData) {
      values.push(...metrics.map(m => m.value2));
    }
    
    const scaledValues = scaleValues(values);
    
    return {
      labels: metrics.map(m => m.key),
      datasets: [
        {
          label: companyData.company.name,
          data: metrics.map((m, i) => scaledValues[i]),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        ...(competitorData ? [{
          label: competitorData.company.name,
          data: metrics.map((m, i) => scaledValues[i + metrics.length]),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }] : [])
      ]
    };
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">Key Financial Metrics</h2>
        <ReportButton
          companyData={companyData}
          competitorData={competitorData}
          targetElementId="key-metrics-chart"
          type="chartOnly"
        />
      </div>
      
      <div id="key-metrics-chart" className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <FinancialChart
          chartData={prepareMetricsChart()}
          chartType="bar"
          title="Key Financial Metrics"
          termKey="revenue"
          description="Comparison of key financial metrics between the companies. Values are shown in billions or millions for readability."
          yAxisFormatType="currency"
        />
      </div>
    </div>
  );
};

export default KeyMetricsComparison;