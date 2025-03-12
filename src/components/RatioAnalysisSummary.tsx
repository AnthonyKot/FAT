import React from 'react';
import { CompanyData } from '../types';
import { formatPercentage } from '../utils/formatters';

interface RatioAnalysisSummaryProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const RatioAnalysisSummary: React.FC<RatioAnalysisSummaryProps> = ({ 
  companyData, 
  competitorData 
}) => {
  return (
    <div id="ratioAnalysis" className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Ratio Analysis Summary</h2>
      <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
        <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300">
          <p>
            This ratio analysis helps in assessing {companyData.company.name}'s financial performance
            {competitorData ? ` compared to ${competitorData.company.name}` : ''} across multiple dimensions:
          </p>
          <ul className="mt-2 space-y-2">
            <li>
              <strong className="text-gray-800 dark:text-gray-200">Valuation:</strong> {companyData.company.name}'s P/E ratio of {companyData.ratios.peRatio[0].value.toFixed(2)} indicates
              {competitorData ? (companyData.ratios.peRatio[0].value < competitorData.ratios.peRatio[0].value ?
                <span> a <span className="font-bold text-green-600 dark:text-green-400">more attractive valuation</span> compared to its competitor's {competitorData.ratios.peRatio[0].value.toFixed(2)}.</span> :
                <span> a <span className="font-bold text-red-600 dark:text-red-400">potentially overvalued position</span> relative to its competitor's {competitorData.ratios.peRatio[0].value.toFixed(2)}.</span>) :
                ' how the market currently values its earnings.'}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-gray-200">Profitability:</strong> With a net profit margin of {formatPercentage(companyData.ratios.netProfitMargin[0].value)},
              the company {competitorData ?
                (companyData.ratios.netProfitMargin[0].value > competitorData.ratios.netProfitMargin[0].value ?
                  <span>demonstrates <span className="font-bold text-green-600 dark:text-green-400">stronger profitability</span> than its competitor's {formatPercentage(competitorData.ratios.netProfitMargin[0].value)}.</span> :
                  <span>shows <span className="font-bold text-red-600 dark:text-red-400">lower profitability</span> compared to its competitor's {formatPercentage(competitorData.ratios.netProfitMargin[0].value)}.</span>) :
                'demonstrates its efficiency in converting revenue into actual profit.'}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-gray-200">Growth:</strong> The company's revenue is growing at {formatPercentage(companyData.ratios.revenueGrowth[0].value)} annually,
              which is {competitorData ?
                (companyData.ratios.revenueGrowth[0].value > competitorData.ratios.revenueGrowth[0].value ?
                  <span><span className="font-bold text-green-600 dark:text-green-400">faster</span> than its competitor.</span> :
                  <span><span className="font-bold text-red-600 dark:text-red-400">slower</span> than its competitor.</span>) :
                'an indicator of its market expansion capabilities.'}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-gray-200">Risk:</strong> With a debt-to-equity ratio of {companyData.ratios.debtToEquity[0].value.toFixed(2)},
              the company {competitorData ?
                (companyData.ratios.debtToEquity[0].value < competitorData.ratios.debtToEquity[0].value ?
                  <span>carries <span className="font-bold text-green-600 dark:text-green-400">less debt</span> relative to its equity compared to its competitor, indicating <span className="font-bold text-green-600 dark:text-green-400">lower financial risk</span>.</span> :
                  <span>carries <span className="font-bold text-red-600 dark:text-red-400">more debt</span> relative to its equity compared to its competitor, suggesting <span className="font-bold text-red-600 dark:text-red-400">higher financial risk</span>.</span>) :
                'has this level of debt relative to its equity.'}
            </li>
          </ul>
          <p className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="font-medium text-gray-800 dark:text-gray-200">Summary: </span>
            {competitorData ? (
              <span>
                Overall, when comparing {companyData.company.name} to {competitorData.company.name}, the analysis suggests that {
                  ((companyData.ratios.peRatio[0].value < competitorData.ratios.peRatio[0].value) &&
                   (companyData.ratios.netProfitMargin[0].value > competitorData.ratios.netProfitMargin[0].value)) ? (
                    <span>{companyData.company.name} may represent a <span className="font-bold text-green-600 dark:text-green-400">more attractive investment opportunity</span> with <span className="font-bold text-green-600 dark:text-green-400">better valuation</span> and <span className="font-bold text-green-600 dark:text-green-400">higher profitability</span>.</span>
                  ) : (
                    <span>investors should carefully weigh the <span className="font-bold text-yellow-600 dark:text-yellow-400">trade-offs</span> between valuation, growth, profitability, and risk when making investment decisions.</span>
                  )
                }
              </span>
            ) : (
              <span>This ratio analysis provides a comprehensive view of {companyData.company.name}'s financial health and performance. To gain further insights, consider comparing these metrics with industry averages and competitors.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatioAnalysisSummary;