import React, { useRef, useEffect } from 'react';
import { Chart, Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartData as ChartJSData, ChartOptions } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import ChartTooltip from './ChartTooltip';
import { getTermDefinition } from '../utils/financialTerms';
import { getChartColors } from '../utils/chartColors';
import { formatCurrencyAbbreviated, formatLargeNumber } from '../utils/formatters';

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

// Update ChartData interface to handle different dataset structures 
interface Dataset {
  label?: string;
  data?: number[];
  values?: any[]; // Can be array of {year: number, value: number} or number[]
  competitor?: any[]; // For competitor data
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderDash?: number[];
  termKeys?: string[];
  [key: string]: any; // Allow other properties
}

interface FinancialChartProps {
  chartData: {
    labels?: string[];
    datasets?: Dataset[];
  };
  chartType: 'line' | 'bar';
  yAxisLabel?: string;
  tooltipPrefix?: string;
  tooltipSuffix?: string;
  tooltipCallback?: (value: number) => string;
  yAxisFormatType?: 'currency' | 'number' | 'none'; // Type of formatting for y-axis ticks
  title?: string;
  termKey?: string; // Key to find the financial term definition
  description?: string; // Optional custom description
  colorScheme?: string; // Optional color scheme to use
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  chartData,
  chartType,
  yAxisLabel,
  tooltipPrefix = '',
  tooltipSuffix = '',
  tooltipCallback,
  yAxisFormatType = 'none',
  title,
  termKey,
  description,
}) => {
  // Use more specific type for chartRef
  const chartRef = useRef<Chart<'line' | 'bar', number[], string> | null>(null);
  
  // Apply gradients for line charts
  useEffect(() => {
    if (chartType === 'line' && chartRef.current) {
      const chart = chartRef.current;
      
      if (chart && chart.canvas && chart.data && chart.data.datasets) {
        const ctx = chart.canvas.getContext('2d');
        if (ctx) {
          chart.data.datasets.forEach((dataset, index: number) => {
            // Type assertion since we know the structure from our chart setup
            const typedDataset = dataset as { fill?: boolean; backgroundColor?: string };
            if (typedDataset.fill) {
              // Set fallback color if none provided
              const baseColor = typedDataset.backgroundColor || 'rgba(59, 130, 246, 0.5)';
              const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
              gradient.addColorStop(0, baseColor);
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
              chart.data.datasets[index].backgroundColor = gradient;
            }
          });
          chart.update();
        }
      }
    }
  }, [chartType, chartData]);

  // Get default colors to use - ensure we have enough colors for all datasets
  const defaultColors = [
    { backgroundColor: 'rgba(59, 130, 246, 0.5)', borderColor: 'rgb(59, 130, 246)' },
    { backgroundColor: 'rgba(239, 68, 68, 0.5)', borderColor: 'rgb(239, 68, 68)' },
    { backgroundColor: 'rgba(16, 185, 129, 0.5)', borderColor: 'rgb(16, 185, 129)' },
    { backgroundColor: 'rgba(245, 158, 11, 0.5)', borderColor: 'rgb(245, 158, 11)' },
    { backgroundColor: 'rgba(139, 92, 246, 0.5)', borderColor: 'rgb(139, 92, 246)' },
    { backgroundColor: 'rgba(236, 72, 153, 0.5)', borderColor: 'rgb(236, 72, 153)' },
    { backgroundColor: 'rgba(52, 211, 153, 0.5)', borderColor: 'rgb(52, 211, 153)' },
    { backgroundColor: 'rgba(14, 165, 233, 0.5)', borderColor: 'rgb(14, 165, 233)' }
  ];
  
  // Create processed datasets array to handle both main and competitor data
  let processedDatasets: any[] = [];
  
  if (Array.isArray(chartData.datasets)) {
    // Process each dataset
    chartData.datasets.forEach((dataset, index) => {
      // Use predefined colors if dataset doesn't specify them
      const colorData = defaultColors[index % defaultColors.length];
      
      // Handle different data formats - some components pass 'values' instead of 'data'
      const values = dataset.values || dataset.data;
      
      // Process main company data
      if (Array.isArray(values)) {
        let dataPoints: number[] = [];
        
        if (values.length > 0 && typeof values[0] === 'object' && 'value' in values[0]) {
          // Handle financial data objects: { year: number, value: number }[]
          dataPoints = values
            .sort((a: any, b: any) => a.year - b.year)
            .map((item: any) => item.value);
        } else {
          // Handle simple number array
          dataPoints = values as number[];
        }
        
        // Add main company dataset
        processedDatasets.push({
          label: dataset.label || `Dataset ${index + 1}`,
          data: dataPoints,
          backgroundColor: dataset.backgroundColor || colorData.backgroundColor,
          borderColor: dataset.borderColor || colorData.borderColor,
          borderWidth: dataset.borderWidth || 2,
          tension: chartType === 'line' ? 0.1 : undefined, // Slight curve for line charts
          fill: chartType === 'line' ? true : undefined, // Fill area under line
        });
        
        // Process competitor data if it exists
        if (dataset.competitor && Array.isArray(dataset.competitor)) {
          let competitorDataPoints: number[] = [];
          
          if (dataset.competitor.length > 0 && typeof dataset.competitor[0] === 'object' && 'value' in dataset.competitor[0]) {
            // Handle financial data objects: { year: number, value: number }[]
            competitorDataPoints = dataset.competitor
              .sort((a: any, b: any) => a.year - b.year)
              .map((item: any) => item.value);
          } else {
            // Handle simple number array
            competitorDataPoints = dataset.competitor as number[];
          }
          
          // Only add competitor dataset if there's data
          if (competitorDataPoints.length > 0) {
            // Use a different color for the competitor
            const competitorColorIndex = (index + defaultColors.length / 2) % defaultColors.length;
            const competitorColorData = defaultColors[competitorColorIndex];
            
            processedDatasets.push({
              label: `Competitor ${dataset.label}`,
              data: competitorDataPoints,
              backgroundColor: competitorColorData.backgroundColor,
              borderColor: competitorColorData.borderColor,
              borderWidth: 2,
              borderDash: [5, 5], // Add dashed line for competitor
              tension: chartType === 'line' ? 0.1 : undefined,
              fill: chartType === 'line' ? true : undefined,
            });
          }
        }
      }
    });
  }
  
  // Convert custom data format to Chart.js format with consistent colors
  const data: ChartJSData<'line' | 'bar'> = {
    labels: chartData.labels || [],
    datasets: processedDatasets
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
        .replace(/[/\\]/g, ''); // Remove slashes
      
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

  // Define type for tooltip context
  interface TooltipContext {
    dataset: {
      label?: string;
    };
    parsed: {
      y: number;
    };
  }
  
  // Define type for tooltip title context
  interface TitleContext {
    label: string;
  }

  // Enhanced tooltip with term definitions
  const enhancedTooltip = {
    callbacks: {
      label: function(context: TooltipContext) {
        let label = context.dataset.label || '';
        if (label) {
          label += ': ';
        }
        
        const value = context.parsed.y;
        const datasetTermKey = getTermKeyFromLabel(context.dataset.label || '');
        
        // Check if this is likely a currency value
        const isCurrencyValue = 
          datasetTermKey?.includes('revenue') || 
          datasetTermKey?.includes('income') || 
          datasetTermKey?.includes('assets') || 
          datasetTermKey?.includes('liabilities') || 
          datasetTermKey?.includes('ebitda') ||
          tooltipPrefix === '$';
        
        if (tooltipCallback) {
          label += tooltipPrefix + tooltipCallback(value) + tooltipSuffix;
        } else if (isCurrencyValue) {
          label += formatCurrencyAbbreviated(value);
        } else {
          label += tooltipPrefix + value.toFixed(2) + tooltipSuffix;
        }

        // Add definition if available
        if (datasetTermKey) {
          const termDefinition = getTermDefinition(datasetTermKey);
          if (termDefinition) {
            return [label, '', termDefinition.definition];
          }
        }
        
        return label;
      },
      // Add a title with a definition
      title: function(context: TitleContext[]) {
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
        position: 'bottom' as const,
        align: 'center' as const,
      },
      tooltip: enhancedTooltip
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || '',
        },
        ticks: {
          // Format the y-axis ticks based on the yAxisFormatType
          callback: function(value) {
            if (yAxisFormatType === 'currency') {
              return formatCurrencyAbbreviated(value as number);
            } else if (yAxisFormatType === 'number') {
              return formatLargeNumber(value as number);
            }
            return value; // Default no formatting
          }
        }
      }
    }
  };

  return (
    <div className="w-full flex flex-col">
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
            data={data as ChartJSData<'line'>} 
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins?.legend,
                  labels: {
                    boxWidth: 10,
                    padding: 10,
                    usePointStyle: true,
                    color: 'rgb(55, 65, 81)',
                    filter: item => {
                      // Check for dark mode and update label colors
                      const darkMode = document.documentElement.classList.contains('dark');
                      if (darkMode) {
                        item.fontColor = 'rgb(229, 231, 235)'; // Dark mode text
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
            data={data as ChartJSData<'bar'>} 
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins?.legend,
                  position: 'bottom' as const,
                  labels: {
                    usePointStyle: true,
                    color: 'rgb(55, 65, 81)',
                    filter: (item) => {
                      // Check for dark mode and update label colors
                      const darkMode = document.documentElement.classList.contains('dark');
                      if (darkMode) {
                        item.fontColor = 'rgb(229, 231, 235)'; // Dark mode text
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
                    display: false,
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
    </div>
  );
};

export default FinancialChart;