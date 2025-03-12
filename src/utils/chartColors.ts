/**
 * This file provides a consistent color palette for all charts in the application
 * It includes primary and secondary colors for the main company and competitor,
 * as well as a set of category colors for different metrics
 */

// Primary company colors
export const companyColors = {
  primary: {
    fill: 'rgba(59, 130, 246, 0.5)',   // Blue
    border: 'rgb(59, 130, 246)',
  },
  secondary: {
    fill: 'rgba(239, 68, 68, 0.5)',    // Red
    border: 'rgb(239, 68, 68)',
  }
};

// Category colors for different metrics
export const categoryColors = [
  {
    fill: 'rgba(16, 185, 129, 0.5)',   // Green
    border: 'rgb(16, 185, 129)'
  },
  {
    fill: 'rgba(245, 158, 11, 0.5)',   // Amber
    border: 'rgb(245, 158, 11)'
  },
  {
    fill: 'rgba(139, 92, 246, 0.5)',   // Purple
    border: 'rgb(139, 92, 246)'
  },
  {
    fill: 'rgba(236, 72, 153, 0.5)',   // Pink
    border: 'rgb(236, 72, 153)'
  },
  {
    fill: 'rgba(52, 211, 153, 0.5)',   // Emerald
    border: 'rgb(52, 211, 153)'
  },
  {
    fill: 'rgba(14, 165, 233, 0.5)',   // Sky
    border: 'rgb(14, 165, 233)'
  },
  {
    fill: 'rgba(251, 113, 133, 0.5)',  // Rose
    border: 'rgb(251, 113, 133)'
  },
  {
    fill: 'rgba(168, 85, 247, 0.5)',   // Fuchsia
    border: 'rgb(168, 85, 247)'
  }
];

// Color scheme for different chart types
export const chartColorSchemes = {
  // Income statement
  income: [
    { fill: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },  // Revenue (Green)
    { fill: 'rgba(245, 158, 11, 0.5)', border: 'rgb(245, 158, 11)' },  // Cost of Revenue (Amber)
    { fill: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },  // Gross Profit (Blue)
    { fill: 'rgba(139, 92, 246, 0.5)', border: 'rgb(139, 92, 246)' },  // Operating Income (Purple)
    { fill: 'rgba(236, 72, 153, 0.5)', border: 'rgb(236, 72, 153)' },  // Net Income (Pink)
  ],
  
  // Balance sheet
  balance: [
    { fill: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },  // Assets (Green)
    { fill: 'rgba(239, 68, 68, 0.5)', border: 'rgb(239, 68, 68)' },    // Liabilities (Red)
    { fill: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },  // Equity (Blue)
  ],
  
  // Cash flow
  cashflow: [
    { fill: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },  // Operating Cash Flow (Green)
    { fill: 'rgba(245, 158, 11, 0.5)', border: 'rgb(245, 158, 11)' },  // Investing Cash Flow (Amber)
    { fill: 'rgba(139, 92, 246, 0.5)', border: 'rgb(139, 92, 246)' },  // Financing Cash Flow (Purple)
    { fill: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },  // Free Cash Flow (Blue)
  ],
  
  // Ratios - Valuation
  valuation: [
    { fill: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },  // P/E Ratio (Blue)
    { fill: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },  // P/B Ratio (Green)
    { fill: 'rgba(245, 158, 11, 0.5)', border: 'rgb(245, 158, 11)' },  // P/S Ratio (Amber)
    { fill: 'rgba(139, 92, 246, 0.5)', border: 'rgb(139, 92, 246)' },  // EV/EBITDA (Purple)
  ],
  
  // Ratios - Profitability
  profitability: [
    { fill: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },  // ROE (Blue)
    { fill: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },  // ROA (Green)
    { fill: 'rgba(245, 158, 11, 0.5)', border: 'rgb(245, 158, 11)' },  // Net Margin (Amber)
    { fill: 'rgba(139, 92, 246, 0.5)', border: 'rgb(139, 92, 246)' },  // Gross Margin (Purple)
  ],
  
  // Ratios - Growth
  growth: [
    { fill: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },  // Revenue Growth (Blue)
    { fill: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },  // EPS Growth (Green)
  ],
  
  // Ratios - Risk
  risk: [
    { fill: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },  // Debt to Equity (Blue)
    { fill: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },  // Current Ratio (Green)
    { fill: 'rgba(245, 158, 11, 0.5)', border: 'rgb(245, 158, 11)' },  // Quick Ratio (Amber)
  ],
  
  // Ratios - Efficiency
  efficiency: [
    { fill: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },  // Asset Turnover (Blue)
    { fill: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },  // Inventory Turnover (Green)
  ],
};

// Get colors for competitor with same scheme but different appearance
export const getCompetitorColors = (colors: Array<{fill: string, border: string}>) => {
  return colors.map(color => ({
    fill: color.fill,       // Keep same fill color but can be adjusted if needed
    border: color.border,
    borderDash: [5, 5]      // Add dashed lines to distinguish competitor
  }));
};

// Helper to get a color for a specific index, ensuring we cycle through available colors
export const getChartColors = (
  colorScheme?: 'income' | 'balance' | 'cashflow' | 'valuation' | 'profitability' | 'growth' | 'risk' | 'efficiency'
) => {
  if (!colorScheme) return [companyColors.primary, companyColors.secondary];

  const colors = chartColorSchemes[colorScheme];
  return colors || [companyColors.primary, companyColors.secondary];
};

export const getColorByIndex = (index: number): {fill: string, border: string} => {
  return categoryColors[index % categoryColors.length];
};

// Generate a gradient for line charts
export const generateGradient = (ctx: CanvasRenderingContext2D, color: string) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  return gradient;
};

// Get colors for competitor with same scheme but different appearance
export const getCompetitorColors = (colors: Array<{fill: string, border: string}>) => {
  return colors.map(color => ({
    fill: color.fill,       // Keep same fill color but can be adjusted if needed
    border: color.border,
    borderDash: [5, 5]      // Add dashed lines to distinguish competitor
  }));
};