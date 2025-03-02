import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartData as ChartJSData, ChartOptions } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { ChartData } from '../types';
import ChartTooltip from './ChartTooltip';
import { getTermDefinition } from '../utils/financialTerms';
import { chartColorSchemes, getColorByIndex, getCompetitorColors } from '../utils/chartColors';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialChartProps {
  chartData: ChartData;
  chartType: 'line' | 'bar';
  yAxisLabel?: string;
  tooltipPrefix?: string;
  tooltipSuffix?: string;
  tooltipCallback?: (value: number) => string;
  title?: string;
  termKey?: string; // Key to find the financial term definition
  description?: string; // Optional custom description
  colorScheme?: 'income' | 'balance' | 'cashflow' | 'valuation' | 'profitability' | 'growth' | 'risk' | 'efficiency';
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  chartData,
  chartType,
  yAxisLabel,
  tooltipPrefix = '',
  tooltipSuffix = '',
  tooltipCallback,
  title,
  termKey,
  description,
  colorScheme
}) => {
  const chartRef = useRef<any>(null);
  
  // Apply consistent colors based on the colorScheme prop or default to index-based colors
  const getChartColors = () => {
    // Get datasets separated by primary company and competitor
    const primaryDatasets = chartData.datasets.filter(ds => !ds.label?.includes(' - ') || !ds.label?.includes(' vs '));
    const competitorDatasets = chartData.datasets.filter(ds => ds.label?.includes(' - ') || ds.label?.includes(' vs '));
    
    // Determine colors based on colorScheme or fallback to default pattern
    let colors: Array<{fill: string, border: string}> = [];
    
    if (colorScheme && chartColorSchemes[colorScheme]) {
      // Use predefined color scheme if specified
      colors = [...chartColorSchemes[colorScheme]];
    } else {
      // Fallback to getting colors by index
      colors = primaryDatasets.map((_, index) => getColorByIndex(index));
    }
    
    // Apply colors to primary datasets
    const coloredPrimaryDatasets = primaryDatasets.map((dataset, index) => {
      const colorIndex = index % colors.length;
      return {
        ...dataset,
        backgroundColor: colors[colorIndex].fill,
        borderColor: colors[colorIndex].border,
        borderWidth: dataset.borderWidth || 2,
      };
    });
    
    // Apply colors to competitor datasets with dashed lines
    const coloredCompetitorDatasets = competitorDatasets.map((dataset, index) => {
      const colorIndex = index % colors.length;
      return {
        ...dataset,
        backgroundColor: colors[colorIndex].fill,
        borderColor: colors[colorIndex].border,
        borderWidth: dataset.borderWidth || 2,
        borderDash: [5, 5], // Add dashed lines to distinguish competitor data
      };
    });
    
    return [...coloredPrimaryDatasets, ...coloredCompetitorDatasets];
  };
  
  // Apply gradients for line charts
  useEffect(() => {
    if (chartType === 'line' && chartRef.current) {
      const chart = chartRef.current;
      
      if (chart && chart.canvas && chart.data && chart.data.datasets) {
        const ctx = chart.canvas.getContext('2d');
        if (ctx) {
          chart.data.datasets.forEach((dataset: any, index: number) => {
            if (dataset.fill) {
              const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
              gradient.addColorStop(0, dataset.backgroundColor);
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
              chart.data.datasets[index].backgroundColor = gradient;
            }
          });
          chart.update();
        }
      }
    }
  }, [chartType, chartData]);

  // Convert our custom data format to Chart.js format with consistent colors
  const data: ChartJSData<'line' | 'bar'> = {
    labels: chartData.labels,
    datasets: getChartColors().map(dataset => ({
      ...dataset,
      tension: chartType === 'line' ? 0.1 : undefined, // Slight curve for line charts
      fill: chartType === 'line' ? true : undefined, // Fill area under line
    }))
  };

  // Extract the term key from label if not provided
  const getTermKeyFromLabel = (label: string): string | undefined => {
    // Try to extract the term from a label like "Company Name - P/E Ratio"
    const match = label.match(/- (.+)$/);
    if (match && match[1]) {
      const term = match[1].trim();
      // Convert term to camelCase
      const camelCase = term
        .replace(/\s(.)/g, ($1) => $1.toUpperCase())
        .replace(/\s/g, '')
        .replace(/^(.)/, ($1) => $1.toLowerCase())
        .replace(/[\/\\]/g, ''); // Remove slashes
      
      // Special handling for commonly used terms
      if (term.includes('P/E') || term === 'PE Ratio') return 'peRatio';
      if (term.includes('P/B') || term === 'PB Ratio') return 'pbRatio';
      if (term.includes('P/S') || term === 'PS Ratio') return 'psRatio';
      if (term.includes('EV/EBITDA')) return 'evToEbitda';
      if (term === 'ROE') return 'returnOnEquity';
      if (term === 'ROA') return 'returnOnAssets';
      
      return camelCase;
    }
    return undefined;
  };

  // Enhanced tooltip with term definitions
  const enhancedTooltip = {
    callbacks: {
      label: function(context: any) {
        let label = context.dataset.label || '';
        if (label) {
          label += ': ';
        }
        
        let value = context.parsed.y;
        if (tooltipCallback) {
          label += tooltipPrefix + tooltipCallback(value) + tooltipSuffix;
        } else {
          label += tooltipPrefix + value.toFixed(2) + tooltipSuffix;
        }

        // Add definition if available
        const datasetTermKey = getTermKeyFromLabel(context.dataset.label || '');
        if (datasetTermKey) {
          const termDefinition = getTermDefinition(datasetTermKey);
          if (termDefinition) {
            return [label, '', termDefinition.definition];
          }
        }
        
        return label;
      },
      // Add a title with a definition
      title: function(context: any) {
        return context[0].label;
      }
    }
  };

  // Configure chart options
  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: enhancedTooltip as any
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || '',
        }
      }
    }
  };

  return (
    <div className="w-full">
      {title && termKey && (
        <div className="mb-3 flex items-center">
          <ChartTooltip title={title} termKey={termKey} />
        </div>
      )}
      
      {description && (
        <div className="mb-3 text-sm text-gray-600 dark:text-dark-text-secondary">
          {description}
        </div>
      )}
      
      <div className="w-full h-48 sm:h-56 md:h-64">
        {chartType === 'line' ? (
          <Line 
            ref={chartRef}
            data={data} 
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins?.legend,
                  labels: {
                    boxWidth: 10,
                    padding: 10,
                    usePointStyle: true, // Use points instead of rectangles for better visibility
                    color: 'rgb(55, 65, 81)', // Light mode text
                    filter: (item, chart) => {
                      // Check for dark mode and update label colors
                      const darkMode = document.documentElement.classList.contains('dark');
                      if (darkMode) {
                        item.color = 'rgb(229, 231, 235)'; // Dark mode text
                      }
                      return true;
                    },
                    font: {
                      size: window.innerWidth < 640 ? 10 : 12
                    }
                  }
                }
              },
              scales: {
                ...options.scales,
                x: {
                  grid: {
                    color: document.documentElement.classList.contains('dark') 
                      ? 'rgba(255, 255, 255, 0.1)' // Dark mode grid lines
                      : 'rgba(0, 0, 0, 0.05)',     // Light mode grid lines
                  },
                  ticks: {
                    color: document.documentElement.classList.contains('dark')
                      ? 'rgba(255, 255, 255, 0.7)' // Dark mode tick labels
                      : 'rgba(0, 0, 0, 0.7)',      // Light mode tick labels
                    font: {
                      size: window.innerWidth < 640 ? 8 : 12
                    }
                  }
                },
                y: {
                  ...options.scales?.y,
                  grid: {
                    color: document.documentElement.classList.contains('dark') 
                      ? 'rgba(255, 255, 255, 0.1)' // Dark mode grid lines
                      : 'rgba(0, 0, 0, 0.05)',     // Light mode grid lines
                  },
                  ticks: {
                    color: document.documentElement.classList.contains('dark')
                      ? 'rgba(255, 255, 255, 0.7)' // Dark mode tick labels
                      : 'rgba(0, 0, 0, 0.7)',      // Light mode tick labels
                    font: {
                      size: window.innerWidth < 640 ? 8 : 12
                    }
                  }
                }
              }
            }} 
          />
        ) : (
          <Bar 
            ref={chartRef}
            data={data} 
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins?.legend,
                  position: 'top' as const,
                  align: 'start' as const,
                  labels: {
                    boxWidth: 12,
                    padding: 15,
                    usePointStyle: true, // Use points instead of rectangles for better visibility
                    color: 'rgb(55, 65, 81)', // Light mode text
                    filter: (item, chart) => {
                      // Check for dark mode and update label colors
                      const darkMode = document.documentElement.classList.contains('dark');
                      if (darkMode) {
                        item.color = 'rgb(229, 231, 235)'; // Dark mode text
                      }
                      return true;
                    },
                    font: {
                      size: window.innerWidth < 640 ? 10 : 12
                    }
                  }
                }
              },
              scales: {
                ...options.scales,
                x: {
                  grid: {
                    display: false, // Hide x grid lines for bar charts for cleaner look
                  },
                  ticks: {
                    color: document.documentElement.classList.contains('dark')
                      ? 'rgba(255, 255, 255, 0.7)' // Dark mode tick labels
                      : 'rgba(0, 0, 0, 0.7)',      // Light mode tick labels
                    font: {
                      size: window.innerWidth < 640 ? 8 : 12
                    }
                  }
                },
                y: {
                  ...options.scales?.y,
                  grid: {
                    color: document.documentElement.classList.contains('dark') 
                      ? 'rgba(255, 255, 255, 0.1)' // Dark mode grid lines
                      : 'rgba(0, 0, 0, 0.05)',     // Light mode grid lines
                  },
                  ticks: {
                    color: document.documentElement.classList.contains('dark')
                      ? 'rgba(255, 255, 255, 0.7)' // Dark mode tick labels
                      : 'rgba(0, 0, 0, 0.7)',      // Light mode tick labels
                    font: {
                      size: window.innerWidth < 640 ? 8 : 12
                    }
                  }
                }
              }
            }} 
          />
        )}
      </div>
      
      {/* Enhanced legend with more accessible colored boxes */}
      <div className="mt-2 flex flex-wrap gap-3 justify-center text-xs text-gray-600 dark:text-dark-text-secondary">
        {data.datasets.map((dataset, index) => (
          <div key={index} className="flex items-center">
            <span 
              className="inline-block w-3 h-3 mr-1 rounded-sm" 
              style={{ 
                backgroundColor: typeof dataset.borderColor === 'string' ? dataset.borderColor : '',
                border: dataset.borderDash ? '1px dashed #888' : 'none',
              }}
            />
            <span>{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialChart;