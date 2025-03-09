import { useState, useEffect } from 'react';
import { 
  AIRecommendationRequest, 
  AIRecommendationResponse, 
  getMetricRecommendations,
  UserPreferences
} from './aiService';
import { FEATURES, METRIC_CATEGORIES, FinancialMetric, MetricCategory } from './config';

interface UseAIRecommendationsProps {
  companyTicker: string;
  companyName?: string;
  industry: string;
  competitors?: string[];
  metricType: MetricCategory;
  userPreferences?: UserPreferences;
  skipInitialFetch?: boolean; // Option to skip the automatic initial fetch
}

interface UseAIRecommendationsResult {
  recommendations: AIRecommendationResponse | null;
  loading: boolean;
  error: string | null;
  refreshRecommendations: () => void;
}

/**
 * Custom hook to get AI-powered recommendations for financial metrics
 * 
 * @param props Configuration for the AI recommendations 
 * @returns AI recommendations, loading state, errors, and refresh function
 */
export function useAIRecommendations({
  companyTicker,
  companyName,
  industry,
  competitors,
  metricType,
  userPreferences,
  skipInitialFetch = false
}: UseAIRecommendationsProps): UseAIRecommendationsResult {
  const [recommendations, setRecommendations] = useState<AIRecommendationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Only enable if feature flag is true
  const isEnabled = FEATURES.ENABLE_AI_RANKING;
  
  const fetchRecommendations = async () => {
    // Skip if AI ranking is disabled
    if (!isEnabled) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get the metrics for the selected metric type
      // Convert string metrics to FinancialMetric enum values
      const metricsForCategory = METRIC_CATEGORIES[metricType] || [];
      const metrics: FinancialMetric[] = metricsForCategory.map(metricStr => {
        // Find the matching enum value
        const enumValue = Object.values(FinancialMetric).find(
          m => m === metricStr
        );
        
        if (!enumValue) {
          if (FEATURES.LOG_GEMINI_API) {
            console.warn(`Metric "${metricStr}" not found in FinancialMetric enum`);
          }
          return FinancialMetric.DEBT_TO_EQUITY; // Default value as fallback
        }
        
        return enumValue;
      });
      
      // Create the request
      const request: AIRecommendationRequest = {
        companyTicker,
        companyName,
        industry,
        competitors,
        metrics,
        userPreferences
      };
      
      // Get the recommendations
      const result = await getMetricRecommendations(request);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      if (FEATURES.LOG_GEMINI_API) {
        console.error('Error getting AI recommendations:', err);
      } else {
        console.error('AI recommendation error - see error message in UI');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch recommendations when inputs change (unless skipInitialFetch is true)
  useEffect(() => {
    if (companyTicker && industry && isEnabled && !skipInitialFetch) {
      fetchRecommendations();
    }
  }, [companyTicker, industry, metricType, isEnabled, skipInitialFetch,
     // Convert objects to strings to detect changes
     JSON.stringify(competitors), 
     JSON.stringify(userPreferences)
  ]);
  
  return {
    recommendations,
    loading,
    error,
    refreshRecommendations: fetchRecommendations
  };
}