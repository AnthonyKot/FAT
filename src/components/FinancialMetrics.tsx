import React from 'react';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { CompanyData, FinancialData } from '../types';
import { formatPercentage } from '../utils/formatters';

interface FinancialMetricsProps {
  companyData: CompanyData;
  getLatestRatioValue: (ratioArray?: FinancialData[]) => number;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ 
  companyData,
  getLatestRatioValue
}) => {
  return (
    <div id="financialMetrics" className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">
        Analysis Summary ({companyData.company.symbol})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Valuation Metrics */}
        <div className="border border-gray-200 dark:border-dark-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center mb-2 sm:mb-3">
            <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400 mr-1 sm:mr-2" />
            <h3 className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Valuation</h3>
          </div>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">P/E Ratio</span>
              <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.peRatio).toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">P/B Ratio</span>
              <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.pbRatio).toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">P/S Ratio</span>
              <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.psRatio).toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">EV/EBITDA</span>
              <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.evToEbitda).toFixed(2)}</span>
            </li>
          </ul>
        </div>

        {/* Profitability Metrics */}
        <div className="border border-gray-200 dark:border-dark-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center mb-2 sm:mb-3">
            <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-green-600 dark:text-green-400 mr-1 sm:mr-2" />
            <h3 className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Profitability</h3>
          </div>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">ROE</span>
              <span className="font-medium dark:text-dark-text-primary">{formatPercentage(getLatestRatioValue(companyData.ratios?.returnOnEquity))}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">ROA</span>
              <span className="font-medium dark:text-dark-text-primary">{formatPercentage(getLatestRatioValue(companyData.ratios?.returnOnAssets))}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Net Margin</span>
              <span className="font-medium dark:text-dark-text-primary">{formatPercentage(getLatestRatioValue(companyData.ratios?.netProfitMargin))}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Gross Margin</span>
              <span className="font-medium dark:text-dark-text-primary">{formatPercentage(getLatestRatioValue(companyData.ratios?.grossProfitMargin))}</span>
            </li>
          </ul>
        </div>

        {/* Financial Health Metrics */}
        <div className="border border-gray-200 dark:border-dark-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center mb-2 sm:mb-3">
            <PieChart className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 dark:text-purple-400 mr-1 sm:mr-2" />
            <h3 className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Financial Health</h3>
          </div>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Debt to Equity</span>
              <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.debtToEquity).toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Current Ratio</span>
              <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.currentRatio).toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Quick Ratio</span>
              <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.quickRatio).toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Beta</span>
              <span className="font-medium dark:text-dark-text-primary">{(companyData.beta || 0).toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetrics;