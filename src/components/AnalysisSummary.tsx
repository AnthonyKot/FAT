import React from 'react';
import { CompanyData } from '../types';
import { formatCurrencyAbbreviated, formatPercentage } from '../utils/formatters';

interface AnalysisSummaryProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ companyData, competitorData }) => {
  // Helper to get the most recent value by sorting data by year first
  const getLatestValue = (data: Array<{year: number, value: number}>) => {
    if (!data || data.length === 0) return 0;
    // Sort by year in descending order to get most recent first
    const sortedData = [...data].sort((a, b) => b.year - a.year);
    return sortedData[0]?.value ?? 0;
  };

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

  // Helper for colored comparison text
  const ColoredComparison = {
    better: (text: string) => <span className="font-medium text-green-600 dark:text-green-400">{text}</span>,
    worse: (text: string) => <span className="font-medium text-red-600 dark:text-red-400">{text}</span>,
    neutral: (text: string) => <span>{text}</span>
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-3">Financial Analysis Summary</h2>
      <div className="prose max-w-none text-gray-700 dark:text-dark-text-secondary">
        <p>
          {companyData.company.name} {competitorData ? `compared to ${competitorData.company.name} ` : ''}
          shows the following key financial characteristics:
        </p>
        
        <ul className="mt-2 space-y-2">
          <li>
            <strong>Revenue:</strong> {companyData.company.name} has annual revenue of {formatCurrencyAbbreviated(revenue1)}
            {competitorData && (
              <>, which is {revenue1 > revenue2 
                ? <span className="font-medium text-green-600 dark:text-green-400">higher</span> 
                : <span className="font-medium text-red-600 dark:text-red-400">lower</span>
              } than {competitorData.company.name}'s {formatCurrencyAbbreviated(revenue2)}
              </>
            )}.
            The company is growing at a rate of {formatPercentage(revenueGrowth1)} annually
            {competitorData && (
              <>, which is {revenueGrowth1 > revenueGrowth2 
                ? <span className="font-medium text-green-600 dark:text-green-400">faster</span> 
                : <span className="font-medium text-red-600 dark:text-red-400">slower</span>
              } than {competitorData.company.name}'s growth rate of {formatPercentage(revenueGrowth2)}
              </>
            )}.
          </li>
          
          <li>
            <strong>Profitability:</strong> With a net margin of {formatPercentage(netMargin1)} and ROE of {formatPercentage(roe1)},
            {competitorData ? (
              <> {companyData.company.name} {isNetMarginBetter && isROEBetter 
                ? <span className="font-bold text-green-600 dark:text-green-400">outperforms</span> 
                : <span className="font-bold text-red-600 dark:text-red-400">underperforms</span>
              } {competitorData.company.name} in terms of profitability metrics</>
            ) : (
              <> {companyData.company.name} demonstrates its ability to generate profits from its operations and shareholders' equity</>
            )}.
          </li>
          
          <li>
            <strong>Valuation:</strong> The P/E ratio of {peRatio1.toFixed(2)} indicates 
            {competitorData ? (
              isPEBetter ? (
                <> a <span className="font-medium text-green-600 dark:text-green-400">more attractive</span> valuation compared to {competitorData.company.name}'s P/E of {peRatio2.toFixed(2)}</>
              ) : (
                <> a <span className="font-medium text-red-600 dark:text-red-400">potentially higher</span> valuation compared to {competitorData.company.name}'s P/E of {peRatio2.toFixed(2)}</>
              )
            ) : (
              <> how the market currently values the company's earnings</>
            )}.
          </li>
          
          <li>
            <strong>Financial Health:</strong> With a debt-to-equity ratio of {debtToEquity1.toFixed(2)}, 
            {competitorData ? (
              isDebtToEquityBetter ? (
                <> {companyData.company.name} has a <span className="font-medium text-green-600 dark:text-green-400">lower</span> level of financial leverage compared to {competitorData.company.name}'s {debtToEquity2.toFixed(2)}, indicating <span className="font-medium text-green-600 dark:text-green-400">potentially lower financial risk</span></>
              ) : (
                <> {companyData.company.name} has a <span className="font-medium text-red-600 dark:text-red-400">higher</span> level of financial leverage compared to {competitorData.company.name}'s {debtToEquity2.toFixed(2)}, which may indicate <span className="font-medium text-red-600 dark:text-red-400">higher financial risk</span></>
              )
            ) : (
              <> {companyData.company.name} demonstrates this level of financial leverage</>
            )}.
          </li>
        </ul>
        
        {competitorData && (
          <p className="mt-4 font-medium">
            Overall assessment: {
              (isPEBetter && isROEBetter && isNetMarginBetter && isDebtToEquityBetter) ? (
                <>{companyData.company.name} appears to be in a <span className="font-bold text-green-600 dark:text-green-400">stronger financial position</span> compared to {competitorData.company.name} across all key metrics.</>
              ) : (isPEBetter || isROEBetter || isNetMarginBetter || isDebtToEquityBetter) ? (
                <>{companyData.company.name} shows <span className="font-bold text-yellow-600 dark:text-yellow-400">mixed performance</span> compared to {competitorData.company.name}, with <span className="font-bold text-green-600 dark:text-green-400">strengths</span> in some areas and <span className="font-bold text-red-600 dark:text-red-400">weaknesses</span> in others.</>
              ) : (
                <>{companyData.company.name} appears to be in a <span className="font-bold text-red-600 dark:text-red-400">weaker financial position</span> compared to {competitorData.company.name} across most metrics.</>
              )
            }
          </p>
        )}
        
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          This report provides a comparative analysis of financial metrics and performance indicators. Investors should conduct further research and consider other factors before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default AnalysisSummary;