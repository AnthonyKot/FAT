import React from 'react';
import { CompanyData } from '../types';
import { formatCurrencyAbbreviated, formatPercentage } from '../utils/formatters';

interface CompanyOverviewProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const CompanyOverview: React.FC<CompanyOverviewProps> = ({ companyData, competitorData }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Company Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400 mb-2">{companyData.company.name}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Industry:</span>
              <span className="font-medium dark:text-dark-text-primary">{companyData.company.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Market Cap:</span>
              <span className="font-medium dark:text-dark-text-primary">{formatCurrencyAbbreviated(companyData.marketCap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Current Price:</span>
              <span className="font-medium dark:text-dark-text-primary">${companyData.currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">52-Week Range:</span>
              <span className="font-medium dark:text-dark-text-primary">${companyData.yearLow.toFixed(2)} - ${companyData.yearHigh.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Dividend Yield:</span>
              <span className="font-medium dark:text-dark-text-primary">{formatPercentage(companyData.dividendYield)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">Beta:</span>
              <span className="font-medium dark:text-dark-text-primary">{companyData.beta.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {competitorData && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">{competitorData.company.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Industry:</span>
                <span className="font-medium dark:text-dark-text-primary">{competitorData.company.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Market Cap:</span>
                <span className="font-medium dark:text-dark-text-primary">{formatCurrencyAbbreviated(competitorData.marketCap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Current Price:</span>
                <span className="font-medium dark:text-dark-text-primary">${competitorData.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">52-Week Range:</span>
                <span className="font-medium dark:text-dark-text-primary">${competitorData.yearLow.toFixed(2)} - ${competitorData.yearHigh.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Dividend Yield:</span>
                <span className="font-medium dark:text-dark-text-primary">{formatPercentage(competitorData.dividendYield)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Beta:</span>
                <span className="font-medium dark:text-dark-text-primary">{competitorData.beta.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyOverview;