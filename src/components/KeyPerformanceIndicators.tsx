import React from 'react';
import { DollarSign, TrendingUp, BarChart4, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { CompanyData } from '../types';
import { formatPercentage } from '../utils/formatters';

interface KeyPerformanceIndicatorsProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
  revenueGrowth: number;
  netIncomeGrowth: number;
  epsGrowth: number;
  competitorRevenueGrowth: number | null;
  competitorNetIncomeGrowth: number | null;
  competitorEpsGrowth: number | null;
}

const KeyPerformanceIndicators: React.FC<KeyPerformanceIndicatorsProps> = ({
  companyData,
  competitorData,
  revenueGrowth,
  netIncomeGrowth,
  epsGrowth,
  competitorRevenueGrowth,
  competitorNetIncomeGrowth,
  competitorEpsGrowth
}) => {
  const getPerformanceIndicator = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-6 sm:mb-8">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">
        Key Performance Indicators ({companyData.company.symbol})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {/* Revenue Growth */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center mb-1 sm:mb-2">
            <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400 mr-1 sm:mr-2" />
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text-primary">Revenue Growth</h3>
          </div>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mr-1 sm:mr-2">
              {formatPercentage(revenueGrowth)}
            </span>
            {getPerformanceIndicator(revenueGrowth)}
          </div>
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">Year-over-year</p>
          {competitorData && competitorRevenueGrowth !== null && (
            <div className="mt-2 text-xs border-t border-gray-200 dark:border-gray-700 pt-1">
              <span className="text-gray-600 dark:text-gray-400">{competitorData.company.symbol}: </span>
              <span className={`font-medium ${competitorRevenueGrowth > revenueGrowth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(competitorRevenueGrowth)}
              </span>
            </div>
          )}
        </div>
        
        {/* Net Income Growth */}
        <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center mb-1 sm:mb-2">
            <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-green-600 dark:text-green-400 mr-1 sm:mr-2" />
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text-primary">Net Income Growth</h3>
          </div>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mr-1 sm:mr-2">
              {formatPercentage(netIncomeGrowth)}
            </span>
            {getPerformanceIndicator(netIncomeGrowth)}
          </div>
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">Year-over-year</p>
          {competitorData && competitorNetIncomeGrowth !== null && (
            <div className="mt-2 text-xs border-t border-gray-200 dark:border-gray-700 pt-1">
              <span className="text-gray-600 dark:text-gray-400">{competitorData.company.symbol}: </span>
              <span className={`font-medium ${competitorNetIncomeGrowth > netIncomeGrowth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(competitorNetIncomeGrowth)}
              </span>
            </div>
          )}
        </div>
        
        {/* EPS Growth */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center mb-1 sm:mb-2">
            <BarChart4 className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 dark:text-purple-400 mr-1 sm:mr-2" />
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text-primary">EPS Growth</h3>
          </div>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mr-1 sm:mr-2">
              {formatPercentage(epsGrowth)}
            </span>
            {getPerformanceIndicator(epsGrowth)}
          </div>
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">Year-over-year</p>
          {competitorData && competitorEpsGrowth !== null && (
            <div className="mt-2 text-xs border-t border-gray-200 dark:border-gray-700 pt-1">
              <span className="text-gray-600 dark:text-gray-400">{competitorData.company.symbol}: </span>
              <span className={`font-medium ${competitorEpsGrowth > epsGrowth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(competitorEpsGrowth)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyPerformanceIndicators;