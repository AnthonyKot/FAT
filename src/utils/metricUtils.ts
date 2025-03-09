import { MetricScore } from './aiService';
import { METRIC_DATA_PATHS, FinancialMetric, MetricCategory } from './config';

/**
 * Get the importance score for a specific metric
 * 
 * @param metric Financial metric to get the score for
 * @param scoredMetrics Array of metrics with importance scores
 * @param defaultScore Default score if metric is not found
 * @returns Importance score (1-10)
 */
export function getMetricImportanceScore(
  metric: FinancialMetric,
  scoredMetrics: MetricScore[] | null | undefined,
  defaultScore: number = 5
): number {
  if (!scoredMetrics) {
    return defaultScore;
  }
  
  const scoredMetric = scoredMetrics.find(m => m.metric === metric);
  return scoredMetric?.score || defaultScore;
}

/**
 * Determine if a metric should be displayed based on its importance score
 * 
 * @param metric Financial metric to check
 * @param scoredMetrics Array of metrics with importance scores
 * @param threshold Minimum score threshold (metrics with scores >= threshold will be displayed)
 * @param displayAllMetrics Flag to bypass scoring and display all metrics
 * @returns Boolean indicating if the metric should be displayed
 */
export function shouldDisplayMetric(
  metric: FinancialMetric,
  scoredMetrics: MetricScore[] | null | undefined,
  threshold: number = 4,
  displayAllMetrics: boolean = false
): boolean {
  // Always display if bypass flag is true
  if (displayAllMetrics) {
    return true;
  }
  
  // Don't filter if no scored metrics are available
  if (!scoredMetrics) {
    return true;
  }
  
  const score = getMetricImportanceScore(metric, scoredMetrics);
  return score >= threshold;
}

/**
 * Get the data path for a specific metric
 * 
 * @param metric Financial metric
 * @returns Path to the metric data in the CompanyData object
 */
export function getMetricDataPath(metric: FinancialMetric): string | undefined {
  return METRIC_DATA_PATHS[metric];
}

/**
 * Sort an array of metrics by their importance scores
 * 
 * @param metrics Array of financial metrics to sort
 * @param scoredMetrics Array of metrics with importance scores
 * @returns Sorted array of financial metrics
 */
export function sortMetricsByImportance(
  metrics: FinancialMetric[],
  scoredMetrics: MetricScore[] | null | undefined
): FinancialMetric[] {
  if (!scoredMetrics) {
    return metrics;
  }
  
  return [...metrics].sort((a, b) => {
    const scoreA = getMetricImportanceScore(a, scoredMetrics);
    const scoreB = getMetricImportanceScore(b, scoredMetrics);
    return scoreB - scoreA;
  });
}

/**
 * Get the top N most important metrics from an array of metrics
 * 
 * @param metrics Array of financial metrics
 * @param scoredMetrics Array of metrics with importance scores
 * @param count Number of top metrics to return
 * @returns Array of the top most important metrics
 */
export function getTopMetrics(
  metrics: FinancialMetric[],
  scoredMetrics: MetricScore[] | null | undefined,
  count: number = 5
): FinancialMetric[] {
  const sorted = sortMetricsByImportance(metrics, scoredMetrics);
  return sorted.slice(0, count);
}

/**
 * Calculate the overall importance score for a set of metrics
 * 
 * @param metrics Array of financial metrics
 * @param scoredMetrics Array of metrics with importance scores
 * @returns Average importance score (1-10)
 */
export function calculateOverallImportance(
  metrics: FinancialMetric[],
  scoredMetrics: MetricScore[] | null | undefined
): number {
  if (!scoredMetrics || metrics.length === 0) {
    return 5; // Default mid-range importance
  }
  
  let totalScore = 0;
  let metricCount = 0;
  
  metrics.forEach(metric => {
    const score = getMetricImportanceScore(metric, scoredMetrics);
    totalScore += score;
    metricCount++;
  });
  
  return metricCount > 0 ? totalScore / metricCount : 5;
}

/**
 * Map of UI components to the metrics they display
 * This is used to calculate the importance score for each component
 */
export const COMPONENT_METRICS_MAP: Record<string, { 
  displayName: string;
  category: MetricCategory;
  metrics: FinancialMetric[];
}> = {
  // Stock Price Chart component
  stockPriceChart: {
    displayName: 'Stock Price History',
    category: MetricCategory.INVESTOR_VALUE,
    metrics: [
      FinancialMetric.PE_RATIO,
      FinancialMetric.PB_RATIO,
      FinancialMetric.DIVIDEND_YIELD,
      FinancialMetric.EV_EBITDA
    ]
  },
  
  // Key Performance Indicators component
  keyPerformanceIndicators: {
    displayName: 'KPIs',
    category: MetricCategory.OPERATIONAL_EFFICIENCY,
    metrics: [
      FinancialMetric.OPERATING_MARGIN,
      FinancialMetric.EBITDA_MARGIN,
      FinancialMetric.SGA_TO_REVENUE,
      FinancialMetric.REVENUE_PER_EMPLOYEE
    ]
  },
  
  // Financial Metrics component
  financialMetrics: {
    displayName: 'Financial Metrics', 
    category: MetricCategory.FINANCIAL_HEALTH,
    metrics: [
      FinancialMetric.DEBT_TO_EQUITY,
      FinancialMetric.CURRENT_RATIO,
      FinancialMetric.QUICK_RATIO,
      FinancialMetric.INTEREST_COVERAGE
    ]
  },
  
  // Ratio Analysis component
  ratioAnalysis: {
    displayName: 'Ratio Analysis',
    category: MetricCategory.INVESTOR_VALUE,
    metrics: [
      FinancialMetric.ROE,
      FinancialMetric.ROA,
      FinancialMetric.ROIC,
      FinancialMetric.EARNINGS_YIELD
    ]
  },
  
  // Key Financial Indicators component
  keyFinancialIndicators: {
    displayName: 'Key Financial Indicators',
    category: MetricCategory.FINANCIAL_HEALTH,
    metrics: [
      FinancialMetric.DEBT_TO_EBITDA,
      FinancialMetric.FINANCIAL_LEVERAGE,
      FinancialMetric.SOLVENCY_RATIO,
      FinancialMetric.ALTMAN_Z_SCORE
    ]
  },
  
  // R&D Metrics component
  researchMetrics: {
    displayName: 'Research & Innovation',
    category: MetricCategory.RESEARCH_INNOVATION,
    metrics: [
      FinancialMetric.RD_TO_REVENUE,
      FinancialMetric.CAPEX_TO_REVENUE,
      FinancialMetric.RD_EFFECTIVENESS,
      FinancialMetric.RETURN_ON_RESEARCH_CAPITAL
    ]
  }
};