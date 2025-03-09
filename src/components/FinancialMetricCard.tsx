import React from 'react';
import { 
  MetricProvider, 
  MetricScore 
} from '../utils/aiService';
import {
  FinancialMetric,
  MetricCategory
} from '../utils/config';
import { getMetricDataPath } from '../utils/metricUtils';
import { CompanyData } from '../types';

interface FinancialMetricCardProps {
  metric: FinancialMetric;
  company: CompanyData;
  displayLabel?: string;
  importance?: number; // 1-10 score for importance
  isHighlighted?: boolean;
  showRawData?: boolean;
}

/**
 * A component that displays a single financial metric with value and context
 * Implements the MetricProvider interface to enable AI importance ranking
 */
export class FinancialMetricCard extends React.Component<FinancialMetricCardProps> implements MetricProvider {
  // Implement MetricProvider interface
  getProvidedMetrics(): FinancialMetric[] {
    return [this.props.metric];
  }
  
  getMetricCategory(): MetricCategory {
    // Determine the category based on the metric
    if (Object.values(FinancialMetric).indexOf(this.props.metric) <= 14) {
      return MetricCategory.FINANCIAL_HEALTH;
    } else if (Object.values(FinancialMetric).indexOf(this.props.metric) <= 29) {
      return MetricCategory.OPERATIONAL_EFFICIENCY;
    } else if (Object.values(FinancialMetric).indexOf(this.props.metric) <= 45) {
      return MetricCategory.INVESTOR_VALUE;
    } else {
      return MetricCategory.RESEARCH_INNOVATION;
    }
  }
  
  getImportanceScore(scoredMetrics: MetricScore[]): number {
    const matchingMetric = scoredMetrics.find(m => m.metric === this.props.metric);
    return matchingMetric?.score || 5; // Default to medium importance
  }
  
  // Helper method to get the actual value from company data
  getMetricValue(): string {
    const { metric, company } = this.props;
    const dataPath = getMetricDataPath(metric);
    
    if (!dataPath) {
      return 'N/A';
    }
    
    // Navigate the data path to get the value
    try {
      const pathParts = dataPath.split('.');
      let value: any = company;
      
      for (const part of pathParts) {
        if (!value || typeof value !== 'object') {
          return 'N/A';
        }
        value = value[part];
      }
      
      // For array values (like time series data), use the most recent value
      if (Array.isArray(value) && value.length > 0) {
        // Assuming the data is sorted with the most recent first
        const latestValue = value[0]?.value;
        
        if (typeof latestValue === 'number') {
          // Format based on the metric type
          if (metric.includes('RATIO') || metric.includes('MARGIN')) {
            return latestValue.toFixed(2);
          } else if (metric.includes('PERCENTAGE') || metric.includes('YIELD')) {
            return `${(latestValue * 100).toFixed(1)}%`;
          } else if (latestValue > 1000000) {
            return `$${(latestValue / 1000000).toFixed(1)}M`;
          } else if (latestValue > 1000) {
            return `$${(latestValue / 1000).toFixed(1)}K`;
          } else {
            return latestValue.toFixed(2);
          }
        }
      }
      
      // For single values
      if (typeof value === 'number') {
        if (metric.includes('RATIO') || metric.includes('MARGIN')) {
          return value.toFixed(2);
        } else if (metric.includes('PERCENTAGE') || metric.includes('YIELD')) {
          return `${(value * 100).toFixed(1)}%`;
        } else {
          return value.toFixed(2);
        }
      }
      
      return value?.toString() || 'N/A';
    } catch (error) {
      console.error(`Error getting value for metric ${metric}:`, error);
      return 'Error';
    }
  }
  
  render() {
    const { 
      metric, 
      displayLabel, 
      importance = 5, 
      isHighlighted = false,
      showRawData = false
    } = this.props;
    
    // Format display label
    const label = displayLabel || metric.toString().replace(/_/g, ' ').toLowerCase();
    
    // Determine card styling based on importance and highlighted state
    const cardClasses = `
      p-4 rounded-lg border shadow-sm
      ${isHighlighted 
        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20' 
        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}
      ${importance >= 8 
        ? 'border-green-200 ring-1 ring-green-300 dark:ring-green-700' 
        : ''}
    `;
    
    // Get the metric value
    const value = this.getMetricValue();
    
    return (
      <div className={cardClasses}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm">
            {label}
          </h3>
          
          {/* Importance indicator */}
          {importance >= 8 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100">
              Critical
            </span>
          )}
        </div>
        
        {/* Metric value */}
        <div className="text-2xl font-bold text-gray-800 dark:text-white mt-3 mb-1">
          {value}
        </div>
        
        {/* Data path (for debugging) */}
        {showRawData && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Path: {getMetricDataPath(metric)}
          </div>
        )}
      </div>
    );
  }
}

export default FinancialMetricCard;