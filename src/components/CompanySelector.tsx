import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Company } from '../types';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  isLoading?: boolean;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ 
  companies, 
  selectedCompany, 
  onSelectCompany,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Detect changes in companies array
  useEffect(() => {
    // Reset search term when companies list changes or a company is selected
    setSearchTerm('');
  }, [companies.length, selectedCompany?.id]);
  
  // First filter companies based on search term
  const filteredBySearch = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort the filtered companies: selected company first, then alphabetically
  const filteredCompanies = filteredBySearch.sort((a, b) => {
    // If a is the selected company, it should come first
    if (selectedCompany && a.id === selectedCompany.id) return -1;
    // If b is the selected company, it should come first
    if (selectedCompany && b.id === selectedCompany.id) return 1;
    // Otherwise sort alphabetically by company name
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={`bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow dark:shadow-gray-800 ${isLoading ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-dark-text-primary">Select Company</h2>
        {isLoading && <Loader2 className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-spin" />}
      </div>
      
      <div className="relative mb-3 sm:mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base w-full border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLoading ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        />
      </div>
      
      <div className="max-h-48 sm:max-h-60 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-40">
            <Loader2 className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500 dark:text-blue-400 animate-spin" />
          </div>
        ) : filteredCompanies.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-dark-border">
            {filteredCompanies.map(company => (
              <li key={company.id} className="animate-fadeIn">
                <button
                  onClick={() => onSelectCompany(company)}
                  className={`w-full flex items-center p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md ${
                    selectedCompany?.id === company.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    {company.logo ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 font-semibold text-xs sm:text-sm">{company.symbol.substring(0, 2)}</span>
                    )}
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1 flex flex-col overflow-hidden">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-dark-text-primary truncate">{company.name}</span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-secondary">{company.symbol}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-dark-text-secondary hidden sm:block truncate max-w-[100px]">{company.industry}</div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-dark-text-secondary text-sm">No companies found</div>
        )}
      </div>
    </div>
  );
};

export default CompanySelector;