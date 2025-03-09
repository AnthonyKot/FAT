import React from 'react';
import { CompanyData } from '../types';
import ReportButton from './ReportButton';
import CompanyOverview from './CompanyOverview';
import KeyMetricsComparison from './KeyMetricsComparison';
import FinancialChartSection from './FinancialChartSection';
import ValuationCharts from './ValuationCharts';
import FinancialPerformance from './FinancialPerformance';
import FinancialRatioComparison from './FinancialRatioComparison';
import AnalysisSummary from './AnalysisSummary';

interface ComparisonReportProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const ComparisonReport: React.FC<ComparisonReportProps> = ({ companyData, competitorData }) => {
  return (
    <div id="comparison-report" className="bg-white dark:bg-dark-surface rounded-lg shadow-lg dark:shadow-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">
          {competitorData 
            ? `Financial Comparison: ${companyData.company.name} vs ${competitorData.company.name}` 
            : `Financial Analysis: ${companyData.company.name}`}
        </h1>
        <ReportButton
          companyData={companyData}
          competitorData={competitorData}
          targetElementId="comparison-report"
          type="fullReport"
          buttonText="Download PDF Report"
        />
      </div>

      {/* Company Overview */}
      <CompanyOverview 
        companyData={companyData} 
        competitorData={competitorData} 
      />

      {/* Key Financial Metrics */}
      <KeyMetricsComparison 
        companyData={companyData} 
        competitorData={competitorData} 
      />

      {/* Financial Charts */}
      <FinancialChartSection 
        companyData={companyData} 
        competitorData={competitorData} 
      />

      {/* Valuation Ratios */}
      <ValuationCharts 
        companyData={companyData} 
        competitorData={competitorData} 
      />
      
      {/* Financial Performance */}
      <FinancialPerformance 
        companyData={companyData} 
        competitorData={competitorData} 
      />

      {/* Financial Ratios */}
      <FinancialRatioComparison 
        companyData={companyData} 
        competitorData={competitorData} 
      />

      {/* Analysis Summary */}
      <AnalysisSummary 
        companyData={companyData} 
        competitorData={competitorData} 
      />
    </div>
  );
};

export default ComparisonReport;