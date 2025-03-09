import { useState, useEffect } from 'react';
import { Search, BarChart4, PieChart, Info, TrendingUp, DollarSign, Percent, Loader2, FileText, Heart, Database, RefreshCw } from 'lucide-react';
import CompanySelector from './components/CompanySelector';
import CompetitorSelector from './components/CompetitorSelector';
import Overview from './components/Overview';
import BalanceSheet from './components/BalanceSheet';
import IncomeStatement from './components/IncomeStatement';
import CashFlow from './components/CashFlow';
import RatioAnalysis from './components/RatioAnalysis';
import ComparisonReport from './components/ComparisonReport';
import FinancialHealthDashboard from './components/FinancialHealthDashboard';
import DarkModeToggle from './components/DarkModeToggle';
import { Company, CompanyData } from './types';
import { mockCompanies } from './data/mockData';
import { getCompanyData } from './utils/dataFetcher';
import { FEATURES } from './utils/config';
import { apiCache, formatCacheTimestamp } from './utils/cacheUtils';

function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [competitorData, setCompetitorData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialLoading] = useState<boolean>(false);

  const handleCompanySelect = async (company: Company) => {
    setIsLoading(true);
    setSelectedCompany(company);
    
    try {
      // Get real or mock data based on config
      const data = await getCompanyData(company.symbol);
      setCompanyData(data);
      
      // Reset competitor when changing main company
      setSelectedCompetitor(null);
      setCompetitorData(null);
    } catch (error) {
      console.error('Error fetching company data:', error);
      // Handle error (could add error state here)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompetitorSelect = async (company: Company) => {
    setIsLoading(true);
    setSelectedCompetitor(company);
    
    try {
      // Get real or mock data based on config
      const data = await getCompanyData(company.symbol);
      setCompetitorData(data);
    } catch (error) {
      console.error('Error fetching competitor data:', error);
      // Handle error (could add error state here)
    } finally {
      setIsLoading(false);
    }
  };

  const [searchResults, setSearchResults] = useState<Array<{symbol: string, name: string, currency: string, stockExchange?: string, exchangeShortName?: string}>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // State for error messages
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // State for cache management
  const [showCacheInfo, setShowCacheInfo] = useState<boolean>(false);
  const [cacheStats, setCacheStats] = useState<{ count: number; sizeKB: number; oldestTimestamp: number | null }>({ 
    count: 0, 
    sizeKB: 0, 
    oldestTimestamp: null 
  });
  
  // Handle search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSearchError(null);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const { searchCompanies } = await import('./utils/apiService');
      const results = await searchCompanies(query);
      
      if (results.length === 0 && FEATURES.ENABLE_REAL_API) {
        setSearchError('No US stocks found. Free plan is limited to US stocks only.');
      }
      
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching companies:', error);
      setSearchError('Error searching companies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // State to store custom companies added via search
  const [customCompanies, setCustomCompanies] = useState<Company[]>([]);
  
  // Combined list of available companies (mockCompanies + customCompanies)
  // If there is a selected company, prioritize it to appear first
  const sortedCompanies = [...mockCompanies, ...customCompanies].sort((a, b) => {
    if (selectedCompany && a.id === selectedCompany.id) return -1;
    if (selectedCompany && b.id === selectedCompany.id) return 1;
    return 0; // maintain existing order for other companies
  });
  
  const availableCompanies = sortedCompanies;
  
  // Function to update cache stats
  const updateCacheStats = () => {
    const stats = apiCache.getStats();
    setCacheStats(stats);
  };
  
  // Effect to update cache stats periodically
  useEffect(() => {
    // Update cache stats initially
    updateCacheStats();
    
    // Update cache stats every 30 seconds
    const intervalId = setInterval(updateCacheStats, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle selecting a company from search results
  const handleSelectSearchResult = async (result: {symbol: string, name: string}) => {
    // Add click outside handler to close search results
    const closeSearchResults = () => {
      setShowSearchResults(false);
      document.removeEventListener('click', closeSearchResults);
    };
    document.addEventListener('click', closeSearchResults);
    
    // Check if company exists in availableCompanies first
    const existingCompany = availableCompanies.find(c => c.symbol === result.symbol);
    
    if (existingCompany) {
      handleCompanySelect(existingCompany);
    } else {
      // Create a new company object
      const company: Company = {
        id: result.symbol,
        name: result.name,
        symbol: result.symbol,
        industry: 'N/A', // This info isn't in search results
        logo: undefined
      };
      
      // Attempt to get company info (including logo) if using real API
      if (FEATURES.ENABLE_REAL_API) {
        try {
          const { getCompanyProfile } = await import('./utils/apiService');
          const profileData = await getCompanyProfile(result.symbol);
          
          if (profileData && profileData.length > 0) {
            const profile = profileData[0];
            company.industry = profile.industry || 'N/A';
            company.logo = profile.image;
          }
        } catch (error) {
          console.error('Error fetching company profile:', error);
        }
      }
      
      // Add to custom companies
      setCustomCompanies(prev => [...prev, company]);
      
      handleCompanySelect(company);
    }
    
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-dark-surface shadow-sm dark:shadow-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xs:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center">
              <BarChart4 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">FinCompare</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-full xs:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchResults(true);
                  }}
                  onBlur={() => {
                    // Small delay to allow button click to register before closing
                    setTimeout(() => {
                      setShowSearchResults(false);
                    }, 200);
                  }}
                  className="pl-10 pr-4 py-2 w-full xs:w-auto border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-surface dark:text-dark-text-primary"
                />
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute z-10 mt-1 w-64 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-md shadow-lg max-h-60 overflow-auto">
                    {isSearching ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-spin mr-2" />
                        <span className="text-sm text-gray-500 dark:text-dark-text-secondary">Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul>
                        {searchResults.map(result => (
                          <li key={result.symbol} className="border-b border-gray-100 dark:border-dark-border last:border-0">
                            <button
                              onClick={() => handleSelectSearchResult(result)}
                              className="flex items-center p-3 w-full hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                            >
                              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                                <span className="text-gray-500 dark:text-gray-400 font-semibold text-xs">{result.symbol.substring(0, 2)}</span>
                              </div>
                              <div className="ml-3 flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{result.name}</span>
                                <span className="text-xs text-gray-500 dark:text-dark-text-secondary">{result.symbol}</span>
                              </div>
                              {result.exchangeShortName && (
                                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                  {result.exchangeShortName}
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : searchQuery.length > 1 ? (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-dark-text-secondary">
                        {searchError || "No results found"}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Company Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CompanySelector 
            companies={availableCompanies} 
            selectedCompany={selectedCompany} 
            onSelectCompany={handleCompanySelect}
            isLoading={isLoading} 
          />
          <CompetitorSelector 
            companies={availableCompanies.filter(c => c.symbol !== selectedCompany?.symbol)} 
            selectedCompany={selectedCompetitor}
            mainCompany={selectedCompany}
            onSelectCompany={handleCompetitorSelect}
            disabled={!selectedCompany}
            isLoading={isLoading}
          />
        </div>

        {/* Content Area */}
        {initialLoading ? (
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-8 text-center">
            <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[350px]">
              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Loading FinCompare</h2>
              <p className="text-gray-600 dark:text-dark-text-secondary text-sm sm:text-base max-w-sm sm:max-w-2xl mx-auto">
                Preparing financial data comparison tools...
              </p>
            </div>
          </div>
        ) : selectedCompany ? (
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-dark-border">
              <nav className="flex -mb-px overflow-x-auto py-1 px-2 sm:px-0 md:py-0">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary hover:border-gray-300 dark:hover:border-gray-700'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <Info className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('balance-sheet')}
                  className={`py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'balance-sheet'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary hover:border-gray-300 dark:hover:border-gray-700'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <PieChart className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                    Balance Sheet
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('income-statement')}
                  className={`py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'income-statement'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary hover:border-gray-300 dark:hover:border-gray-700'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <DollarSign className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                    Income Statement
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('cash-flow')}
                  className={`py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'cash-flow'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary hover:border-gray-300 dark:hover:border-gray-700'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <TrendingUp className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                    Cash Flow
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('ratio-analysis')}
                  className={`py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'ratio-analysis'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary hover:border-gray-300 dark:hover:border-gray-700'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <Percent className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                    Ratio Analysis
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('financial-health')}
                  className={`py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'financial-health'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary hover:border-gray-300 dark:hover:border-gray-700'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <Heart className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                    Financial Health
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('report')}
                  className={`py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'report'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary hover:border-gray-300 dark:hover:border-gray-700'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <FileText className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                    Summary Report
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[250px] sm:h-[400px]">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-dark-text-secondary text-sm sm:text-base">Loading financial data...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'overview' && (
                    <Overview 
                      companyData={companyData} 
                      competitorData={competitorData} 
                    />
                  )}
                  {activeTab === 'balance-sheet' && (
                    <BalanceSheet 
                      companyData={companyData} 
                      competitorData={competitorData} 
                    />
                  )}
                  {activeTab === 'income-statement' && (
                    <IncomeStatement 
                      companyData={companyData} 
                      competitorData={competitorData} 
                    />
                  )}
                  {activeTab === 'cash-flow' && (
                    <CashFlow 
                      companyData={companyData} 
                      competitorData={competitorData} 
                    />
                  )}
                  {activeTab === 'ratio-analysis' && (
                    <RatioAnalysis 
                      companyData={companyData} 
                      competitorData={competitorData} 
                    />
                  )}
                  {activeTab === 'financial-health' && companyData && (
                    <FinancialHealthDashboard
                      company={companyData}
                      competitors={competitorData ? [competitorData] : undefined}
                    />
                  )}
                  {activeTab === 'report' && companyData && (
                    <ComparisonReport 
                      companyData={companyData} 
                      competitorData={competitorData} 
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-8 text-center">
            <BarChart4 className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Welcome to FinCompare</h2>
            <p className="text-gray-600 dark:text-dark-text-secondary text-sm sm:text-base max-w-sm sm:max-w-2xl mx-auto">
              Select a company to begin analyzing financial data and comparing with competitors.
              Make informed investment decisions with comprehensive financial analysis.
            </p>
          </div>
        )}
      </main>
      
      {/* Footer with API Status */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          {/* Cache Management UI */}
          {FEATURES.ENABLE_REAL_API && (
            <div className="flex flex-col mb-3 sm:mb-0">
              <div className="flex items-center cursor-pointer" onClick={() => setShowCacheInfo(!showCacheInfo)}>
                <Database className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-1" />
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  API Cache ({cacheStats.count} items, {cacheStats.sizeKB} KB)
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Clear all cached API data? This will force fresh API calls.')) {
                      apiCache.clear();
                      updateCacheStats();
                    }
                  }}
                  className="ml-2 p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Clear Cache"
                >
                  <RefreshCw className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              {showCacheInfo && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs">
                  <p className="mb-1 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Items:</span> {cacheStats.count} 
                    <span className="mx-2">|</span>
                    <span className="font-semibold">Size:</span> {cacheStats.sizeKB} KB
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Oldest Item:</span> {formatCacheTimestamp(cacheStats.oldestTimestamp)}
                  </p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 italic">
                    Financial data is cached in your browser to minimize API calls and avoid rate limits
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* API Status */}
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            Data source: 
            <span className="ml-1 px-2 py-1 rounded text-xs font-medium inline-flex items-center" 
                  style={{ 
                    backgroundColor: FEATURES.ENABLE_REAL_API ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: FEATURES.ENABLE_REAL_API ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
                  }}>
              <span className="w-2 h-2 rounded-full mr-1"
                    style={{ 
                      backgroundColor: FEATURES.ENABLE_REAL_API ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
                    }}></span>
              {FEATURES.ENABLE_REAL_API ? 'FinancialModelingPrep API' : 'Mock Data'}
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;