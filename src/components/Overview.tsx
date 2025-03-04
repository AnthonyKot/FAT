import React from 'react';
import { ArrowUp, ArrowDown, Minus, DollarSign, TrendingUp, BarChart4, PieChart } from 'lucide-react';
import { CompanyData, FinancialData } from '../types';
import { formatPercentage, formatLargeNumber } from '../utils/formatters';
import CompanyMetrics from './CompanyMetrics';
import StockPriceChart from './StockPriceChart';

interface OverviewProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const Overview: React.FC<OverviewProps> = ({ companyData, competitorData }) => {
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

  // Prepare chart data for key ratios
  const getLatestRatioValue = (ratioArray?: FinancialData[]) => {
    if (!ratioArray || ratioArray.length === 0) return 0;

    // Sort by year and get the latest
    const sortedData = [...ratioArray].sort((a, b) => b.year - a.year);
    return sortedData[0].value;
  };

  return (
    <div>
      {/* Stock Price Chart */}
      <StockPriceChart
        companyData={companyData}
        competitorData={competitorData}
      />

      {/* Company Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="p-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-1 sm:mb-2 truncate">{companyData.company.name} ({companyData.company.symbol})</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">{companyData.company.industry}</p>
          </div>
        <CompanyMetrics 
          companyData={companyData} 
          title="Company Metrics"
        />
        </div>
        {competitorData && (
          <div className="p-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-1 sm:mb-2 truncate">{competitorData.company.name} ({competitorData.company.symbol})</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">{competitorData.company.industry}</p>
            </div>
          <CompanyMetrics 
            companyData={competitorData} 
            title="Competitor Metrics"
          />
          </div>
        )}
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">Key Performance Indicators ({companyData.company.symbol})</h2>
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

      {/* Analysis Summary */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-4">Analysis Summary ({companyData.company.symbol})</h2>
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

      {/* Analysis Summary */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Ratio Analysis Summary</h2>
        <div className="prose max-w-none text-gray-600 dark:text-dark-text-secondary">
          <p>
            This ratio analysis helps in assessing {companyData.company.name}'s financial performance
            {competitorData ? ` compared to ${competitorData.company.name}` : ''} across multiple dimensions:
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Valuation:</strong> {companyData.company.name}'s P/E ratio of {companyData.ratios.peRatio[0].value.toFixed(2)} indicates
              {competitorData ? (companyData.ratios.peRatio[0].value < competitorData.ratios.peRatio[0].value ?
                ' a more attractive valuation compared to its competitor.' :
                ' a potentially overvalued position relative to its competitor.') :
                ' how the market currently values its earnings.'}
            </li>
            <li>
              <strong>Profitability:</strong> With a net profit margin of {formatPercentage(companyData.ratios.netProfitMargin[0].value)},
              the company {competitorData ?
                (companyData.ratios.netProfitMargin[0].value > competitorData.ratios.netProfitMargin[0].value ?
                  'demonstrates stronger profitability than its competitor.' :
                  'shows lower profitability compared to its competitor.') :
                'demonstrates its efficiency in converting revenue into actual profit.'}
            </li>
            <li>
              <strong>Growth:</strong> The company's revenue is growing at {formatPercentage(companyData.ratios.revenueGrowth[0].value)} annually,
              which is {competitorData ?
                (companyData.ratios.revenueGrowth[0].value > competitorData.ratios.revenueGrowth[0].value ?
                  'faster than its competitor.' :
                  'slower than its competitor.') :
                'an indicator of its market expansion capabilities.'}
            </li>
            <li>
              <strong>Risk:</strong> With a debt-to-equity ratio of {companyData.ratios.debtToEquity[0].value.toFixed(2)},
              the company {competitorData ?
                (companyData.ratios.debtToEquity[0].value < competitorData.ratios.debtToEquity[0].value ?
                  'carries less debt relative to its equity compared to its competitor, indicating lower financial risk.' :
                  'carries more debt relative to its equity compared to its competitor, suggesting higher financial risk.') :
                'has this level of debt relative to its equity.'}
            </li>
          </ul>
          <p className="mt-4">
            {competitorData ?
              `Overall, when comparing ${companyData.company.name} to ${competitorData.company.name}, the analysis suggests that ` +
              (
                (companyData.ratios.peRatio[0].value < competitorData.ratios.peRatio[0].value) &&
                  (companyData.ratios.netProfitMargin[0].value > competitorData.ratios.netProfitMargin[0].value) ?
                  `${companyData.company.name} may represent a more attractive investment opportunity with better valuation and higher profitability.` :
                  `investors should carefully weigh the trade-offs between valuation, growth, profitability, and risk when making investment decisions.`
              ) :
              `This ratio analysis provides a comprehensive view of ${companyData.company.name}'s financial health and performance. To gain further insights, consider comparing these metrics with industry averages and competitors.`
            }
          </p>
        </div>
      </div>

      {/* Cash Flow Key Highlights */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Key Financial Indicators ({companyData.company.symbol})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Operating Cash Flow YoY Change */}
          {(() => {
            const latestOCF = companyData.cashFlow.operatingCashFlow[0];
            const prevOCF = companyData.cashFlow.operatingCashFlow[1];
            const changePercent = ((latestOCF.value - prevOCF.value) / Math.abs(prevOCF.value) * 100);
            const isPositive = changePercent > 0;

            return (
              <div className={`rounded-lg p-4 ${isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} flex flex-col`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Operating Cash Flow</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${isPositive ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{formatLargeNumber(latestOCF.value)}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                  vs {formatLargeNumber(prevOCF.value)} ({prevOCF.year})
                </p>
              </div>
            );
          })()}

          {/* Free Cash Flow YoY Change */}
          {(() => {
            const latestFCF = companyData.cashFlow.freeCashFlow[0];
            const prevFCF = companyData.cashFlow.freeCashFlow[1];
            const changePercent = ((latestFCF.value - prevFCF.value) / Math.abs(prevFCF.value) * 100);
            const isPositive = changePercent > 0;

            return (
              <div className={`rounded-lg p-4 ${isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} flex flex-col`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Free Cash Flow</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${isPositive ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{formatLargeNumber(latestFCF.value)}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                  vs {formatLargeNumber(prevFCF.value)} ({prevFCF.year})
                </p>
              </div>
            );
          })()}

          {/* Cash Flow Margin */}
          {(() => {
            const latestOCF = companyData.cashFlow.operatingCashFlow[0];
            const latestRevenue = companyData.incomeStatement.revenue[0];
            const prevOCF = companyData.cashFlow.operatingCashFlow[1];
            const prevRevenue = companyData.incomeStatement.revenue[1];

            const currentMargin = (latestOCF.value / latestRevenue.value * 100);
            const prevMargin = (prevOCF.value / prevRevenue.value * 100);
            const changePercent = currentMargin - prevMargin;
            const isPositive = changePercent > 0;

            return (
              <div className={`rounded-lg p-4 ${isPositive ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} flex flex-col`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Cash Flow Margin</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${isPositive ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}pp
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{currentMargin.toFixed(1)}%</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                  vs {prevMargin.toFixed(1)}% ({prevOCF.year})
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Overview;