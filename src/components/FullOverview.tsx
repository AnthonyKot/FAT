import React, { useState } from 'react';
import { CompanyData, FinancialData } from '../types';
import { formatPercentage } from '../utils/formatters';
import StockPriceHistory from './StockPriceHistory';
import MetricsSection from './MetricsSection';
import KeyPerformanceIndicators from './KeyPerformanceIndicators';
import FinancialMetrics from './FinancialMetrics';
import RatioAnalysisSummary from './RatioAnalysisSummary';
import KeyFinancialIndicators from './KeyFinancialIndicators';
import WidgetImportanceRanking from './WidgetImportanceRanking';
import { useAIRecommendations } from '../utils/useAIRecommendations';
import { FEATURES } from '../utils/config';

interface OverviewProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

const FullOverview: React.FC<OverviewProps> = ({ companyData, competitorData }) => {
  if (!companyData) return null;
  
  // State for widget ranking debug view
  const [showDebug, setShowDebug] = useState(false);
  
  // State to store combined recommendations from all metric types
  const [combinedRecommendations, setCombinedRecommendations] = useState<any>(null);
  const [isLoadingAllMetrics, setIsLoadingAllMetrics] = useState<boolean>(false);
  const [allMetricsError, setAllMetricsError] = useState<string | null>(null);
  
  // Get recommendations for financial health metrics (as the default view)
  // Use the hook with skipInitialFetch=true to prevent automatic API call
  const { 
    recommendations: financialHealthRecs, 
    loading: loadingFinancialHealth, 
    error: errorFinancialHealth,
    refreshRecommendations: refreshFinancialHealth 
  } = useAIRecommendations({
    companyTicker: companyData.company.symbol,
    companyName: companyData.company.name,
    industry: companyData.company.industry,
    competitors: competitorData ? [competitorData.company.symbol] : undefined,
    metricType: 'financialHealth',
    skipInitialFetch: true // Don't fetch automatically
  });
  
  // Function to fetch recommendations for all metric types and combine them
  const fetchAllMetricRecommendations = async () => {
    setIsLoadingAllMetrics(true);
    setAllMetricsError(null);
    
    try {
      // Get all metric types from MetricCategory enum
      const metricTypes = [
        'financialHealth',
        'operationalEfficiency',
        'investorValue',
        'researchInnovation'
      ];
      
      // Import needed functions and data
      const { getMetricRecommendations } = await import('../utils/aiService');
      const { METRIC_CATEGORIES } = await import('../utils/config');
      
      // Create a single comprehensive request with all metrics
      const allMetrics = [];
      
      // Collect metrics from all categories without duplicates
      const addedMetrics = new Set(); // Track metrics to avoid duplicates
      
      for (const metricType of metricTypes) {
        const metrics = METRIC_CATEGORIES[metricType];
        
        // Debug log to verify we're getting different metrics for each category
        if (FEATURES.LOG_GEMINI_API) {
          console.log(`Metrics for ${metricType}: ${metrics.length} items`);
          console.log(`First few metrics: ${metrics.slice(0, 3).join(', ')}`);
        }
        
        // Add unique metrics to our collection
        metrics.forEach(metric => {
          const metricStr = metric.toString();
          if (!addedMetrics.has(metricStr)) {
            addedMetrics.add(metricStr);
            allMetrics.push(metric);
          }
        });
      }
      
      if (FEATURES.LOG_GEMINI_API) {
        console.log(`Total unique metrics collected: ${allMetrics.length}`);
      }
      
      // Create a single request with all unique metrics
      const request = {
        companyTicker: companyData.company.symbol,
        companyName: companyData.company.name,
        industry: companyData.company.industry,
        competitors: competitorData ? [competitorData.company.symbol] : undefined,
        metrics: allMetrics
      };
      
      // Make a single API call with all metrics
      const result = await getMetricRecommendations(request);
      
      // Create combined recommendations object using the single result
      const combined = {
        scoredMetrics: result.scoredMetrics || [],
        topMetrics: result.scoredMetrics
          ? result.scoredMetrics.sort((a, b) => b.score - a.score).slice(0, 10).map(m => m.metric)
          : []
      };
      
      setCombinedRecommendations(combined);
    } catch (error) {
      if (FEATURES.LOG_GEMINI_API) {
        console.error('Error fetching all metric recommendations:', error);
      }
      setAllMetricsError('Failed to fetch recommendations for all metrics');
    } finally {
      setIsLoadingAllMetrics(false);
    }
  };
  
  // Use the recommendations from either combined or financial health
  const recommendations = combinedRecommendations || financialHealthRecs;
  const loading = isLoadingAllMetrics || loadingFinancialHealth;
  const error = allMetricsError || errorFinancialHealth;
  
  // Function to refresh recommendations - either all metrics or just financial health
  const refreshRecommendations = () => {
    if (combinedRecommendations) {
      fetchAllMetricRecommendations();
    } else {
      refreshFinancialHealth();
    }
  };
  
  // Calculate helpers moved to separate components
  
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
  
  // Use the safe growth calculation for primary company
  const revenueGrowth = calculateGrowth(companyData.incomeStatement.revenue);
  const netIncomeGrowth = calculateGrowth(companyData.incomeStatement.netIncome);
  const epsGrowth = calculateGrowth(companyData.incomeStatement.eps);
  
  // Calculate growth metrics for competitor if available
  const competitorRevenueGrowth = competitorData ? calculateGrowth(competitorData.incomeStatement.revenue) : null;
  const competitorNetIncomeGrowth = competitorData ? calculateGrowth(competitorData.incomeStatement.netIncome) : null;
  const competitorEpsGrowth = competitorData ? calculateGrowth(competitorData.incomeStatement.eps) : null;

  // Prepare chart data for key ratios
  const getLatestRatioValue = (ratioArray?: FinancialData[]) => {
    if (!ratioArray || ratioArray.length === 0) return 0;

    // Sort by year and get the latest
    const sortedData = [...ratioArray].sort((a, b) => b.year - a.year);
    return sortedData[0].value;
  };

  return (
    <div>
      {/* Stock Price History */}
      <StockPriceHistory
        companyData={companyData}
        competitorData={competitorData}
      />

      {/* Company and Competitor Metrics */}
      <MetricsSection 
        companyData={companyData}
        competitorData={competitorData}
      />

      {/* Key Performance Indicators */}
      <KeyPerformanceIndicators 
        companyData={companyData}
        competitorData={competitorData}
        revenueGrowth={revenueGrowth}
        netIncomeGrowth={netIncomeGrowth}
        epsGrowth={epsGrowth}
        competitorRevenueGrowth={competitorRevenueGrowth}
        competitorNetIncomeGrowth={competitorNetIncomeGrowth}
        competitorEpsGrowth={competitorEpsGrowth}
      />

      {/* Financial Metrics */}
      <FinancialMetrics 
        companyData={companyData}
        getLatestRatioValue={getLatestRatioValue}
      />

      {/* Ratio Analysis Summary */}
      <RatioAnalysisSummary 
        companyData={companyData}
        competitorData={competitorData}
      />

      {/* Key Financial Indicators */}
      <KeyFinancialIndicators 
        companyData={companyData}
        competitorData={competitorData}
      />
      
      {/* Rank Metrics Button & Debug Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            AI Metric Analysis
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md text-sm"
            >
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            
            <button 
              onClick={() => {
                // Always fetch all metrics when button is clicked on Overview page
                fetchAllMetricRecommendations();
                alert('Ranking ALL metrics across ALL categories. This might take a moment...');
              }}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md text-sm font-medium"
              disabled={loading}
            >
              {loading ? 'Ranking...' : '🧠 Rank Metrics'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-300 rounded-lg">
            Error: {error}
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Click the "Rank Metrics" button to analyze all financial metrics and get AI-powered recommendations on 
          which widgets are most relevant for {companyData.company.name}
          {competitorData ? ` compared to ${competitorData.company.name}` : ''}.
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">
          Note: This will make an API call to analyze metrics across all categories (Financial Health, Operational Efficiency, Investor Value, and Research & Innovation).
        </p>
        
        {recommendations && (
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Analysis completed.</strong> AI has analyzed all metrics and ranked widgets by relevance.
          </div>
        )}
      </div>
      
      {/* Widget Importance Ranking */}
      {recommendations && (
        <WidgetImportanceRanking 
          scoredMetrics={recommendations.scoredMetrics} 
          showDebug={showDebug}
        />
      )}
    </div>
  );
};

export default Overview;