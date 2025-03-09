import React from 'react';
import { CompanyData } from '../types';
import Sparkline from './Sparkline';
import CashFlowCharts from './CashFlowCharts';
import CashFlowAnalysis from './CashFlowAnalysis';
import CashFlowTable from './CashFlowTable';

interface CashFlowProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const CashFlow: React.FC<CashFlowProps> = ({ companyData, competitorData }) => {
  if (!companyData) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Cash Flow Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare cash flow items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>

      {/* Charts */}
      <CashFlowCharts companyData={companyData} competitorData={competitorData} />

      {/* Cash Flow Analysis */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Cash Flow Analysis</h2>
      <CashFlowAnalysis companyData={companyData} />

      {/* Cash Flow Table */}
      <CashFlowTable companyData={companyData} competitorData={competitorData} />
    </div>
  );
};

export default CashFlow;