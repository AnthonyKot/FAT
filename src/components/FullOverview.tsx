import React, { useState, useRef } from 'react';
import { CompanyData, FinancialData } from '../types';
import { formatPercentage } from '../utils/formatters';
import StockPriceHistory from './StockPriceHistory';
import MetricsSection from './MetricsSection';
import KeyPerformanceIndicators from './KeyPerformanceIndicators';
import FinancialMetrics from './FinancialMetrics';
import RatioAnalysisSummary from './RatioAnalysisSummary';
import KeyFinancialIndicators from './KeyFinancialIndicators';
import ResearchInnovation from './ResearchInnovation';
import WidgetImportanceRanking from './WidgetImportanceRanking';
import { useAIRecommendations } from '../utils/useAIRecommendations';
import { FEATURES } from '../utils/config';
import { COMPONENT_METRICS_MAP, calculateOverallImportance } from '../utils/metricUtils';

interface FullOverviewProps {
  companyData: CompanyData | null;
  competitorData: CompanyData | null;
}

/**
 * Enhanced Overview component that shows top widgets based on AI ranking
 */
const FullOverview: React.FC<FullOverviewProps> = ({ companyData, competitorData }) => {
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
      
      // Calculate importance scores for each component/widget
      if (combined.scoredMetrics.length > 0) {
        // Calculate scores for each component
        const componentScores = Object.entries(COMPONENT_METRICS_MAP).map(([key, config]) => {
          const score = calculateOverallImportance(config.metrics, combined.scoredMetrics);
          return {
            id: key,
            displayName: config.displayName,
            category: config.category,
            score
          };
        });
        
        // Sort by score (highest first)
        const sortedComponents = [...componentScores].sort((a, b) => b.score - a.score);
        
        // Get the top 3 widgets
        const top3Widgets = sortedComponents.slice(0, 3).map(component => component.id);
        
        if (FEATURES.LOG_GEMINI_API) {
          console.log('Top 3 widgets:', top3Widgets);
        }
        
        // Update state with top widgets
        setTopWidgets(top3Widgets);
        setHasRankedWidgets(true);
      }
      
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
  
  // Create references for all widget components for scrolling
  const widgetRefs = {
    stockPriceChart: useRef<HTMLDivElement>(null),
    keyPerformanceIndicators: useRef<HTMLDivElement>(null),
    financialMetrics: useRef<HTMLDivElement>(null),
    ratioAnalysis: useRef<HTMLDivElement>(null),
    keyFinancialIndicators: useRef<HTMLDivElement>(null),
    researchMetrics: useRef<HTMLDivElement>(null),
    metricsSection: useRef<HTMLDivElement>(null)
  };
  
  // State for tracking top widgets
  const [topWidgets, setTopWidgets] = useState<string[]>([]);
  const [hasRankedWidgets, setHasRankedWidgets] = useState<boolean>(false);
  
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
  
  // Function to scroll to a widget when clicked
  const scrollToWidget = (widgetId: string) => {
    const ref = widgetRefs[widgetId as keyof typeof widgetRefs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Top Widgets Section - shows only after ranking */}
      {hasRankedWidgets && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Top 3 Most Important Widgets for {companyData.company.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Based on AI analysis, these widgets are the most relevant for analyzing {companyData.company.name}.
            Click on a widget to jump to it.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {topWidgets.map((widgetId) => {
              const widget = COMPONENT_METRICS_MAP[widgetId];
              if (!widget) return null;
              
              return (
                <div 
                  key={widgetId}
                  onClick={() => scrollToWidget(widgetId)}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    {widget.displayName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Category: {widget.category}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Click to jump to this widget
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            All widgets are still available below. The top widgets are highlighted for your convenience.
          </div>
        </div>
      )}
      
      {/* Stock Price History */}
      <div 
        ref={widgetRefs.stockPriceChart}
        className={`${topWidgets.includes('stockPriceChart') ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded-lg' : ''} mb-6`}
      >
        <StockPriceHistory
          companyData={companyData}
          competitorData={competitorData}
        />
      </div>

      {/* Company and Competitor Metrics */}
      <div 
        ref={widgetRefs.metricsSection}
        className={`${topWidgets.includes('metricsSection') ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded-lg' : ''} mb-6`}
      >
        <MetricsSection 
          companyData={companyData}
          competitorData={competitorData}
        />
      </div>

      {/* Key Performance Indicators */}
      <div 
        ref={widgetRefs.keyPerformanceIndicators}
        className={`${topWidgets.includes('keyPerformanceIndicators') ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded-lg' : ''} mb-6`}
      >
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
      </div>

      {/* Financial Metrics */}
      <div 
        ref={widgetRefs.financialMetrics}
        className={`${topWidgets.includes('financialMetrics') ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded-lg' : ''} mb-6`}
      >
        <FinancialMetrics 
          companyData={companyData}
          getLatestRatioValue={getLatestRatioValue}
        />
      </div>

      {/* Ratio Analysis Summary */}
      <div 
        ref={widgetRefs.ratioAnalysis}
        className={`${topWidgets.includes('ratioAnalysis') ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded-lg' : ''} mb-6`}
      >
        <RatioAnalysisSummary 
          companyData={companyData}
          competitorData={competitorData}
        />
      </div>

      {/* Key Financial Indicators */}
      <div 
        ref={widgetRefs.keyFinancialIndicators}
        className={`${topWidgets.includes('keyFinancialIndicators') ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded-lg' : ''} mb-6`}
      >
        <KeyFinancialIndicators 
          companyData={companyData}
          competitorData={competitorData}
        />
      </div>
      
      {/* Research & Innovation */}
      <div 
        ref={widgetRefs.researchMetrics}
        className={`${topWidgets.includes('researchMetrics') ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded-lg' : ''} mb-6`}
      >
        <ResearchInnovation 
          companyData={companyData}
          getLatestRatioValue={getLatestRatioValue}
          showInOverview={true} 
        />
      </div>
      
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

export default FullOverview;