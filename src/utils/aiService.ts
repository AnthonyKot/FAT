// AI Service for metric importance ranking

import { 
  FinancialMetric, 
  MetricCategory, 
  METRIC_CATEGORIES
} from './config';
import GeminiRanking from './GeminiRanking';
import MockRanking from './MockRanking';
import type { AIRankingService } from './AIRankingInterface';


// Enum for investment focus areas
export enum InvestmentFocus {
  GROWTH = 'growth',
  VALUE = 'value',
  INCOME = 'income',
  STABILITY = 'stability'
}

// Enum for investment time horizon
export enum TimeHorizon {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long'
}

// Enum for risk tolerance
export enum RiskTolerance {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Enum for time period types
export enum TimePeriod {
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  TTM = 'ttm'
}

// User preferences interface
export interface UserPreferences {
  focusAreas?: InvestmentFocus[];
  timeHorizon?: TimeHorizon;
  riskTolerance?: RiskTolerance;
}

// Interfaces for AI recommendation service
export interface MetricScore {
  metric: FinancialMetric;
  score: number;  // 1-10 scale where 10 is most important
}

export interface AIRecommendationRequest {
  companyTicker: string;         // Primary company ticker (e.g., 'AAPL')
  companyName?: string;          // Optional company name for better context
  industry: string;              // Industry/sector (e.g., 'Technology', 'Retail')
  competitors?: string[];        // Array of competitor tickers
  metrics: FinancialMetric[];    // Array of metrics to evaluate
  userPreferences?: UserPreferences;
}

export interface AIRecommendationResponse {
  scoredMetrics: MetricScore[];            // Metrics with importance scores (1-10)
  topMetrics: FinancialMetric[];           // Top 5 most important metrics
  dashboardAnalysis?: string;              // Overall analysis of the metrics
  competitiveInsights?: string;            // Insights about company vs competitors
  visualizationRecommendations?: {         // Recommended visualizations
    primary: string[];                     // Primary visualizations to show
    secondary: string[];                   // Secondary visualizations
  };
  timeSeriesRecommendation?: {             // Recommended time periods to focus on
    period: TimePeriod;
    years: number;                         // How many years back to focus on
    reasoning: string;                     // Why this time period is important
  };
}

/**
 * Interface for UI components that provide metrics
 * Components implementing this interface can be evaluated 
 * for importance based on the metrics they provide
 */
export interface MetricProvider {
  /**
   * Get the list of metrics provided by this component
   * @returns Array of financial metrics
   */
  getProvidedMetrics(): FinancialMetric[];
  
  /**
   * Get the category this component belongs to
   * @returns Metric category
   */
  getMetricCategory(): MetricCategory;
  
  /**
   * Calculate the overall importance score for this component
   * based on the importance of its individual metrics
   * 
   * @param scoredMetrics Array of metrics with importance scores
   * @returns Importance score (1-10)
   */
  getImportanceScore(scoredMetrics: MetricScore[]): number;
}

import { callGeminiForRecommendations } from './geminiService';
import { FEATURES } from './config';

/**
 * Get comprehensive AI recommendations for company metrics
 * 
 * @param request Request parameters including company, industry, metrics, etc.
 * @returns AI-powered recommendations and insights
 */
export async function getMetricRecommendations(
  request: AIRecommendationRequest
): Promise<AIRecommendationResponse> {
   const service = FEATURES.ENABLE_AI_RANKING ? new GeminiRanking(): new MockRanking();
  if(service instanceof GeminiRanking && FEATURES.ENABLE_AI_RANKING){
      return await service.getMetricRecommendations(request)
   }else{
      return await service.getMetricRecommendations(request);
   }
}

// Helper function to adjust scores based on user preferences
function applyUserPreferencesToScores(
  metrics: MetricScore[], 
  preferences: AIRecommendationRequest['userPreferences']
) {
  if (!preferences) return;
  
  metrics.forEach(metric => {
    // Adjust for focus areas
    if (preferences.focusAreas) {
      if (preferences.focusAreas.includes('growth') && 
          (metric.metric.includes('Growth') || metric.metric.includes('Revenue') || metric.metric.includes('R&D'))) {
        metric.score = Math.min(metric.score + 1, 10);
      }
      
      if (preferences.focusAreas.includes('value') && 
          (metric.metric.includes('P/E') || metric.metric.includes('Book') || metric.metric.includes('Graham'))) {
        metric.score = Math.min(metric.score + 1, 10);
      }
      
      if (preferences.focusAreas.includes('income') && 
          (metric.metric.includes('Dividend') || metric.metric.includes('Yield') || metric.metric.includes('Payout'))) {
        metric.score = Math.min(metric.score + 1, 10);
      }
      
      if (preferences.focusAreas.includes('stability') && 
          (metric.metric.includes('Debt') || metric.metric.includes('Risk') || metric.metric.includes('Coverage'))) {
        metric.score = Math.min(metric.score + 1, 10);
      }
    }
    
    // Adjust for time horizon
    if (preferences.timeHorizon) {
      if (preferences.timeHorizon === 'short' && 
          (metric.metric.includes('Current') || metric.metric.includes('Quick'))) {
        metric.score = Math.min(metric.score + 1, 10);
      }
      
      if (preferences.timeHorizon === 'long' && 
          (metric.metric.includes('CapEx') || metric.metric.includes('R&D') || metric.metric.includes('Growth'))) {
        metric.score = Math.min(metric.score + 1, 10);
      }
    }
    
    // Adjust for risk tolerance
    if (preferences.riskTolerance) {
      if (preferences.riskTolerance === 'low' && 
          (metric.metric.includes('Debt') || metric.metric.includes('Coverage') || metric.metric.includes('Current'))) {
        metric.score = Math.min(metric.score + 1, 10);
      }
      
      if (preferences.riskTolerance === 'high' && 
          (metric.metric.includes('Growth') || metric.metric.includes('R&D') || metric.metric.includes('Innovation'))) {
        metric.score = Math.min(metric.score + 1, 10);
      }
    }
  });
  
  // Re-sort after adjustments
  metrics.sort((a, b) => b.score - a.score);
}

// Helper function to generate analysis templates based on industry and top metrics
function getAnalysisTemplate(industry: string, topMetrics: string[]): string {
  // Check if we have enough metrics
  const safeMetrics = topMetrics.length >= 3 
    ? topMetrics 
    : [...topMetrics, ...['overall financial health', 'competitive positioning', 'operational efficiency']].slice(0, 3);
  
  // Get predefined analysis if available
  if (industry === 'Technology') {
    return `Analysis of key metrics indicates this technology company should be evaluated primarily on its ${safeMetrics[0]}, ${safeMetrics[1]}, and ${safeMetrics[2]}. The company shows particular strength in innovation metrics, with opportunities for improvement in operational efficiency.`;
  }
  
  if (industry === 'Financial Services') {
    return `This financial services company demonstrates notable performance in its ${safeMetrics[0]} and ${safeMetrics[1]}. Risk management appears sound based on ${safeMetrics[2]}, though capital allocation efficiency metrics suggest potential areas for optimization.`;
  }
  
  if (industry === 'Retail') {
    return `Key metrics for this retail company highlight the importance of ${safeMetrics[0]} and ${safeMetrics[1]}. Inventory management efficiency is reflected in strong ${safeMetrics[2]} metrics, though margin protection remains an area to monitor closely.`;
  }
  
  if (industry === 'Healthcare') {
    return `For this healthcare company, ${safeMetrics[0]} and ${safeMetrics[1]} provide critical insights into operational performance. Research efficiency as measured by ${safeMetrics[2]} appears particularly relevant for future growth potential.`;
  }
  
  if (industry === 'Manufacturing') {
    return `Analysis of this manufacturing company should focus on ${safeMetrics[0]} and ${safeMetrics[1]}, which highlight capital efficiency and operational performance. Asset utilization metrics like ${safeMetrics[2]} provide additional insights into management effectiveness.`;
  }
  
  if (industry === 'Energy') {
    return `For energy companies, ${safeMetrics[0]} and ${safeMetrics[1]} are particularly important in the current market environment. Capital discipline as reflected in ${safeMetrics[2]} remains a key differentiator for investor returns.`;
  }
  
  // Generic template if no industry-specific one exists
  return `Based on industry-specific analysis, the most relevant metrics for this company are ${safeMetrics[0]}, ${safeMetrics[1]}, and ${safeMetrics[2]}. These metrics provide the clearest insights into the company's competitive position and financial health.`;
}

/**
 * Get importance rankings for financial metrics in a specific industry/sector
 * 
 * @param metrics Array of metrics to rank 
 * @param company Company name or ticker symbol
 * @param sector Industry/sector name
 * @returns Sorted array of metrics with importance scores
 */
export async function rankMetricsByImportance(
  metrics: string[],
  company: string,
  sector: string
): Promise<Array<{metric: string, score: number}>> {
  // This would normally make an API call to an LLM like Gemini or GPT-4
  // For now, we'll simulate the response with mock data
  
  // In a real implementation, we would send a prompt like:
  // "Rank the following financial metrics in order of importance for evaluating [company] in the [sector] sector.
  // Give each metric a score from 1-10, where 10 is extremely important and 1 is least important.
  // Explain the reasoning for each score. Metrics: [list of metrics]"
  
  // For demo purposes, assign mock scores based on sector/industry
  return mockRankMetrics(metrics, sector);
}

/**
 * Get a detailed explanation for why a specific metric is important for a company/sector
 * 
 * @param metric Metric name
 * @param company Company name or ticker
 * @param sector Industry/sector
 * @returns Explanation text
 */
export async function getMetricImportanceExplanation(
  metric: string,
  company: string,
  sector: string
): Promise<string> {
  // This would normally make an API call to an LLM
  // For demo purposes, return mock explanations
  return mockExplanations[metric] || 
    `${metric} is an important indicator for companies in the ${sector} sector like ${company} because it helps investors understand the company's financial health and performance relative to competitors.`;
}

/**
 * Get a dashboard-level analysis based on multiple metrics
 * 
 * @param dashboardType Type of dashboard (financial health, operational efficiency, etc.)
 * @param company Company name or ticker
 * @param sector Industry/sector
 * @returns Analysis text
 */
export async function getDashboardAnalysis(
  dashboardType: keyof typeof METRIC_CATEGORIES,
  company: string,
  sector: string
): Promise<string> {
  // This would normally make an API call to an LLM
  // For demo purposes, return mock analysis
  return mockDashboardAnalysis[dashboardType] || 
    `Analysis of ${dashboardType} metrics for ${company} in the ${sector} sector would go here.`;
}

// Mock data for development purposes
function mockRankMetrics(
  metrics: string[], 
  company: string,
  sector: string
): Array<MetricScore> {
  const result = metrics.map(metric => {
    // Assign mock scores based on sector and metric type
    let baseScore = 5; // Default mid-range score
    
    // Adjust score based on sector
    if (sector === 'Technology') {
      if (metric.includes('R&D') || metric.includes('Innovation')) {
        baseScore += 3;
      } else if (metric.includes('Debt') || metric.includes('Inventory')) {
        baseScore -= 1;
      } else if (metric.includes('PEG') || metric.includes('Growth')) {
        baseScore += 2;
      }
    } else if (sector === 'Financial Services') {
      if (metric.includes('Debt') || metric.includes('Equity') || metric.includes('Liquidity')) {
        baseScore += 3;
      } else if (metric.includes('Ratio') && metric.includes('Current')) {
        baseScore += 2;
      }
    } else if (sector === 'Retail') {
      if (metric.includes('Inventory') || metric.includes('Turnover')) {
        baseScore += 3;
      } else if (metric.includes('Sales') || metric.includes('Margin')) {
        baseScore += 2;
      }
    } else if (sector === 'Manufacturing') {
      if (metric.includes('CapEx') || metric.includes('Asset')) {
        baseScore += 2;
      } else if (metric.includes('Margin') || metric.includes('Efficiency')) {
        baseScore += 2;
      }
    } else if (sector === 'Healthcare') {
      if (metric.includes('R&D') || metric.includes('Margin')) {
        baseScore += 3;
      }
    } else if (sector === 'Energy') {
      if (metric.includes('CapEx') || metric.includes('FCF')) {
        baseScore += 3;
      }
    }
    
    // Company-specific adjustments
    if (company === 'AAPL' || company === 'MSFT' || company === 'GOOGL') {
      if (metric.includes('Cash') || metric.includes('R&D')) {
        baseScore += 1;
      }
    } else if (company === 'AMZN') {
      if (metric.includes('Growth') || metric.includes('Cash Flow')) {
        baseScore += 1;
      }
    }
    
    // Add some randomness (±1) to make it look more realistic
    const randomAdjustment = Math.floor(Math.random() * 3) - 1;
    const finalScore = Math.min(Math.max(baseScore + randomAdjustment, 1), 10);
    
    // Add explanation for top metrics (score >= 8)
    let explanation;
    if (finalScore >= 8) {
      explanation = mockExplanations[metric] || 
        `${metric} is a critical metric for ${company} in the ${sector} sector due to its direct impact on financial performance and competitiveness.`;
    }
    
    return {
      metric,
      score: finalScore,
      explanation
    };
  });
  
  // Sort by score (descending)
  return result.sort((a, b) => b.score - a.score);
}

// Mock function for competitive insights
function mockCompetitiveInsights(company: string, industry: string, competitors?: string[]): string {
  if (!competitors || competitors.length === 0) {
    return `${company} shows average performance within the ${industry} sector, with particular strengths in operational efficiency metrics compared to industry benchmarks.`;
  }
  
  const competitorText = competitors.join(', ');
  
  if (industry === 'Technology') {
    return `${company} demonstrates stronger R&D efficiency compared to ${competitorText}, but lags in revenue growth metrics. Capital allocation efficiency is notably better than peers, particularly in generating returns on research investments.`;
  } else if (industry === 'Retail') {
    return `${company} has superior inventory turnover metrics compared to ${competitorText}, indicating more efficient supply chain management. However, gross margin metrics suggest pricing pressure compared to industry leaders.`;
  } else if (industry === 'Financial Services') {
    return `${company} maintains healthier risk metrics than ${competitorText}, with notably stronger capital adequacy ratios. Return on equity shows room for improvement compared to top-performing competitors.`;
  } else {
    return `${company} shows mixed performance when compared with ${competitorText}. Areas of competitive advantage include cost management and capital efficiency, while revenue growth metrics suggest opportunities for improvement.`;
  }
}

// Mock function for visualization recommendations
function mockVisualizationRecommendations(industry: string, metrics: string[]): { primary: string[], secondary: string[] } {
  const visualizations = {
    primary: ['Line Chart - 5 Year Trend', 'Bar Chart - Peer Comparison'],
    secondary: ['Heat Map - Correlation Analysis', 'Radar Chart - Metric Comparison']
  };
  
  // Industry-specific recommendations
  if (industry === 'Technology') {
    visualizations.primary.push('Time Series - R&D vs. Revenue Growth');
    visualizations.secondary.push('Scatter Plot - Innovation vs. Profitability');
  } else if (industry === 'Retail') {
    visualizations.primary.push('Stacked Bar - Revenue Segments');
    visualizations.secondary.push('Line Chart - Inventory vs. Sales Trends');
  } else if (industry === 'Financial Services') {
    visualizations.primary.push('Area Chart - Risk Metrics Over Time');
    visualizations.secondary.push('Heat Map - Asset Quality Metrics');
  }
  
  // Add metric-specific visualizations
  if (metrics.some(m => m.includes('Ratio'))) {
    visualizations.primary.push('Multi-line Chart - Key Ratios Trend');
  }
  
  if (metrics.some(m => m.includes('Margin'))) {
    visualizations.primary.push('Waterfall Chart - Margin Analysis');
  }
  
  if (metrics.some(m => m.includes('Cash Flow'))) {
    visualizations.secondary.push('Sankey Diagram - Cash Flow Distribution');
  }
  
  return visualizations;
}

// Mock function for time series recommendations
function mockTimeSeriesRecommendation(industry: string): { period: 'quarterly' | 'annual' | 'ttm', years: number, reasoning: string } {
  if (industry === 'Technology' || industry === 'Retail') {
    return {
      period: 'quarterly',
      years: 3,
      reasoning: 'Quarterly analysis over a 3-year period provides the best balance between identifying cyclical patterns and capturing recent growth trends, which are particularly important in fast-changing sectors.'
    };
  } else if (industry === 'Financial Services' || industry === 'Energy') {
    return {
      period: 'annual',
      years: 5,
      reasoning: 'Annual data over a 5-year timeframe offers better insight into long-term performance trends while smoothing out seasonal fluctuations, providing a more stable picture of fundamental performance.'
    };
  } else {
    return {
      period: 'ttm',
      years: 3,
      reasoning: 'Trailing twelve months (TTM) data over 3 years balances recency with enough historical context to evaluate performance trends while minimizing the impact of short-term volatility.'
    };
  }
}

// Mock explanations for development purposes
const mockExplanations: Record<string, string> = {
  'Debt-to-Equity Ratio': 
    'The Debt-to-Equity ratio is crucial as it reveals how much a company is financing its operations through debt versus shareholder equity. A high ratio might indicate excessive leverage and financial risk, while a very low ratio might suggest underutilization of debt financing advantages. For technology companies, moderate debt levels can be beneficial for growth and R&D investment.',
  
  'R&D to Revenue': 
    'For technology companies, R&D to Revenue is a vital metric that indicates investment in future growth and innovation. High R&D spending relative to revenue suggests commitment to staying competitive through new product development, while low spending might signal potential future competitiveness issues. This metric helps predict long-term growth trajectory and technological leadership.',
  
  'Cash Conversion Cycle': 
    'The Cash Conversion Cycle measures how efficiently a company converts investments in inventory and other resources into cash flows. A shorter cycle indicates better operational efficiency and working capital management. For retail and manufacturing companies, this metric is particularly important as it directly impacts liquidity and the need for external financing.',
  
  'PEG Ratio': 
    'The Price/Earnings to Growth (PEG) ratio provides a more complete picture than the P/E ratio alone by factoring in expected earnings growth. A PEG ratio below 1 might indicate an undervalued stock relative to its growth prospects. This metric is especially valuable for evaluating growth companies in technology or emerging sectors.',
  
  'Free Cash Flow Yield': 
    'Free Cash Flow Yield measures a company\'s ability to generate cash relative to its market value. A high yield suggests the company is generating substantial cash that can be used for dividends, buybacks, debt reduction, or reinvestment. This metric helps identify companies with strong cash generation capabilities relative to their valuation.'
};

// Mock dashboard analysis for development purposes
const mockDashboardAnalysis: Record<string, string> = {
  financialHealth: 
    'Analysis of the financial health metrics indicates a solid balance sheet with moderate leverage and strong liquidity position. The debt-to-equity ratio is within industry norms, while interest coverage suggests minimal concerns about debt servicing capacity. Particularly notable is the strong net cash position relative to EBITDA, providing ample flexibility for strategic investments or shareholder returns.',
  
  operationalEfficiency: 
    'The operational efficiency metrics reveal strong inventory management with turnover rates exceeding industry averages. The cash conversion cycle has improved by 15% year-over-year, indicating enhanced working capital management. Areas for potential improvement include accounts receivable management, where days sales outstanding exceeds peer benchmarks by approximately 8 days.',
  
  investorValue: 
    'From an investor value perspective, the company presents a mixed picture. While traditional valuation metrics like P/E and EV/EBITDA suggest premium pricing compared to peers, the PEG ratio indicates reasonable valuation when accounting for above-average growth expectations. The free cash flow yield of 3.8% supports the current dividend program while allowing for strategic reinvestment in the business.',
  
  researchInnovation: 
    'R&D investment metrics show an above-industry-average commitment to innovation, with R&D to revenue ratio in the top quartile of comparable firms. The efficiency of this spending appears strong based on new product revenue contribution and the ratio of revenue growth to R&D investment. Capital expenditure levels relative to depreciation suggest appropriate investment in maintaining and expanding technological infrastructure.'
};