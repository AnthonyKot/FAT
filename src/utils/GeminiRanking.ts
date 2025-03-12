import AIRankingService from './AIRankingInterface';
import { API_CONFIG, FinancialMetric, FEATURES } from './config';
import { 
  AIRecommendationRequest, 
  AIRecommendationResponse, 
  MetricScore,
  TimePeriod
} from './aiService';

// Type definitions for Gemini API
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface GeminiMetricScore {
  metric: string;
  score: number;
  explanation?: string;
}

interface GeminiTimeSeriesRecommendation {
  period: string;
  years: number;
  reasoning: string;
}

interface GeminiVisualizationRecommendations {
  primary: string[];
  secondary: string[];
}

interface GeminiResponseData {
  scoredMetrics: GeminiMetricScore[];
  topMetrics: string[];
  dashboardAnalysis?: string;
  competitiveInsights?: string;
  visualizationRecommendations?: GeminiVisualizationRecommendations;
  timeSeriesRecommendation?: GeminiTimeSeriesRecommendation;
}

/**
 * Call Gemini API to get metric importance scores and recommendations
 * 
 * @param request The recommendation request with company and metrics info
 * @returns AI-powered recommendations and insights
 */
class GeminiRanking implements AIRankingService {
  async getMetricRecommendations(
    request: AIRecommendationRequest
  ): Promise<AIRecommendationResponse> {
    try {
      // Destructure request for easier access
      const { 
        companyTicker, 
        companyName, 
        industry, 
        competitors, 
        metrics,
        userPreferences 
      } = request;
      
      // Prepare the metrics list (convert enums to string values)
      const metricsList = metrics.map(metric => metric.toString());
      
      // If we have more metrics than the limit, select a random subset
      let selectedMetrics;
      if (metricsList.length > API_CONFIG.GEMINI_MAX_METRICS_PER_REQUEST) {
        if (FEATURES.LOG_GEMINI_API) {
          console.log(`Too many metrics (${metricsList.length}), selecting ${API_CONFIG.GEMINI_MAX_METRICS_PER_REQUEST} at random`);
        }
        selectedMetrics = [];
        const availableIndices = Array.from({ length: metricsList.length }, (_, i) => i);
        
        // Select random metrics
        for (let i = 0; i < API_CONFIG.GEMINI_MAX_METRICS_PER_REQUEST; i++) {
          const randomIndex = Math.floor(Math.random() * availableIndices.length);
          const metricIndex = availableIndices.splice(randomIndex, 1)[0];
          selectedMetrics.push(metricsList[metricIndex]);
        }
      } else {
        selectedMetrics = metricsList;
      }
      
      if (FEATURES.LOG_GEMINI_API) {
        console.log(`Selected ${selectedMetrics.length} metrics for Gemini analysis`);
        
        // Log metrics details only when debug logging is enabled
        selectedMetrics.forEach((metric, index) => {
          console.log(`Metric ${index + 1}: ${metric}`);
        });
      }
      
      // Format user preferences if available
      let userPreferencesText = '';
      if (userPreferences) {
        userPreferencesText = 'User has the following investment preferences:\n';
        
        if (userPreferences.focusAreas && userPreferences.focusAreas.length > 0) {
          userPreferencesText += `- Focus Areas: ${userPreferences.focusAreas.join(', ')}\n`;
        }
        
        if (userPreferences.timeHorizon) {
          userPreferencesText += `- Time Horizon: ${userPreferences.timeHorizon}\n`;
        }
        
        if (userPreferences.riskTolerance) {
          userPreferencesText += `- Risk Tolerance: ${userPreferences.riskTolerance}\n`;
        }
      }
      
      // Competitive context
      const competitiveContext = competitors && competitors.length > 0
        ? `Compare with competitors: ${competitors.join(', ')}.`
        : 'No specific competitors for comparison.';
      
      // Construct the prompt for Gemini
      const prompt = `
  You are a financial analysis AI that specializes in evaluating the importance of financial metrics for companies in different industries. Your task is to rank the importance of financial metrics for ${companyName || companyTicker} in the ${industry} industry.

  Company: ${companyName || companyTicker} (${companyTicker})
  Industry: ${industry}
  ${competitiveContext}
  ${userPreferencesText}

  Please analyze the following financial metrics and rank them by importance for this specific company and industry context:
  ${selectedMetrics.join('\n')}

  Provide your response in the following JSON format:
  {
    "scoredMetrics": [
      {
        "metric": "metric name exactly as provided",
        "score": score from 1-10 where 10 is highest importance
      }
    ]
  }

  Important instructions:
  1. Return ONLY the scoredMetrics array with metric names and scores
  2. Use EXACTLY the same metric names as provided in the list above
  3. Score each metric from 1-10 based on its importance for this specific company in this industry
  4. Be opinionated and decisive in your scoring - don't cluster too many metrics around the middle scores
  5. No more than 15% of metrics should have the same score - spread out your scores across the 1-10 range
  6. Reserve scores of 9-10 for truly critical metrics and scores of 1-2 for metrics with minimal relevance
  7. Make clear distinctions between metrics of high, medium, and low importance
  8. Ensure your JSON is valid with no additional text or explanations
  9. Do not skip any metrics - every metric in the list must have a score
  `;
      // Log the prompt only when debug logging is enabled
      if (FEATURES.LOG_GEMINI_API) {
        console.log('Calling Gemini API with prompt:', prompt);
      }
      
      try {
        const response = await fetch(`${API_CONFIG.GEMINI_API_URL}?key=${API_CONFIG.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.4, // Higher temperature for more opinionated scoring
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          })
        });
        
        if (!response.ok) {
          const responseText = await response.text();
          // Always log API errors regardless of the LOG_GEMINI_API setting
          console.error('Gemini API error:', responseText);
          throw new Error(`Gemini API returned status ${response.status}`);
        }
        
        const data: GeminiResponse = await response.json();
        
        // Log the full response only when debug logging is enabled
        if (FEATURES.LOG_GEMINI_API) {
          console.log('Gemini API response:', JSON.stringify(data, null, 2));
        }
        
        const responseText = data.candidates[0]?.content.parts[0]?.text;
        
        if (!responseText) {
          console.error('Empty response from Gemini API');
          throw new Error('Empty response from Gemini API');
        }
        
        // Parse the JSON response
        if (FEATURES.LOG_GEMINI_API) {
          console.log('Raw response text:', responseText);
        }
        let parsedResponse: GeminiResponseData;
        
        try {
          const cleanedResponse = responseText.replace(/^
