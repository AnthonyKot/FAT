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
export async function callGeminiForRecommendations(
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
        const cleanedResponse = responseText.replace(/^```json\n/, "").replace(/\n```$/, "");
        parsedResponse = JSON.parse(cleanedResponse);
        if (FEATURES.LOG_GEMINI_API) {
          console.log('Parsed response:', parsedResponse);
        }
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Gemini API');
      }
      
      // Map the Gemini response to our format
      const scoredMetrics: MetricScore[] = parsedResponse.scoredMetrics.map(item => {
        // Find the matching FinancialMetric enum value
        const metricEnum = Object.values(FinancialMetric).find(m => m === item.metric);
        
        if (!metricEnum) {
          if (FEATURES.LOG_GEMINI_API) {
            console.warn(`Metric "${item.metric}" from Gemini response doesn't match any FinancialMetric enum value`);
          }
          // Use the first enum value as a fallback (shouldn't happen if Gemini follows instructions)
          return { metric: metrics[0], score: item.score };
        }
        
        return { metric: metricEnum, score: item.score };
      });
      
      // Sort by score
      scoredMetrics.sort((a, b) => b.score - a.score);
      
      // Get top 5 metrics
      const topMetrics = scoredMetrics.slice(0, 5).map(m => m.metric);
      
      // Return minimal response with just the scored metrics from Gemini
      return {
        scoredMetrics,
        topMetrics
      };
    } catch (error) {
      // Always log errors, but with less detail when debugging is disabled
      if (FEATURES.LOG_GEMINI_API) {
        console.error('Error calling or processing Gemini API:', error);
      } else {
        console.error('Gemini API error - falling back to mock data');
      }
      
      return getMockGeminiResponse(request);
    }
  } catch (error) {
    if (FEATURES.LOG_GEMINI_API) {
      console.error('Error calling Gemini API:', error);
    } else {
      console.error('Gemini API error - check network connection or API key');
    }
    throw new Error(`Failed to get recommendations from Gemini: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generate a mock response for development purposes
 */
function getMockGeminiResponse(request: AIRecommendationRequest): AIRecommendationResponse {
  // Destructure request for easier access
  const { 
    companyTicker, 
    industry, 
    metrics,
    userPreferences 
  } = request;
  
  // Create scored metrics based on the industry and optionally user preferences
  // First pass - calculate initial scores
  const initialScores: MetricScore[] = metrics.map(metric => {
    // Base score depends on industry and metric
    let score = 5; // Default medium score
    
    // Industry-specific adjustments
    if (industry === 'Technology') {
      if (metric === FinancialMetric.RD_TO_REVENUE || 
          metric === FinancialMetric.PEG_RATIO ||
          metric === FinancialMetric.EV_REVENUE) {
        score += 3;
      } else if (metric === FinancialMetric.CURRENT_RATIO || 
                metric === FinancialMetric.INVENTORY_TURNOVER) {
        score -= 1;
      }
    } else if (industry === 'Financial Services') {
      if (metric === FinancialMetric.DEBT_TO_EQUITY || 
          metric === FinancialMetric.ROE ||
          metric === FinancialMetric.NET_DEBT_TO_EBITDA) {
        score += 3;
      }
    } else if (industry === 'Retail') {
      if (metric === FinancialMetric.INVENTORY_TURNOVER || 
          metric === FinancialMetric.DAYS_INVENTORY_ON_HAND ||
          metric === FinancialMetric.CASH_CONVERSION_CYCLE) {
        score += 3;
      }
    }
    
    // User preference adjustments
    if (userPreferences) {
      if (userPreferences.focusAreas) {
        // Growth-focused metrics
        if (userPreferences.focusAreas.includes('growth') && 
            (metric === FinancialMetric.PEG_RATIO || 
             metric === FinancialMetric.RD_TO_REVENUE || 
             metric === FinancialMetric.REVENUE_PER_EMPLOYEE)) {
          score += 1;
        }
        
        // Value-focused metrics
        if (userPreferences.focusAreas.includes('value') && 
            (metric === FinancialMetric.PE_RATIO || 
             metric === FinancialMetric.PB_RATIO || 
             metric === FinancialMetric.GRAHAM_NUMBER)) {
          score += 1;
        }
        
        // Income-focused metrics
        if (userPreferences.focusAreas.includes('income') && 
            (metric === FinancialMetric.DIVIDEND_YIELD || 
             metric === FinancialMetric.DIVIDEND_PAYOUT_RATIO || 
             metric === FinancialMetric.FCF_YIELD)) {
          score += 1;
        }
        
        // Stability-focused metrics
        if (userPreferences.focusAreas.includes('stability') && 
            (metric === FinancialMetric.DEBT_TO_EQUITY || 
             metric === FinancialMetric.CURRENT_RATIO || 
             metric === FinancialMetric.INTEREST_COVERAGE)) {
          score += 1;
        }
      }
    }
    
    // Add some randomness to make it more realistic
    const randomAdjustment = Math.floor(Math.random() * 3) - 1;
    score = Math.min(Math.max(score + randomAdjustment, 1), 10);
    
    return {
      metric,
      score
    };
  });
  
  // Second pass - distribute scores more evenly
  // Count initial scores
  const scoreDistribution: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) {
    scoreDistribution[i] = 0;
  }
  
  initialScores.forEach(item => {
    scoreDistribution[item.score] = (scoreDistribution[item.score] || 0) + 1;
  });
  
  // Calculate max allowed count per score (no more than 15% of metrics)
  const maxPerScore = Math.ceil(metrics.length * 0.15);
  
  // Adjust scores to spread them out
  const adjustedScores: MetricScore[] = [...initialScores];
  for (let i = 5; i <= 7; i++) { // Check mid-range scores for overrepresentation
    if (scoreDistribution[i] > maxPerScore) {
      // Find metrics to redistribute from this score
      const overflow = scoreDistribution[i] - maxPerScore;
      const candidates = adjustedScores
        .filter(item => item.score === i)
        .sort(() => Math.random() - 0.5) // Shuffle for random selection
        .slice(0, overflow);
      
      // Redistribute scores
      candidates.forEach(item => {
        // Decide whether to increase or decrease the score
        // Spread half up and half down where possible
        if (Math.random() > 0.5 && i < 9) {
          item.score = i + 1 + Math.floor(Math.random() * (10 - i - 1));
        } else if (i > 2) {
          item.score = i - 1 - Math.floor(Math.random() * (i - 2));
        } else {
          // If score is already low, then increase it
          item.score = i + 1 + Math.floor(Math.random() * (10 - i - 1));
        }
      });
    }
  }
  
  // Ensure we have at least one very high and one very low score for contrast
  if (!adjustedScores.some(item => item.score >= 9)) {
    // Promote the highest-scoring metric to 9-10
    const highest = [...adjustedScores].sort((a, b) => b.score - a.score)[0];
    highest.score = 9 + Math.floor(Math.random() * 2); // 9 or 10
  }
  
  if (!adjustedScores.some(item => item.score <= 2)) {
    // Demote the lowest-scoring metric to 1-2
    const lowest = [...adjustedScores].sort((a, b) => a.score - b.score)[0];
    lowest.score = 1 + Math.floor(Math.random() * 2); // 1 or 2
  }
  
  const scoredMetrics = adjustedScores;
  
  // Sort metrics by score (descending)
  scoredMetrics.sort((a, b) => b.score - a.score);
  
  // Get top 5 metrics
  const topMetrics = scoredMetrics.slice(0, 5).map(m => m.metric);
  
  // Generate industry-specific dashboard analysis
  let dashboardAnalysis = '';
  if (industry === 'Technology') {
    dashboardAnalysis = `For ${companyTicker} in the technology sector, prioritize R&D investment relative to revenue and PEG ratio which are critical for evaluating growth potential. The company shows strength in innovation metrics, with solid cash flow but room for improvement in operational efficiency.`;
  } else if (industry === 'Financial Services') {
    dashboardAnalysis = `Analysis for ${companyTicker} highlights the importance of capital adequacy and risk management metrics. Return on equity and debt-to-equity ratios provide key insights into profitability and leverage in this financial services company.`;
  } else if (industry === 'Retail') {
    dashboardAnalysis = `For ${companyTicker} in the retail industry, inventory management is paramount. The cash conversion cycle and inventory turnover metrics reveal the company's operational efficiency, while gross margin trends indicate pricing power and competitive positioning.`;
  } else {
    dashboardAnalysis = `Analysis of metrics for ${companyTicker} in the ${industry} industry shows that ${topMetrics[0]}, ${topMetrics[1]}, and ${topMetrics[2]} are the most critical indicators to monitor for performance evaluation and competitive comparison.`;
  }
  
  // Generate competitive insights if competitors are provided
  let competitiveInsights = '';
  if (request.competitors && request.competitors.length > 0) {
    const competitors = request.competitors.join(', ');
    competitiveInsights = `When comparing ${companyTicker} with ${competitors}, focus on relative performance in ${topMetrics[0]} and ${topMetrics[1]}. ${companyTicker} shows comparative strength in ${topMetrics[0]} but trails industry leaders in ${topMetrics[3]}.`;
  }
  
  // Generate visualization recommendations
  const visualizationRecommendations = {
    primary: [
      'Time Series Chart - 5 Year Trend',
      'Bar Chart - Peer Comparison',
      'Gauge Chart - Key Metrics vs Industry Benchmarks'
    ],
    secondary: [
      'Radar Chart - Metric Comparison',
      'Heat Map - Correlation Analysis',
      'Scatter Plot - Risk vs Return'
    ]
  };
  
  // Generate time series recommendation
  const timeSeriesRecommendation = {
    period: determineTimePeriod(industry),
    years: determineYears(industry),
    reasoning: `For companies in the ${industry} industry, ${determineTimePeriod(industry)} data over ${determineYears(industry)} years provides the optimal balance between identifying long-term trends and capturing recent performance shifts.`
  };
  
  return {
    scoredMetrics,
    topMetrics,
    dashboardAnalysis,
    competitiveInsights,
    visualizationRecommendations,
    timeSeriesRecommendation
  };
}

/**
 * Helper function to determine appropriate time period based on industry
 */
function determineTimePeriod(industry: string): TimePeriod {
  if (industry === 'Technology' || industry === 'Retail') {
    return TimePeriod.QUARTERLY;
  } else if (industry === 'Financial Services' || industry === 'Energy') {
    return TimePeriod.ANNUAL;
  } else {
    return TimePeriod.TTM;
  }
}

/**
 * Helper function to determine appropriate number of years based on industry
 */
function determineYears(industry: string): number {
  if (industry === 'Technology') {
    return 3; // Fast-changing industry
  } else if (industry === 'Utilities' || industry === 'Energy') {
    return 5; // More stable, longer cycles
  } else {
    return 4; // Default for most industries
  }
}