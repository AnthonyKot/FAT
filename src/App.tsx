import { useState, useEffect } from 'react';
import { Search, BarChart4, PieChart, Info, TrendingUp, DollarSign, Percent, Loader2, FileText } from 'lucide-react';
import CompanySelector from './components/CompanySelector';
import CompetitorSelector from './components/CompetitorSelector';
import Overview from './components/Overview';
import BalanceSheet from './components/BalanceSheet';
import IncomeStatement from './components/IncomeStatement';
import CashFlow from './components/CashFlow';
import RatioAnalysis from './components/RatioAnalysis';
import ComparisonReport from './components/ComparisonReport';
import DarkModeToggle from './components/DarkModeToggle';
import { Company, CompanyData } from './types';
import { mockCompanies } from './data/mockData';
import { getCompanyData } from './utils/dataFetcher';
import { FEATURES } from './utils/config';

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
                  className="pl-10 pr-4 py-2 w-full xs:w-auto border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-surface dark:text-dark-text-primary"
                />
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
            companies={mockCompanies} 
            selectedCompany={selectedCompany} 
            onSelectCompany={handleCompanySelect}
            isLoading={isLoading} 
          />
          <CompetitorSelector 
            companies={mockCompanies.filter(c => c.symbol !== selectedCompany?.symbol)} 
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
        <div className="flex justify-end items-center">
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