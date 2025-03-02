import React from 'react';
import { CompanyData } from '../types';
import { formatCurrency, formatLargeNumber, formatPercentage, formatNumber } from '../utils/formatters';

interface CompanyMetricsProps {
  companyData: CompanyData;
  title: string;
}

const CompanyMetrics: React.FC<CompanyMetricsProps> = ({ companyData, title }) => {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Market Cap</h3>
          <p className="text-lg font-semibold dark:text-dark-text-primary">{formatLargeNumber(companyData.marketCap)}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Current Price</h3>
          <p className="text-lg font-semibold dark:text-dark-text-primary">{formatCurrency(companyData.currentPrice)}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">52-Week High</h3>
          <p className="text-lg font-semibold dark:text-dark-text-primary">{formatCurrency(companyData.yearHigh)}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">52-Week Low</h3>
          <p className="text-lg font-semibold dark:text-dark-text-primary">{formatCurrency(companyData.yearLow)}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Dividend Yield</h3>
          <p className="text-lg font-semibold dark:text-dark-text-primary">{formatPercentage(companyData.dividendYield)}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Beta</h3>
          <p className="text-lg font-semibold dark:text-dark-text-primary">
            {formatNumber(companyData.beta)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyMetrics;