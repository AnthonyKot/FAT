import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Minus, DollarSign, TrendingUp, BarChart4, PieChart } from 'lucide-react';
import { CompanyData, FinancialData } from '../types';
import { formatCurrency, formatPercentage, formatLargeNumber } from '../utils/formatters';
import CompanyMetrics from './CompanyMetrics';
import FinancialChart from './FinancialChart';
import StockPriceChart from './StockPriceChart';

interface OverviewProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const Overview: React.FC<OverviewProps> = ({ companyData, competitorData }) => {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  
  if (!companyData) return null;
  
  const getPerformanceIndicator = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };
  
  // Calculate year-over-year growth for key metrics with safety checks
  const calculateGrowth = (data: Array<{year: number, value: number}> | undefined): number => {
    if (!data || data.length < 2) return 0;
    
    // Sort by year descending to ensure we get the latest years
    const sortedData = [...data].sort((a, b) => b.year - a.year);
    const currentValue = sortedData[0]?.value;
    const previousValue = sortedData[1]?.value;
    
    // Safety check for division by zero or negative values
    if (!previousValue || previousValue === 0) return 0;
    
    return (currentValue - previousValue) / Math.abs(previousValue);
  };
  
  // Use the safe growth calculation
  const revenueGrowth = calculateGrowth(companyData.incomeStatement.revenue);
  const netIncomeGrowth = calculateGrowth(companyData.incomeStatement.netIncome);
  const epsGrowth = calculateGrowth(companyData.incomeStatement.eps);
  
  // Prepare chart data for revenue comparison - sorted chronologically (past to present)
  const prepareChronologicalData = (data: Array<{year: number, value: number}> | undefined) => {
    if (!data || data.length === 0) return [];
    // Sort by year ascending (past to present)
    return [...data].sort((a, b) => a.year - b.year);
  };
  
  // Sort company's revenue data chronologically
  const sortedCompanyRevenue = prepareChronologicalData(companyData.incomeStatement.revenue);
  
  // Sort competitor's revenue data if available
  const sortedCompetitorRevenue = competitorData ? 
    prepareChronologicalData(competitorData.incomeStatement.revenue) : [];
    
  const revenueChartData = {
    labels: sortedCompanyRevenue.map(item => item.year.toString()),
    datasets: [
      {
        label: companyData.company.name,
        data: sortedCompanyRevenue.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [{
        label: competitorData.company.name,
        data: sortedCompetitorRevenue.map(item => item.value),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }] : [])
    ]
  };
  
  // Prepare chart data for profit margins
  // Sort margins data chronologically
  const sortedNetMargin = prepareChronologicalData(companyData.ratios?.netProfitMargin);
  const sortedGrossMargin = prepareChronologicalData(companyData.ratios?.grossProfitMargin);
  
  // Sort competitor margin data if available
  const sortedCompetitorNetMargin = competitorData ? 
    prepareChronologicalData(competitorData.ratios?.netProfitMargin) : [];
  const sortedCompetitorGrossMargin = competitorData ? 
    prepareChronologicalData(competitorData.ratios?.grossProfitMargin) : [];
  
  // Use net margin years for labels, or gross margin if net margin not available
  const marginYears = sortedNetMargin.length > 0 ? 
    sortedNetMargin.map(item => item.year.toString()) : 
    sortedGrossMargin.map(item => item.year.toString());
    
  const profitMarginChartData = {
    labels: marginYears,
    datasets: [
      {
        label: `${companyData.company.name} - Net Margin`,
        data: sortedNetMargin.map(item => item.value * 100),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: `${companyData.company.name} - Gross Margin`,
        data: sortedGrossMargin.map(item => item.value * 100),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      ...(sortedCompetitorNetMargin.length > 0 ? [
        {
          label: `${competitorData?.company.name} - Net Margin`,
          data: sortedCompetitorNetMargin.map(item => item.value * 100),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        }
      ] : []),
      ...(sortedCompetitorGrossMargin.length > 0 ? [
        {
          label: `${competitorData?.company.name} - Gross Margin`,
          data: sortedCompetitorGrossMargin.map(item => item.value * 100),
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 2
        }
      ] : [])
    ]
  };
  
  // Prepare chart data for key ratios
  const getLatestRatioValue = (ratioArray?: FinancialData[]) => {
    if (!ratioArray || ratioArray.length === 0) return 0;
    
    // Sort by year and get the latest
    const sortedData = [...ratioArray].sort((a, b) => b.year - a.year);
    return sortedData[0].value;
  };
  
  // Prepare ratio data for each year in chronological order
  const prepareRatioChartData = () => {
    // Combine all ratio types to find all unique years
    const allPeRatios = prepareChronologicalData(companyData.ratios?.peRatio);
    const allPbRatios = prepareChronologicalData(companyData.ratios?.pbRatio);
    const allPsRatios = prepareChronologicalData(companyData.ratios?.psRatio);
    const allEvToEbitda = prepareChronologicalData(companyData.ratios?.evToEbitda);
    
    // For competitor data if available
    const compPeRatios = competitorData ? prepareChronologicalData(competitorData.ratios?.peRatio) : [];
    const compPbRatios = competitorData ? prepareChronologicalData(competitorData.ratios?.pbRatio) : [];
    const compPsRatios = competitorData ? prepareChronologicalData(competitorData.ratios?.psRatio) : [];
    const compEvToEbitda = competitorData ? prepareChronologicalData(competitorData.ratios?.evToEbitda) : [];
    
    // For a specific ratio type like P/E, use values by year
    return {
      'P/E Ratio': {
        company: allPeRatios.map(r => r.value),
        competitor: compPeRatios.map(r => r.value),
        years: allPeRatios.map(r => r.year.toString())
      },
      'P/B Ratio': {
        company: allPbRatios.map(r => r.value),
        competitor: compPbRatios.map(r => r.value),
        years: allPbRatios.map(r => r.year.toString())
      },
      'P/S Ratio': {
        company: allPsRatios.map(r => r.value),
        competitor: compPsRatios.map(r => r.value),
        years: allPsRatios.map(r => r.year.toString())
      },
      'EV/EBITDA': {
        company: allEvToEbitda.map(r => r.value),
        competitor: compEvToEbitda.map(r => r.value),
        years: allEvToEbitda.map(r => r.year.toString())
      }
    };
  };
  
  // For the key ratios bar chart, we'll use the traditional approach with latest values
  const keyRatiosChartData = {
    labels: ['P/E Ratio', 'P/B Ratio', 'P/S Ratio', 'EV/EBITDA'],
    datasets: [
      {
        label: companyData.company.name,
        data: [
          getLatestRatioValue(companyData.ratios?.peRatio),
          getLatestRatioValue(companyData.ratios?.pbRatio),
          getLatestRatioValue(companyData.ratios?.psRatio),
          getLatestRatioValue(companyData.ratios?.evToEbitda)
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      ...(competitorData ? [{
        label: competitorData.company.name,
        data: [
          getLatestRatioValue(competitorData.ratios?.peRatio),
          getLatestRatioValue(competitorData.ratios?.pbRatio),
          getLatestRatioValue(competitorData.ratios?.psRatio),
          getLatestRatioValue(competitorData.ratios?.evToEbitda)
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }] : [])
    ]
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-1 sm:mb-2 truncate">{companyData.company.name} ({companyData.company.symbol})</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">{companyData.company.industry}</p>
      </div>
      
      {/* Company Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <CompanyMetrics 
          companyData={companyData} 
          title="Company Metrics"
        />
        {competitorData && (
          <CompanyMetrics 
            companyData={competitorData} 
            title="Competitor Metrics"
          />
        )}
      </div>
      
      {/* Stock Price Chart */}
      <StockPriceChart 
        companyData={companyData}
        competitorData={competitorData}
      />
      
      {/* Key Performance Indicators */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center mb-1 sm:mb-2">
              <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400 mr-1 sm:mr-2" />
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text-primary">Revenue Growth</h3>
            </div>
            <div className="flex items-center">
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mr-1 sm:mr-2">{formatPercentage(revenueGrowth)}</span>
              {getPerformanceIndicator(revenueGrowth)}
            </div>
            <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">Year-over-year</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center mb-1 sm:mb-2">
              <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-green-600 dark:text-green-400 mr-1 sm:mr-2" />
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text-primary">Net Income Growth</h3>
            </div>
            <div className="flex items-center">
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mr-1 sm:mr-2">{formatPercentage(netIncomeGrowth)}</span>
              {getPerformanceIndicator(netIncomeGrowth)}
            </div>
            <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">Year-over-year</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center mb-1 sm:mb-2">
              <BarChart4 className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 dark:text-purple-400 mr-1 sm:mr-2" />
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text-primary">EPS Growth</h3>
            </div>
            <div className="flex items-center">
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mr-1 sm:mr-2">{formatPercentage(epsGrowth)}</span>
              {getPerformanceIndicator(epsGrowth)}
            </div>
            <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">Year-over-year</p>
          </div>
        </div>
      </div>
      
      {/* Financial Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 sm:mb-4 gap-2 xs:gap-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Revenue Comparison</h2>
            <div className="flex gap-1 sm:gap-2">
              <button 
                onClick={() => setTimeframe('1Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '1Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                1Y
              </button>
              <button 
                onClick={() => setTimeframe('3Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '3Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                3Y
              </button>
              <button 
                onClick={() => setTimeframe('5Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '5Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                5Y
              </button>
            </div>
          </div>
          <FinancialChart 
            chartData={revenueChartData} 
            chartType="bar"
            yAxisLabel="Revenue ($)"
            tooltipPrefix="$"
            tooltipCallback={(value: number) => formatLargeNumber(value)}
          />
        </div>
        
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 sm:mb-4 gap-2 xs:gap-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Profit Margins</h2>
            <div className="flex gap-1 sm:gap-2">
              <button 
                onClick={() => setTimeframe('1Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '1Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                1Y
              </button>
              <button 
                onClick={() => setTimeframe('3Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '3Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                3Y
              </button>
              <button 
                onClick={() => setTimeframe('5Y')} 
                className={`px-2 py-1 text-xs rounded ${timeframe === '5Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                5Y
              </button>
            </div>
          </div>
          <FinancialChart 
            chartData={profitMarginChartData} 
            chartType="line"
            yAxisLabel="Percentage (%)"
            tooltipSuffix="%"
          />
        </div>
      </div>
      
      {/* Valuation Ratios */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">Valuation Ratios</h2>
        
        {/* Grid of individual ratio charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* P/E Ratio Chart */}
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">P/E Ratio</h3>
            <FinancialChart 
              chartData={{
                labels: prepareChronologicalData(companyData.ratios?.peRatio).map(item => item.year.toString()),
                datasets: [
                  {
                    label: companyData.company.name,
                    data: prepareChronologicalData(companyData.ratios?.peRatio).map(item => item.value),
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2
                  },
                  ...(competitorData && competitorData.ratios?.peRatio ? [{
                    label: competitorData.company.name,
                    data: prepareChronologicalData(competitorData.ratios?.peRatio).map(item => item.value),
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2
                  }] : [])
                ]
              }} 
              chartType="bar"
              yAxisLabel="Ratio Value"
              description="Price to Earnings Ratio: Lower means potentially undervalued"
              termKey="peRatio"
            />
          </div>
          
          {/* P/B Ratio Chart */}
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">P/B Ratio</h3>
            <FinancialChart 
              chartData={{
                labels: prepareChronologicalData(companyData.ratios?.pbRatio).map(item => item.year.toString()),
                datasets: [
                  {
                    label: companyData.company.name,
                    data: prepareChronologicalData(companyData.ratios?.pbRatio).map(item => item.value),
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2
                  },
                  ...(competitorData && competitorData.ratios?.pbRatio ? [{
                    label: competitorData.company.name,
                    data: prepareChronologicalData(competitorData.ratios?.pbRatio).map(item => item.value),
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2
                  }] : [])
                ]
              }} 
              chartType="bar"
              yAxisLabel="Ratio Value"
              description="Price to Book Ratio: Compares market value to book value"
              termKey="pbRatio"
            />
          </div>
          
          {/* P/S Ratio Chart */}
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">P/S Ratio</h3>
            <FinancialChart 
              chartData={{
                labels: prepareChronologicalData(companyData.ratios?.psRatio).map(item => item.year.toString()),
                datasets: [
                  {
                    label: companyData.company.name,
                    data: prepareChronologicalData(companyData.ratios?.psRatio).map(item => item.value),
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2
                  },
                  ...(competitorData && competitorData.ratios?.psRatio ? [{
                    label: competitorData.company.name,
                    data: prepareChronologicalData(competitorData.ratios?.psRatio).map(item => item.value),
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2
                  }] : [])
                ]
              }} 
              chartType="bar"
              yAxisLabel="Ratio Value"
              description="Price to Sales Ratio: Useful for companies without earnings"
              termKey="psRatio"
            />
          </div>
          
          {/* EV/EBITDA Chart */}
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">EV/EBITDA</h3>
            <FinancialChart 
              chartData={{
                labels: prepareChronologicalData(companyData.ratios?.evToEbitda).map(item => item.year.toString()),
                datasets: [
                  {
                    label: companyData.company.name,
                    data: prepareChronologicalData(companyData.ratios?.evToEbitda).map(item => item.value),
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2
                  },
                  ...(competitorData && competitorData.ratios?.evToEbitda ? [{
                    label: competitorData.company.name,
                    data: prepareChronologicalData(competitorData.ratios?.evToEbitda).map(item => item.value),
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2
                  }] : [])
                ]
              }} 
              chartType="bar"
              yAxisLabel="Ratio Value"
              description="Enterprise Value to EBITDA: More capital structure neutral"
              termKey="evToEbitda"
            />
          </div>
        </div>
      </div>
      
      {/* Analysis Summary */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">Analysis Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="border border-gray-200 dark:border-dark-border rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2 sm:mb-3">
              <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400 mr-1 sm:mr-2" />
              <h3 className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Valuation</h3>
            </div>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">P/E Ratio</span>
                <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.peRatio).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">P/B Ratio</span>
                <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.pbRatio).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">P/S Ratio</span>
                <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.psRatio).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">EV/EBITDA</span>
                <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.evToEbitda).toFixed(2)}</span>
              </li>
            </ul>
          </div>
          
          <div className="border border-gray-200 dark:border-dark-border rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2 sm:mb-3">
              <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-green-600 dark:text-green-400 mr-1 sm:mr-2" />
              <h3 className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Profitability</h3>
            </div>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">ROE</span>
                <span className="font-medium dark:text-dark-text-primary">{formatPercentage(getLatestRatioValue(companyData.ratios?.returnOnEquity))}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">ROA</span>
                <span className="font-medium dark:text-dark-text-primary">{formatPercentage(getLatestRatioValue(companyData.ratios?.returnOnAssets))}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Net Margin</span>
                <span className="font-medium dark:text-dark-text-primary">{formatPercentage(getLatestRatioValue(companyData.ratios?.netProfitMargin))}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Gross Margin</span>
                <span className="font-medium dark:text-dark-text-primary">{formatPercentage(getLatestRatioValue(companyData.ratios?.grossProfitMargin))}</span>
              </li>
            </ul>
          </div>
          
          <div className="border border-gray-200 dark:border-dark-border rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2 sm:mb-3">
              <PieChart className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 dark:text-purple-400 mr-1 sm:mr-2" />
              <h3 className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Financial Health</h3>
            </div>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Debt to Equity</span>
                <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.debtToEquity).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Current Ratio</span>
                <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.currentRatio).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Quick Ratio</span>
                <span className="font-medium dark:text-dark-text-primary">{getLatestRatioValue(companyData.ratios?.quickRatio).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Beta</span>
                <span className="font-medium dark:text-dark-text-primary">{(companyData.beta || 0).toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;