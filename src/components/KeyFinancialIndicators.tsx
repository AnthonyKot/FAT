import React from 'react';
import { CompanyData } from '../types';
import { formatLargeNumber } from '../utils/formatters';

interface KeyFinancialIndicatorsProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const KeyFinancialIndicators: React.FC<KeyFinancialIndicatorsProps> = ({ 
  companyData, 
  competitorData 
}) => {
  // Operating Cash Flow calculation
  const renderOperatingCashFlow = () => {
    const latestOCF = companyData.cashFlow.operatingCashFlow[0];
    const prevOCF = companyData.cashFlow.operatingCashFlow[1];
    const changePercent = ((latestOCF.value - prevOCF.value) / Math.abs(prevOCF.value) * 100);
    const isPositive = changePercent > 0;
    
    // Competitor data
    let competitorChangePercent = null;
    let competitorValue = null;
    
    if (competitorData && competitorData.cashFlow.operatingCashFlow.length >= 2) {
      const compLatestOCF = competitorData.cashFlow.operatingCashFlow[0];
      const compPrevOCF = competitorData.cashFlow.operatingCashFlow[1];
      competitorChangePercent = ((compLatestOCF.value - compPrevOCF.value) / Math.abs(compPrevOCF.value) * 100);
      competitorValue = compLatestOCF.value;
    }

    return (
      <div className={`rounded-lg p-4 ${isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} flex flex-col`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Operating Cash Flow</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${isPositive ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
          </span>
        </div>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{formatLargeNumber(latestOCF.value)}</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
          vs {formatLargeNumber(prevOCF.value)} ({prevOCF.year})
        </p>
        
        {competitorData && competitorChangePercent !== null && (
          <div className="mt-2 text-xs border-t border-gray-200 dark:border-gray-700 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{competitorData.company.symbol}:</span>
              <span className={`font-medium ${competitorChangePercent > changePercent ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {competitorChangePercent > 0 ? '↑' : '↓'} {Math.abs(competitorChangePercent).toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 text-gray-500 dark:text-gray-400">
              {formatLargeNumber(competitorValue)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Free Cash Flow calculation
  const renderFreeCashFlow = () => {
    const latestFCF = companyData.cashFlow.freeCashFlow[0];
    const prevFCF = companyData.cashFlow.freeCashFlow[1];
    const changePercent = ((latestFCF.value - prevFCF.value) / Math.abs(prevFCF.value) * 100);
    const isPositive = changePercent > 0;
    
    // Competitor data
    let competitorChangePercent = null;
    let competitorValue = null;
    
    if (competitorData && competitorData.cashFlow.freeCashFlow.length >= 2) {
      const compLatestFCF = competitorData.cashFlow.freeCashFlow[0];
      const compPrevFCF = competitorData.cashFlow.freeCashFlow[1];
      competitorChangePercent = ((compLatestFCF.value - compPrevFCF.value) / Math.abs(compPrevFCF.value) * 100);
      competitorValue = compLatestFCF.value;
    }

    return (
      <div className={`rounded-lg p-4 ${isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} flex flex-col`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Free Cash Flow</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${isPositive ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
          </span>
        </div>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{formatLargeNumber(latestFCF.value)}</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
          vs {formatLargeNumber(prevFCF.value)} ({prevFCF.year})
        </p>
        
        {competitorData && competitorChangePercent !== null && (
          <div className="mt-2 text-xs border-t border-gray-200 dark:border-gray-700 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{competitorData.company.symbol}:</span>
              <span className={`font-medium ${competitorChangePercent > changePercent ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {competitorChangePercent > 0 ? '↑' : '↓'} {Math.abs(competitorChangePercent).toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 text-gray-500 dark:text-gray-400">
              {formatLargeNumber(competitorValue)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Cash Flow Margin calculation
  const renderCashFlowMargin = () => {
    const latestOCF = companyData.cashFlow.operatingCashFlow[0];
    const latestRevenue = companyData.incomeStatement.revenue[0];
    const prevOCF = companyData.cashFlow.operatingCashFlow[1];
    const prevRevenue = companyData.incomeStatement.revenue[1];

    const currentMargin = (latestOCF.value / latestRevenue.value * 100);
    const prevMargin = (prevOCF.value / prevRevenue.value * 100);
    const changePercent = currentMargin - prevMargin;
    const isPositive = changePercent > 0;
    
    // Competitor data
    let competitorCurrentMargin = null;
    let competitorChangePercent = null;
    
    if (competitorData && 
        competitorData.cashFlow.operatingCashFlow.length >= 2 && 
        competitorData.incomeStatement.revenue.length >= 2) {
      const compLatestOCF = competitorData.cashFlow.operatingCashFlow[0];
      const compLatestRevenue = competitorData.incomeStatement.revenue[0];
      const compPrevOCF = competitorData.cashFlow.operatingCashFlow[1];
      const compPrevRevenue = competitorData.incomeStatement.revenue[1];
      
      competitorCurrentMargin = (compLatestOCF.value / compLatestRevenue.value * 100);
      const competitorPrevMargin = (compPrevOCF.value / compPrevRevenue.value * 100);
      competitorChangePercent = competitorCurrentMargin - competitorPrevMargin;
    }

    return (
      <div className={`rounded-lg p-4 ${isPositive ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} flex flex-col`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Cash Flow Margin</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${isPositive ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}pp
          </span>
        </div>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{currentMargin.toFixed(1)}%</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
          vs {prevMargin.toFixed(1)}% ({prevOCF.year})
        </p>
        
        {competitorData && competitorCurrentMargin !== null && (
          <div className="mt-2 text-xs border-t border-gray-200 dark:border-gray-700 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{competitorData.company.symbol}:</span>
              <span className={`font-medium ${competitorCurrentMargin > currentMargin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {competitorCurrentMargin.toFixed(1)}%
              </span>
            </div>
            {competitorChangePercent !== null && (
              <div className="mt-1 text-gray-500 dark:text-gray-400">
                {competitorChangePercent > 0 ? '↑' : '↓'} {Math.abs(competitorChangePercent).toFixed(1)}pp
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Financial Indicators Summary
  const renderFinancialSummary = () => {
    // Extract all the necessary values for the summary
    const latestOCF = companyData.cashFlow.operatingCashFlow[0];
    const prevOCF = companyData.cashFlow.operatingCashFlow[1];
    const ocfChangePercent = ((latestOCF.value - prevOCF.value) / Math.abs(prevOCF.value) * 100);
    
    const latestFCF = companyData.cashFlow.freeCashFlow[0];
    const prevFCF = companyData.cashFlow.freeCashFlow[1];
    const fcfChangePercent = ((latestFCF.value - prevFCF.value) / Math.abs(prevFCF.value) * 100);
    
    const latestRevenue = companyData.incomeStatement.revenue[0];
    const cfMargin = (latestOCF.value / latestRevenue.value * 100);
    
    // Competitor data
    let compOcfChangePercent = null;
    let compFcfChangePercent = null;
    let compCfMargin = null;
    
    if (competitorData) {
      if (competitorData.cashFlow.operatingCashFlow.length >= 2) {
        const compLatestOCF = competitorData.cashFlow.operatingCashFlow[0];
        const compPrevOCF = competitorData.cashFlow.operatingCashFlow[1];
        compOcfChangePercent = ((compLatestOCF.value - compPrevOCF.value) / Math.abs(compPrevOCF.value) * 100);
      }
      
      if (competitorData.cashFlow.freeCashFlow.length >= 2) {
        const compLatestFCF = competitorData.cashFlow.freeCashFlow[0];
        const compPrevFCF = competitorData.cashFlow.freeCashFlow[1];
        compFcfChangePercent = ((compLatestFCF.value - compPrevFCF.value) / Math.abs(compPrevFCF.value) * 100);
      }
      
      if (competitorData.cashFlow.operatingCashFlow.length > 0 && competitorData.incomeStatement.revenue.length > 0) {
        const compLatestOCF = competitorData.cashFlow.operatingCashFlow[0];
        const compLatestRevenue = competitorData.incomeStatement.revenue[0];
        compCfMargin = (compLatestOCF.value / compLatestRevenue.value * 100);
      }
    }

    return (
      <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">Financial Indicators Summary</h3>
        <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300">
          <p>
            {companyData.company.name}'s cash flow metrics provide key insights into its operational efficiency and financial health:
          </p>
          <ul className="mt-2 space-y-2">
            <li>
              <strong className="text-gray-800 dark:text-gray-200">Operating Cash Flow:</strong> At {formatLargeNumber(latestOCF.value)}, the company's OCF has 
              {ocfChangePercent >= 0 ? 
                <span> <span className="font-medium text-green-600 dark:text-green-400">increased</span> by {Math.abs(ocfChangePercent).toFixed(1)}%</span> : 
                <span> <span className="font-medium text-red-600 dark:text-red-400">decreased</span> by {Math.abs(ocfChangePercent).toFixed(1)}%</span>} year-over-year
              {competitorData && compOcfChangePercent !== null ? (
                ocfChangePercent > compOcfChangePercent ?
                  <span>, <span className="font-bold text-green-600 dark:text-green-400">outperforming</span> {competitorData.company.symbol} which {compOcfChangePercent >= 0 ? 'grew' : 'declined'} by {Math.abs(compOcfChangePercent).toFixed(1)}%.</span> :
                  <span>, <span className="font-bold text-red-600 dark:text-red-400">underperforming</span> compared to {competitorData.company.symbol} which {compOcfChangePercent >= 0 ? 'grew' : 'declined'} by {Math.abs(compOcfChangePercent).toFixed(1)}%.</span>
              ) : '.'}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-gray-200">Free Cash Flow:</strong> The company generated {formatLargeNumber(latestFCF.value)} in FCF, 
              {fcfChangePercent >= 0 ? 
                <span> <span className="font-medium text-green-600 dark:text-green-400">increasing</span> by {Math.abs(fcfChangePercent).toFixed(1)}%</span> : 
                <span> <span className="font-medium text-red-600 dark:text-red-400">decreasing</span> by {Math.abs(fcfChangePercent).toFixed(1)}%</span>} year-over-year. 
              {competitorData && compFcfChangePercent !== null ? (
                fcfChangePercent > compFcfChangePercent ? 
                  <span>This <span className="font-bold text-green-600 dark:text-green-400">exceeds</span> {competitorData.company.symbol}'s {compFcfChangePercent >= 0 ? 'growth' : 'decline'} of {Math.abs(compFcfChangePercent).toFixed(1)}%.</span> :
                  <span>This <span className="font-bold text-red-600 dark:text-red-400">trails</span> {competitorData.company.symbol}'s {compFcfChangePercent >= 0 ? 'growth' : 'decline'} of {Math.abs(compFcfChangePercent).toFixed(1)}%.</span>
              ) : 'This indicates the company\'s ability to generate cash after accounting for capital expenditures.'}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-gray-200">Cash Flow Margin:</strong> At {cfMargin.toFixed(1)}%, this metric shows how efficiently the company converts revenue into cash flow
              {competitorData && compCfMargin !== null ? (
                cfMargin > compCfMargin ?
                  <span>. This is <span className="font-bold text-green-600 dark:text-green-400">higher</span> than {competitorData.company.symbol}'s margin of {compCfMargin.toFixed(1)}%, indicating <span className="font-bold text-green-600 dark:text-green-400">superior operational efficiency</span>.</span> :
                  <span>. This is <span className="font-bold text-red-600 dark:text-red-400">lower</span> than {competitorData.company.symbol}'s margin of {compCfMargin.toFixed(1)}%, suggesting room for <span className="font-bold text-red-600 dark:text-red-400">improved cash generation efficiency</span>.</span>
              ) : '.'}
            </li>
          </ul>
          {competitorData && (compOcfChangePercent !== null || compFcfChangePercent !== null || compCfMargin !== null) && (
            <p className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
              <span className="font-medium text-gray-800 dark:text-gray-200">Summary: </span>
              {
                ((ocfChangePercent > compOcfChangePercent) && (fcfChangePercent > compFcfChangePercent) && (cfMargin > compCfMargin)) ? (
                  <span>{companyData.company.name}'s cash flow metrics are <span className="font-bold text-green-600 dark:text-green-400">consistently stronger</span> than {competitorData.company.name}, suggesting <span className="font-bold text-green-600 dark:text-green-400">superior operational efficiency</span> and <span className="font-bold text-green-600 dark:text-green-400">financial health</span>.</span>
                ) : ((ocfChangePercent < compOcfChangePercent) && (fcfChangePercent < compFcfChangePercent) && (cfMargin < compCfMargin)) ? (
                  <span>{companyData.company.name}'s cash flow metrics are <span className="font-bold text-red-600 dark:text-red-400">consistently weaker</span> than {competitorData.company.name}, indicating <span className="font-bold text-red-600 dark:text-red-400">opportunities for improvement</span> in operational efficiency.</span>
                ) : (
                  <span>{companyData.company.name}'s cash flow metrics show <span className="font-bold text-yellow-600 dark:text-yellow-400">mixed performance</span> relative to {competitorData.company.name}, with <span className="font-bold text-green-600 dark:text-green-400">strengths</span> in some areas and <span className="font-bold text-red-600 dark:text-red-400">opportunities for improvement</span> in others.</span>
                )
              }
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Key Financial Indicators ({companyData.company.symbol})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {renderOperatingCashFlow()}
        {renderFreeCashFlow()}
        {renderCashFlowMargin()}
      </div>
      
      {renderFinancialSummary()}
    </div>
  );
};

export default KeyFinancialIndicators;