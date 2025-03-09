import React from 'react';
import { CompanyData } from '../types';

interface CashFlowAnalysisProps {
  companyData: CompanyData;
}

const CashFlowAnalysis: React.FC<CashFlowAnalysisProps> = ({ companyData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <h3 className="text-md font-medium text-gray-800 dark:text-dark-text-primary mb-3">Cash Flow Efficiency</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Operating CF to Revenue</span>
              <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                {(companyData.cashFlow.operatingCashFlow[companyData.cashFlow.operatingCashFlow.length - 1].value /
                  companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1].value * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (companyData.cashFlow.operatingCashFlow[companyData.cashFlow.operatingCashFlow.length - 1].value /
                    companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1].value * 100))}%`
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Free CF to Operating CF</span>
              <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                {(companyData.cashFlow.freeCashFlow[companyData.cashFlow.freeCashFlow.length - 1].value /
                  companyData.cashFlow.operatingCashFlow[companyData.cashFlow.operatingCashFlow.length - 1].value * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (companyData.cashFlow.freeCashFlow[companyData.cashFlow.freeCashFlow.length - 1].value /
                    companyData.cashFlow.operatingCashFlow[companyData.cashFlow.operatingCashFlow.length - 1].value * 100))}%`
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">CapEx to Revenue</span>
              <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                {(Math.abs(companyData.cashFlow.capitalExpenditures[companyData.cashFlow.capitalExpenditures.length - 1].value) /
                  companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1].value * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (Math.abs(companyData.cashFlow.capitalExpenditures[companyData.cashFlow.capitalExpenditures.length - 1].value) /
                    companyData.incomeStatement.revenue[companyData.incomeStatement.revenue.length - 1].value * 100))}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium text-gray-800 dark:text-dark-text-primary mb-3">Cash Flow Trends</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-blue-800 dark:text-blue-200">1</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
              <span className="font-medium text-gray-900 dark:text-dark-text-primary">Operating Cash Flow:</span> {
                companyData.cashFlow.operatingCashFlow[0].value >
                  companyData.cashFlow.operatingCashFlow[1].value
                  ? 'Increasing trend indicates strong operational performance.'
                  : 'Decreasing trend may indicate operational challenges.'
              }
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-blue-800 dark:text-blue-200">2</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
              <span className="font-medium text-gray-900 dark:text-dark-text-primary">Free Cash Flow:</span> {
                companyData.cashFlow.freeCashFlow[0].value >
                  companyData.cashFlow.freeCashFlow[1].value
                  ? 'Positive growth suggests increasing financial flexibility.'
                  : 'Declining free cash flow may limit future investment opportunities.'
              }
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-blue-800 dark:text-blue-200">3</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
              <span className="font-medium text-gray-900 dark:text-dark-text-primary">Capital Expenditures:</span> {
                Math.abs(companyData.cashFlow.capitalExpenditures[0].value) >
                  Math.abs(companyData.cashFlow.capitalExpenditures[1].value)
                  ? 'Increasing investment in long-term assets may drive future growth.'
                  : 'Reduced capital spending could indicate caution or limited growth opportunities.'
              }
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-blue-800 dark:text-blue-200">4</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
              <span className="font-medium text-gray-900 dark:text-dark-text-primary">Cash Return to Shareholders:</span> {
                Math.abs(companyData.cashFlow.dividendsPaid[companyData.cashFlow.dividendsPaid.length - 1].value) > 0
                  ? 'Company returns value to shareholders through dividends.'
                  : 'No dividend payments may indicate focus on reinvestment or growth.'
              }
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CashFlowAnalysis;