import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Company } from '../types';

interface CompetitorSelectorProps {
  companies: Company[];
  selectedCompany: Company | null;
  mainCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  disabled: boolean;
  isLoading?: boolean;
}

const CompetitorSelector: React.FC<CompetitorSelectorProps> = ({ 
  companies, 
  selectedCompany, 
  mainCompany,
  onSelectCompany,
  disabled,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
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
    <div className={`bg-white dark:bg-dark-surface p-6 rounded-lg shadow dark:shadow-gray-800 ${disabled ? 'opacity-70' : ''} ${isLoading ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">
          {mainCompany ? `Compare ${mainCompany.name} with` : 'Select Competitor'}
        </h2>
        {isLoading && <Loader2 className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-spin" />}
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search competitors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled || isLoading}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed dark:bg-dark-surface dark:text-dark-text-primary"
        />
      </div>
      
      {disabled ? (
        <div className="text-center py-8 text-gray-500 dark:text-dark-text-secondary">
          Select a company first to enable competitor selection
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-spin" />
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {filteredCompanies.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-dark-border">
              {filteredCompanies.map(company => (
                <li key={company.id} className="animate-fadeIn">
                  <button
                    onClick={() => onSelectCompany(company)}
                    className={`w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md ${
                      selectedCompany?.id === company.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={isLoading}
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                      {company.logo ? (
                        <div className="w-6 h-6 flex items-center justify-center">
                          <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 font-semibold">{company.symbol.substring(0, 2)}</span>
                      )}
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{company.name}</span>
                      <span className="text-sm text-gray-500 dark:text-dark-text-secondary">{company.symbol}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-dark-text-secondary">{company.industry}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-dark-text-secondary">No competitors found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompetitorSelector;