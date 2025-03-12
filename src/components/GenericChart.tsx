import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import FinancialChart from './FinancialChart';

interface GenericChartProps {
  title: string;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  chartType: "line" | "bar";
  yAxisLabel: string;
  tooltipPrefix?: string;
  tooltipCallback?: (value: number) => string;
  termKey: string;
  description: string;
  colorScheme: string;
  competitorData?: CompanyData;
}

const GenericChart: React.FC<GenericChartProps> = ({ title, chartData, chartType, yAxisLabel, tooltipPrefix, tooltipCallback, termKey, description, colorScheme, competitorData }) => {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
        <FinancialChart
          chartData={chartData}
          chartType={chartType}
          yAxisLabel={yAxisLabel}
          tooltipPrefix={tooltipPrefix}
          tooltipCallback={tooltipCallback}
          title={title}
          termKey={termKey}
          description={description}
          colorScheme={colorScheme}
        />
      </div>
    );
};

export default GenericChart;
