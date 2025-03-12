import React from 'react';
import { CompanyData, FinancialData } from '../types';

interface RowConfig {
  label: string;
  dataKey: string;
  isHeader?: boolean;
  isBold?: boolean;
}

interface SectionConfig {
  title?: string; // Optional section header
  rows: RowConfig[];
}

interface FinancialDataTableProps {
  companyData: CompanyData;
  competitorData?: CompanyData | null;
  years?: number; // Number of years to display, default 3
  sections: SectionConfig[];
  formatter?: (value: number) => string; // Optional custom formatter
  statementType: 'balanceSheet' | 'incomeStatement' | 'cashFlow';
}

/**
 * A reusable financial data table component that can be used for income statement,
 * balance sheet, and cash flow tables with consistent styling and formatting.
 */
const FinancialDataTable: React.FC<FinancialDataTableProps> = ({
  companyData,
  competitorData,
  years = 3,
  sections,
  formatter = (value) => `$${Math.round(value / 1000000).toLocaleString()}M`,
  statementType
}) => {
  // Get years data from the first available data series for consistency
  let yearsData: FinancialData[] = [];
  
  // Find the first non-empty data array to use for year headers
  const firstDataKey = sections[0]?.rows[0]?.dataKey;
  if (firstDataKey && companyData[statementType][firstDataKey]) {
    yearsData = [...companyData[statementType][firstDataKey]].sort((a, b) => b.year - a.year).slice(0, years);
  }
  
  if (yearsData.length === 0) return null;
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Item
            </th>
            {yearsData.map(item => (
              <th key={item.year} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {item.year}
              </th>
            ))}
            {competitorData && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700">
                {competitorData.company.symbol} (Latest)
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {sections.map((section, sectionIndex) => (
            <React.Fragment key={`section-${sectionIndex}`}>
              {/* Optional section header */}
              {section.title && (
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td colSpan={years + (competitorData ? 2 : 1)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {section.title}
                  </td>
                </tr>
              )}
              
              {/* Section rows */}
              {section.rows.map((row, rowIndex) => {
                // Skip rows that don't have data
                const rowData = companyData[statementType][row.dataKey];
                if (!rowData || rowData.length === 0) return null;
                
                // Sort data by year (newest first) and get the requested number of years
                const sortedData = [...rowData].sort((a, b) => b.year - a.year).slice(0, years);
                
                // Get competitor data if available
                let competitorValue = null;
                if (competitorData && competitorData[statementType][row.dataKey] && competitorData[statementType][row.dataKey].length > 0) {
                  const competitorData2 = [...competitorData[statementType][row.dataKey]].sort((a, b) => b.year - a.year);
                  competitorValue = competitorData2[0]?.value;
                }
                
                return (
                  <tr 
                    key={`row-${sectionIndex}-${rowIndex}`}
                    className={row.isHeader ? "bg-gray-50 dark:bg-gray-800" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {row.label}
                    </td>
                    
                    {/* Year values */}
                    {yearsData.map(yearItem => {
                      const dataForYear = sortedData.find(item => item.year === yearItem.year);
                      const value = dataForYear?.value || 0;
                      
                      return (
                        <td 
                          key={yearItem.year} 
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 ${row.isBold ? 'font-bold' : ''}`}
                        >
                          {formatter(value)}
                        </td>
                      );
                    })}
                    
                    {/* Competitor value if available */}
                    {competitorData && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                        {competitorValue !== null ? formatter(competitorValue) : '-'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialDataTable;