import React, { useState } from 'react';
import { useAIRecommendations } from '../utils/useAIRecommendations';
import { 
  shouldDisplayMetric, 
  sortMetricsByImportance, 
  getMetricImportanceScore 
} from '../utils/metricUtils';
import { METRIC_CATEGORIES } from '../utils/config';
import { CompanyData } from '../types';

interface FinancialHealthDashboardProps {
  company: CompanyData;
  competitors?: CompanyData[];
}

/**
 * Financial Health Dashboard component
 * Displays key financial health metrics with AI-powered importance ranking
 */
export const FinancialHealthDashboard: React.FC<FinancialHealthDashboardProps> = ({ 
  company, 
  competitors 
}) => {
  // User preference state
  const [userPreferences, setUserPreferences] = useState({
    focusAreas: ['stability'] as ('growth' | 'value' | 'income' | 'stability')[],
    timeHorizon: 'medium' as 'short' | 'medium' | 'long',
    riskTolerance: 'medium' as 'low' | 'medium' | 'high'
  });
  
  // Get AI recommendations
  const { recommendations, loading, error, refreshRecommendations } = useAIRecommendations({
    companyTicker: company.company.symbol,
    companyName: company.company.name,
    industry: company.company.industry,
    competitors: competitors?.map(c => c.company.symbol),
    metricType: 'financialHealth',
    userPreferences
  });
  
  // Get the list of metrics to display
  const financialHealthMetrics = METRIC_CATEGORIES.financialHealth;
  
  // Sort metrics by importance score
  const sortedMetrics = sortMetricsByImportance(
    financialHealthMetrics, 
    recommendations?.scoredMetrics
  );
  
  // Filtering threshold - only show metrics with score >= 5
  const DISPLAY_THRESHOLD = 5;
  
  // Flag to control whether all metrics are shown or only important ones
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Financial Health Dashboard
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAllMetrics(!showAllMetrics)}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md text-sm"
          >
            {showAllMetrics ? 'Show Important Metrics' : 'Show All Metrics'}
          </button>
          
          {/* Debug button for Gemini API */}
          <button 
            onClick={() => {
              // Force refresh recommendations to trigger Gemini API call
              refreshRecommendations();
              // Show a message to check console
              alert('Gemini API call triggered. Check browser console for details.');
            }}
            className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md text-sm"
            title="Trigger Gemini API call to rank metrics"
          >
            🧠 Rank Metrics
          </button>
          
          {/* Debug info display */}
          {recommendations && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-md">
              {recommendations.scoredMetrics.length} metrics ranked
            </span>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
          Error: {error}
        </div>
      ) : (
        <>
          {/* AI Insights Panel */}
          {recommendations?.dashboardAnalysis && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <h3 className="font-semibold text-lg mb-2 text-blue-800 dark:text-blue-200">
                AI Insights
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {recommendations.dashboardAnalysis}
              </p>
            </div>
          )}
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMetrics.map(metric => {
              // Skip metrics with low importance score unless showing all
              if (!shouldDisplayMetric(metric, recommendations?.scoredMetrics, DISPLAY_THRESHOLD, showAllMetrics)) {
                return null;
              }
              
              // Get importance score for styling
              const importance = getMetricImportanceScore(metric, recommendations?.scoredMetrics);
              
              return (
                <div 
                  key={metric}
                  className={`p-4 rounded-lg border ${
                    importance >= 8 ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' :
                    importance >= 6 ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' :
                    'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {metric}
                    </h3>
                    
                    {/* Importance indicator */}
                    {importance >= 8 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100">
                        Critical
                      </span>
                    )}
                    {importance >= 6 && importance < 8 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        Important
                      </span>
                    )}
                  </div>
                  
                  {/* Mock metric value - in a real component, this would use actual data */}
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                    {metric.includes('Ratio') ? '2.43' :
                     metric.includes('Debt') ? '0.38' :
                     metric.includes('Coverage') ? '12.6' : 
                     '78%'}
                  </div>
                  
                  {/* Explanation only for high importance metrics */}
                  {recommendations?.scoredMetrics?.find(m => m.metric === metric)?.explanation && importance >= 8 && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {recommendations.scoredMetrics.find(m => m.metric === metric)?.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Competitive Insights */}
          {recommendations?.competitiveInsights && competitors && competitors.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                Competitive Analysis
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {recommendations.competitiveInsights}
              </p>
            </div>
          )}
          
          {/* Gemini API Debug Section */}
          {recommendations && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg mb-2 text-yellow-800 dark:text-yellow-200">
                  Gemini API Results
                </h3>
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  Debug View
                </span>
              </div>
              
              <div className="overflow-auto max-h-64 mb-4">
                <table className="min-w-full divide-y divide-yellow-200 dark:divide-yellow-800">
                  <thead className="bg-yellow-100 dark:bg-yellow-900/40">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-yellow-50 dark:bg-yellow-900/10 divide-y divide-yellow-200 dark:divide-yellow-800">
                    {recommendations.scoredMetrics.slice(0, 10).map((metricScore, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-yellow-50 dark:bg-yellow-900/5' : 'bg-yellow-100/50 dark:bg-yellow-900/10'}>
                        <td className="px-4 py-2 text-sm text-yellow-900 dark:text-yellow-100">
                          {metricScore.metric.toString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-yellow-900 dark:text-yellow-100">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  metricScore.score >= 8 ? 'bg-green-500' :
                                  metricScore.score >= 6 ? 'bg-blue-500' :
                                  metricScore.score >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${metricScore.score * 10}%` }}
                              ></div>
                            </div>
                            {metricScore.score}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recommendations.scoredMetrics.length > 10 && (
                  <div className="text-center text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    Showing top 10 of {recommendations.scoredMetrics.length} metrics
                  </div>
                )}
              </div>
              
              <div className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                <strong>Top Metrics:</strong> {recommendations.topMetrics.map(m => m.toString()).join(', ')}
              </div>
              
              <button 
                onClick={() => {
                  console.log('Full Gemini API results:', recommendations);
                  alert('Full results logged to console');
                }}
                className="text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
              >
                Log full results to console
              </button>
            </div>
          )}
          
          {/* User Preferences Section */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
              Customize Dashboard
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Focus Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Focus Areas
                </label>
                <div className="space-y-2">
                  {(['growth', 'value', 'income', 'stability'] as const).map(focus => (
                    <label key={focus} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userPreferences.focusAreas.includes(focus)}
                        onChange={e => {
                          if (e.target.checked) {
                            setUserPreferences({
                              ...userPreferences,
                              focusAreas: [...userPreferences.focusAreas, focus]
                            });
                          } else {
                            setUserPreferences({
                              ...userPreferences,
                              focusAreas: userPreferences.focusAreas.filter(f => f !== focus)
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {focus}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Time Horizon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Horizon
                </label>
                <div className="space-y-2">
                  {(['short', 'medium', 'long'] as const).map(horizon => (
                    <label key={horizon} className="flex items-center">
                      <input
                        type="radio"
                        checked={userPreferences.timeHorizon === horizon}
                        onChange={() => {
                          setUserPreferences({
                            ...userPreferences,
                            timeHorizon: horizon
                          });
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {horizon}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Risk Tolerance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Tolerance
                </label>
                <div className="space-y-2">
                  {(['low', 'medium', 'high'] as const).map(risk => (
                    <label key={risk} className="flex items-center">
                      <input
                        type="radio"
                        checked={userPreferences.riskTolerance === risk}
                        onChange={() => {
                          setUserPreferences({
                            ...userPreferences,
                            riskTolerance: risk
                          });
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {risk}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialHealthDashboard;