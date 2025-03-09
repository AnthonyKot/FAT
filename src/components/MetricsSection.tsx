import React from 'react';
import { CompanyData } from '../types';
import CompanyMetrics from './CompanyMetrics';

interface MetricsSectionProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ 
  companyData, 
  competitorData 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="p-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-1 sm:mb-2 truncate">
            {companyData.company.name} ({companyData.company.symbol})
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">
            {companyData.company.industry}
          </p>
        </div>
        <CompanyMetrics 
          companyData={companyData} 
          title="Company Metrics"
        />
      </div>
      
      {competitorData && (
        <div className="p-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-1 sm:mb-2 truncate">
              {competitorData.company.name} ({competitorData.company.symbol})
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">
              {competitorData.company.industry}
            </p>
          </div>
          <CompanyMetrics 
            companyData={competitorData} 
            title="Competitor Metrics"
          />
        </div>
      )}
    </div>
  );
};

export default MetricsSection;