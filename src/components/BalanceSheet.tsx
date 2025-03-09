import React, { useState } from 'react';
import { CompanyData } from '../types';
import BalanceSheetCharts from './BalanceSheetCharts';
import BalanceSheetTable from './BalanceSheetTable';

interface BalanceSheetProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ companyData, competitorData }) => {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  
  if (!companyData) return null;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Balance Sheet Analysis</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary">Compare balance sheet items between {companyData.company.name} {competitorData ? `and ${competitorData.company.name}` : ''}</p>
      </div>
      
      {/* Charts */}
      <BalanceSheetCharts 
        companyData={companyData} 
        competitorData={competitorData} 
      />
      
      {/* Balance Sheet Table */}
      <BalanceSheetTable 
        companyData={companyData} 
        competitorData={competitorData} 
      />
    </div>
  );
};

export default BalanceSheet;