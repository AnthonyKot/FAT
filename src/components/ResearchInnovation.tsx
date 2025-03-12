import React from 'react';
import { Lightbulb, Cog, TrendingUp } from 'lucide-react';
import { CompanyData, FinancialData } from '../types';
import { formatPercentage } from '../utils/formatters';

interface ResearchInnovationProps {
  companyData: CompanyData;
  getLatestRatioValue: (ratioArray?: FinancialData[]) => number;
  showInOverview?: boolean; // Whether to show this in the Overview page
}

const ResearchInnovation: React.FC<ResearchInnovationProps> = ({ 
  companyData,
  getLatestRatioValue,
  showInOverview = true // Default to showing
}) => {
  // Get available metrics or use fallbacks
  const rdToRevenue = companyData.operationalMetrics?.rdToRevenue || [];
  const capexToRevenue = companyData.operationalMetrics?.capexToOperatingCash || [];
  
  if (!showInOverview) {
    return null;
  }
  
  return (
    <div id="researchMetrics" className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mt-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">
        Research & Innovation Metrics ({companyData.company.symbol})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* R&D Metrics */}
        <div className="border border-gray-200 dark:border-dark-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center mb-2 sm:mb-3">
            <Lightbulb className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600 dark:text-amber-400 mr-1 sm:mr-2" />
            <h3 className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Research & Development</h3>
          </div>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">R&D to Revenue</span>
              <span className="font-medium dark:text-dark-text-primary">
                {formatPercentage(getLatestRatioValue(rdToRevenue))}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">R&D Growth Rate</span>
              <span className="font-medium dark:text-dark-text-primary">
                {formatPercentage(rdToRevenue.length > 1 ? 
                  (rdToRevenue[0].value - rdToRevenue[1].value) / Math.abs(rdToRevenue[1].value) : 0)}
              </span>
            </li>
          </ul>
        </div>

        {/* Capital Expenditure Metrics */}
        <div className="border border-gray-200 dark:border-dark-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center mb-2 sm:mb-3">
            <Cog className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400 mr-1 sm:mr-2" />
            <h3 className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Capital Expenditure</h3>
          </div>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">CapEx to Revenue</span>
              <span className="font-medium dark:text-dark-text-primary">
                {formatPercentage(getLatestRatioValue(companyData.operationalMetrics?.capexToRevenue))}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-text-secondary">CapEx to Operating Cash</span>
              <span className="font-medium dark:text-dark-text-primary">
                {formatPercentage(getLatestRatioValue(capexToRevenue))}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResearchInnovation;