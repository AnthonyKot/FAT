import React from 'react';
import { CompanyData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import ReportButton from './ReportButton';
import ChartTooltip from './ChartTooltip';
import FinancialChart from './FinancialChart';

interface ComparisonReportProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const ComparisonReport: React.FC<ComparisonReportProps> = ({ companyData, competitorData }) => {
  // Prepare data for key metrics comparison chart
  const prepareMetricsChart = () => {
    const getLatestValue = (data: any[]) => data[data.length - 1]?.value ?? 0;
    
    const metrics = [
      { key: 'Revenue', value1: getLatestValue(companyData.incomeStatement.revenue), value2: competitorData ? getLatestValue(competitorData.incomeStatement.revenue) : 0 },
      { key: 'Net Income', value1: getLatestValue(companyData.incomeStatement.netIncome), value2: competitorData ? getLatestValue(competitorData.incomeStatement.netIncome) : 0 },
      { key: 'EBITDA', value1: getLatestValue(companyData.incomeStatement.ebitda), value2: competitorData ? getLatestValue(competitorData.incomeStatement.ebitda) : 0 },
      { key: 'Total Assets', value1: getLatestValue(companyData.balanceSheet.totalAssets), value2: competitorData ? getLatestValue(competitorData.balanceSheet.totalAssets) : 0 },
      { key: 'Total Liabilities', value1: getLatestValue(companyData.balanceSheet.totalLiabilities), value2: competitorData ? getLatestValue(competitorData.balanceSheet.totalLiabilities) : 0 }
    ];
    
    // Scale values to make the chart more readable (e.g., millions)
    const scaleValues = (values: number[]) => {
      const max = Math.max(...values);
      if (max > 1_000_000_000) {
        return values.map(v => v / 1_000_000_000);
      } else if (max > 1_000_000) {
        return values.map(v => v / 1_000_000);
      } else if (max > 1_000) {
        return values.map(v => v / 1_000);
      }
      return values;
    };
    
    const values = metrics.map(m => m.value1);
    if (competitorData) {
      values.push(...metrics.map(m => m.value2));
    }
    
    const scaledValues = scaleValues(values);
    const unit = values[0] > 1_000_000_000 ? 'B' : values[0] > 1_000_000 ? 'M' : values[0] > 1_000 ? 'K' : '';
    
    return {
      labels: metrics.map(m => m.key),
      datasets: [
        {
          label: companyData.company.name,
          data: metrics.map((m, i) => scaledValues[i]),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        ...(competitorData ? [{
          label: competitorData.company.name,
          data: metrics.map((m, i) => scaledValues[i + metrics.length]),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }] : [])
      ]
    };
  };

  // Prepare data for the ratios comparison chart
  const prepareRatiosChart = () => {
    const getLatestValue = (data: any[]) => data[data.length - 1]?.value ?? 0;
    
    const ratios = [
      { key: 'P/E Ratio', value1: getLatestValue(companyData.ratios.peRatio), value2: competitorData ? getLatestValue(competitorData.ratios.peRatio) : 0 },
      { key: 'ROE', value1: getLatestValue(companyData.ratios.returnOnEquity) * 100, value2: competitorData ? getLatestValue(competitorData.ratios.returnOnEquity) * 100 : 0 },
      { key: 'Net Margin', value1: getLatestValue(companyData.ratios.netProfitMargin) * 100, value2: competitorData ? getLatestValue(competitorData.ratios.netProfitMargin) * 100 : 0 },
      { key: 'Debt to Equity', value1: getLatestValue(companyData.ratios.debtToEquity), value2: competitorData ? getLatestValue(competitorData.ratios.debtToEquity) : 0 },
      { key: 'Current Ratio', value1: getLatestValue(companyData.ratios.currentRatio), value2: competitorData ? getLatestValue(competitorData.ratios.currentRatio) : 0 }
    ];
    
    return {
      labels: ratios.map(r => r.key),
      datasets: [
        {
          label: companyData.company.name,
          data: ratios.map(r => r.value1),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        ...(competitorData ? [{
          label: competitorData.company.name,
          data: ratios.map(r => r.value2),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }] : [])
      ]
    };
  };

  const getLatestValue = (data: any[]) => data[data.length - 1]?.value ?? 0;

  // Comparison calculations
  const revenue1 = getLatestValue(companyData.incomeStatement.revenue);
  const revenue2 = competitorData ? getLatestValue(competitorData.incomeStatement.revenue) : 0;
  const revenueGrowth1 = getLatestValue(companyData.ratios.revenueGrowth);
  const revenueGrowth2 = competitorData ? getLatestValue(competitorData.ratios.revenueGrowth) : 0;
  
  const netIncome1 = getLatestValue(companyData.incomeStatement.netIncome);
  const netIncome2 = competitorData ? getLatestValue(competitorData.incomeStatement.netIncome) : 0;
  
  const peRatio1 = getLatestValue(companyData.ratios.peRatio);
  const peRatio2 = competitorData ? getLatestValue(competitorData.ratios.peRatio) : 0;
  const isPEBetter = peRatio1 < peRatio2;
  
  const roe1 = getLatestValue(companyData.ratios.returnOnEquity);
  const roe2 = competitorData ? getLatestValue(competitorData.ratios.returnOnEquity) : 0;
  const isROEBetter = roe1 > roe2;
  
  const netMargin1 = getLatestValue(companyData.ratios.netProfitMargin);
  const netMargin2 = competitorData ? getLatestValue(competitorData.ratios.netProfitMargin) : 0;
  const isNetMarginBetter = netMargin1 > netMargin2;
  
  const debtToEquity1 = getLatestValue(companyData.ratios.debtToEquity);
  const debtToEquity2 = competitorData ? getLatestValue(competitorData.ratios.debtToEquity) : 0;
  const isDebtToEquityBetter = debtToEquity1 < debtToEquity2;

  return (
    <div id="comparison-report" className="bg-white dark:bg-dark-surface rounded-lg shadow-lg dark:shadow-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">
          {competitorData 
            ? `Financial Comparison: ${companyData.company.name} vs ${competitorData.company.name}` 
            : `Financial Analysis: ${companyData.company.name}`}
        </h1>
        <ReportButton
          companyData={companyData}
          competitorData={competitorData}
          targetElementId="comparison-report"
          type="fullReport"
          buttonText="Download PDF Report"
        />
      </div>

      {/* Company Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Company Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400 mb-2">{companyData.company.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Industry:</span>
                <span className="font-medium dark:text-dark-text-primary">{companyData.company.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Market Cap:</span>
                <span className="font-medium dark:text-dark-text-primary">{formatCurrency(companyData.marketCap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Current Price:</span>
                <span className="font-medium dark:text-dark-text-primary">${companyData.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">52-Week Range:</span>
                <span className="font-medium dark:text-dark-text-primary">${companyData.yearLow.toFixed(2)} - ${companyData.yearHigh.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Dividend Yield:</span>
                <span className="font-medium dark:text-dark-text-primary">{formatPercentage(companyData.dividendYield)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-text-secondary">Beta:</span>
                <span className="font-medium dark:text-dark-text-primary">{companyData.beta.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {competitorData && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">{competitorData.company.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Industry:</span>
                  <span className="font-medium dark:text-dark-text-primary">{competitorData.company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Market Cap:</span>
                  <span className="font-medium dark:text-dark-text-primary">{formatCurrency(competitorData.marketCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Current Price:</span>
                  <span className="font-medium dark:text-dark-text-primary">${competitorData.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">52-Week Range:</span>
                  <span className="font-medium dark:text-dark-text-primary">${competitorData.yearLow.toFixed(2)} - ${competitorData.yearHigh.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Dividend Yield:</span>
                  <span className="font-medium dark:text-dark-text-primary">{formatPercentage(competitorData.dividendYield)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Beta:</span>
                  <span className="font-medium dark:text-dark-text-primary">{competitorData.beta.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">Key Financial Metrics</h2>
          <ReportButton
            companyData={companyData}
            competitorData={competitorData}
            targetElementId="key-metrics-chart"
            type="chartOnly"
          />
        </div>
        
        <div id="key-metrics-chart" className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <FinancialChart
            chartData={prepareMetricsChart()}
            chartType="bar"
            title="Key Financial Metrics"
            termKey="revenue"
            description="Comparison of key financial metrics between the companies. Values are shown in billions or millions for readability."
          />
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 dark:text-dark-text-primary mb-2">Revenue & Growth</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                    <ChartTooltip title="Revenue" termKey="revenue" size="sm" />
                  </span>
                  <div className="text-sm">
                    <span className="font-medium text-blue-700 dark:text-blue-400">{formatCurrency(revenue1)}</span>
                    {competitorData && (
                      <span className="ml-2 text-red-700 dark:text-red-400">vs {formatCurrency(revenue2)}</span>
                    )}
                  </div>
                </div>
                {competitorData && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(revenue1 / (revenue1 + revenue2)) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                    <ChartTooltip title="Revenue Growth" termKey="revenueGrowth" size="sm" />
                  </span>
                  <div className="text-sm">
                    <span className="font-medium text-blue-700 dark:text-blue-400">{formatPercentage(revenueGrowth1)}</span>
                    {competitorData && (
                      <span className="ml-2 text-red-700 dark:text-red-400">vs {formatPercentage(revenueGrowth2)}</span>
                    )}
                  </div>
                </div>
                {competitorData && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${revenueGrowth1 > revenueGrowth2 ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                      style={{ width: `${(revenueGrowth1 / Math.max(revenueGrowth1, revenueGrowth2)) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                    <ChartTooltip title="Net Income" termKey="netIncome" size="sm" />
                  </span>
                  <div className="text-sm">
                    <span className="font-medium text-blue-700 dark:text-blue-400">{formatCurrency(netIncome1)}</span>
                    {competitorData && (
                      <span className="ml-2 text-red-700 dark:text-red-400">vs {formatCurrency(netIncome2)}</span>
                    )}
                  </div>
                </div>
                {competitorData && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(netIncome1 / (netIncome1 + netIncome2)) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 dark:text-dark-text-primary mb-2">Key Ratios</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                    <ChartTooltip title="P/E Ratio" termKey="peRatio" size="sm" />
                  </span>
                  <div className="text-sm">
                    <span className="font-medium text-blue-700 dark:text-blue-400">{peRatio1.toFixed(2)}</span>
                    {competitorData && (
                      <span className="ml-2 text-red-700 dark:text-red-400">vs {peRatio2.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                {competitorData && (
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isPEBetter ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                        style={{ width: `${(Math.min(peRatio1, peRatio2) / Math.max(peRatio1, peRatio2)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`ml-2 text-xs ${isPEBetter ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {isPEBetter ? 'Better' : 'Worse'}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                    <ChartTooltip title="ROE" termKey="returnOnEquity" size="sm" />
                  </span>
                  <div className="text-sm">
                    <span className="font-medium text-blue-700 dark:text-blue-400">{formatPercentage(roe1)}</span>
                    {competitorData && (
                      <span className="ml-2 text-red-700 dark:text-red-400">vs {formatPercentage(roe2)}</span>
                    )}
                  </div>
                </div>
                {competitorData && (
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isROEBetter ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                        style={{ width: `${(roe1 / Math.max(roe1, roe2)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`ml-2 text-xs ${isROEBetter ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {isROEBetter ? 'Better' : 'Worse'}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-dark-text-secondary text-sm">
                    <ChartTooltip title="Net Margin" termKey="netProfitMargin" size="sm" />
                  </span>
                  <div className="text-sm">
                    <span className="font-medium text-blue-700 dark:text-blue-400">{formatPercentage(netMargin1)}</span>
                    {competitorData && (
                      <span className="ml-2 text-red-700 dark:text-red-400">vs {formatPercentage(netMargin2)}</span>
                    )}
                  </div>
                </div>
                {competitorData && (
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isNetMarginBetter ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                        style={{ width: `${(netMargin1 / Math.max(netMargin1, netMargin2)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`ml-2 text-xs ${isNetMarginBetter ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {isNetMarginBetter ? 'Better' : 'Worse'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">Financial Ratios</h2>
          <ReportButton
            companyData={companyData}
            competitorData={competitorData}
            targetElementId="ratios-chart"
            type="chartOnly"
          />
        </div>
        
        <div id="ratios-chart" className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <FinancialChart
            chartData={prepareRatiosChart()}
            chartType="bar"
            title="Financial Ratios"
            termKey="peRatio"
            description="Comparison of key financial ratios between the companies. For P/E Ratio and Debt to Equity, lower values are generally better. For ROE, Net Margin, and Current Ratio, higher values are generally better."
          />
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-3">Financial Analysis Summary</h2>
        <div className="prose max-w-none text-gray-700 dark:text-dark-text-secondary">
          <p>
            {companyData.company.name} {competitorData ? `compared to ${competitorData.company.name} ` : ''}
            shows the following key financial characteristics:
          </p>
          
          <ul className="mt-2 space-y-2">
            <li>
              <strong>Revenue:</strong> {companyData.company.name} has annual revenue of {formatCurrency(revenue1)}
              {competitorData ? `, which is ${revenue1 > revenue2 ? 'higher' : 'lower'} than ${competitorData.company.name}'s ${formatCurrency(revenue2)}` : ''}.
              The company is growing at a rate of {formatPercentage(revenueGrowth1)} annually
              {competitorData ? `, which is ${revenueGrowth1 > revenueGrowth2 ? 'faster' : 'slower'} than ${competitorData.company.name}'s growth rate of ${formatPercentage(revenueGrowth2)}` : ''}.
            </li>
            
            <li>
              <strong>Profitability:</strong> With a net margin of {formatPercentage(netMargin1)} and ROE of {formatPercentage(roe1)},
              {competitorData ? ` ${companyData.company.name} ${isNetMarginBetter && isROEBetter ? 'outperforms' : 'underperforms'} ${competitorData.company.name} in terms of profitability metrics` : 
              ` ${companyData.company.name} demonstrates its ability to generate profits from its operations and shareholders' equity`}.
            </li>
            
            <li>
              <strong>Valuation:</strong> The P/E ratio of {peRatio1.toFixed(2)} indicates 
              {competitorData ? 
                (isPEBetter ? 
                  ` a more attractive valuation compared to ${competitorData.company.name}'s P/E of ${peRatio2.toFixed(2)}` : 
                  ` a potentially higher valuation compared to ${competitorData.company.name}'s P/E of ${peRatio2.toFixed(2)}`) : 
                ` how the market currently values the company's earnings`}.
            </li>
            
            <li>
              <strong>Financial Health:</strong> With a debt-to-equity ratio of {debtToEquity1.toFixed(2)}, 
              {competitorData ? 
                (isDebtToEquityBetter ? 
                  ` ${companyData.company.name} has a lower level of financial leverage compared to ${competitorData.company.name}'s ${debtToEquity2.toFixed(2)}, indicating potentially lower financial risk` : 
                  ` ${companyData.company.name} has a higher level of financial leverage compared to ${competitorData.company.name}'s ${debtToEquity2.toFixed(2)}, which may indicate higher financial risk`) : 
                ` ${companyData.company.name} demonstrates this level of financial leverage`}.
            </li>
          </ul>
          
          {competitorData && (
            <p className="mt-4 font-medium">
              Overall assessment: {
                (isPEBetter && isROEBetter && isNetMarginBetter && isDebtToEquityBetter) ? 
                  `${companyData.company.name} appears to be in a stronger financial position compared to ${competitorData.company.name} across all key metrics.` :
                (isPEBetter || isROEBetter || isNetMarginBetter || isDebtToEquityBetter) ?
                  `${companyData.company.name} shows mixed performance compared to ${competitorData.company.name}, with strengths in some areas and weaknesses in others.` :
                  `${companyData.company.name} appears to be in a weaker financial position compared to ${competitorData.company.name} across most metrics.`
              }
            </p>
          )}
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            This report provides a comparative analysis of financial metrics and performance indicators. Investors should conduct further research and consider other factors before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonReport;