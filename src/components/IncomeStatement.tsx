import React from 'react';
import { CompanyData } from '../types';
import IncomeStatementCharts from './IncomeStatementCharts';
import IncomeStatementTable from './IncomeStatementTable';

interface IncomeStatementProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const IncomeStatement: React.FC<IncomeStatementProps> = ({ companyData, competitorData }) => {  
  if (!companyData) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Income Statement Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare income statement items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>
      
      {/* Charts */}
      <IncomeStatementCharts companyData={companyData} competitorData={competitorData} />
      
      {/* Income Statement Table */}
      <IncomeStatementTable companyData={companyData} competitorData={competitorData} />
    </div>
  );
};

export default IncomeStatement;