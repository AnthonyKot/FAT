import React from 'react';
import { MetricScore } from '../utils/aiService';
import { COMPONENT_METRICS_MAP, calculateOverallImportance } from '../utils/metricUtils';

interface WidgetImportanceRankingProps {
  scoredMetrics: MetricScore[] | null | undefined;
  showDebug?: boolean;
}

/**
 * Component that displays the importance ranking of UI widgets
 * based on the metrics they display
 */
const WidgetImportanceRanking: React.FC<WidgetImportanceRankingProps> = ({
  scoredMetrics,
  showDebug = false
}) => {
  if (!scoredMetrics) {
    return null;
  }
  
  // Calculate importance score for each component
  const componentScores = Object.entries(COMPONENT_METRICS_MAP).map(([key, config]) => {
    const score = calculateOverallImportance(config.metrics, scoredMetrics);
    return {
      id: key,
      displayName: config.displayName,
      category: config.category,
      score,
      metrics: config.metrics
    };
  });
  
  // Sort by score (highest first)
  const sortedComponents = [...componentScores].sort((a, b) => b.score - a.score);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Widget Importance Ranking
        </h2>
        {showDebug && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
            Debug View
          </span>
        )}
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Based on AI analysis, these widgets are ranked by relevance for this company and its competitors.
      </p>
      
      <div className="overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Widget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Importance Score
              </th>
              {showDebug && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Metrics
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedComponents.map((component) => (
              <tr key={component.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {component.displayName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {component.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          component.score >= 8 ? 'bg-green-500' :
                          component.score >= 6 ? 'bg-blue-500' :
                          component.score >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${component.score * 10}%` }}
                      ></div>
                    </div>
                    <span className={`font-medium ${
                      component.score >= 8 ? 'text-green-600 dark:text-green-400' :
                      component.score >= 6 ? 'text-blue-600 dark:text-blue-400' :
                      component.score >= 4 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {component.score.toFixed(1)}
                    </span>
                  </div>
                </td>
                {showDebug && (
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {component.metrics.map(m => m.toString()).join(', ')}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Widgets with higher scores contain financial metrics that are more relevant for this company's analysis.</p>
      </div>
    </div>
  );
};

export default WidgetImportanceRanking;