import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { CompanyData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { format, subDays, subMonths, subWeeks, subYears, parseISO } from 'date-fns';

interface StockPriceChartProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

type TimeRange = '1W' | '1M' | '6M' | '1Y' | '3Y';

const StockPriceChart: React.FC<StockPriceChartProps> = ({ companyData, competitorData }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  const filteredData = useMemo(() => {
    // Get the current date
    const now = new Date();
    
    // Determine the cutoff date based on the selected time range
    let cutoffDate;
    switch (timeRange) {
      case '1W':
        cutoffDate = subWeeks(now, 1);
        break;
      case '1M':
        cutoffDate = subMonths(now, 1);
        break;
      case '6M':
        cutoffDate = subMonths(now, 6);
        break;
      case '1Y':
        cutoffDate = subYears(now, 1);
        break;
      case '3Y':
        cutoffDate = subYears(now, 3);
        break;
      default:
        cutoffDate = subMonths(now, 1);
    }
    
    // Make sure stockPrices exists before trying to filter it
    if (!companyData?.stockPrices) {
      return []; // Return empty array if stockPrices is undefined
    }
    
    // Filter the data for the selected time range
    const companyPrices = companyData.stockPrices.filter(item => 
      parseISO(item.date) >= cutoffDate
    ).reverse();;

    // If we have competitor data, merge it with company data
    if (competitorData) {
      const competitorPrices = competitorData.stockPrices.filter(item => 
        parseISO(item.date) >= cutoffDate
      ).reverse();;

      // Create a merged dataset with both company and competitor prices
      const mergedData = companyPrices.map(companyItem => {
        const matchingCompetitorItem = competitorPrices.find(
          competitorItem => competitorItem.date === companyItem.date
        );

        return {
          date: companyItem.date,
          [companyData.company.symbol]: companyItem.price,
          ...(matchingCompetitorItem 
            ? { [competitorData.company.symbol]: matchingCompetitorItem.price } 
            : {})
        };
      });

      return mergedData;
    }

    // If no competitor, just return the company data
    return companyPrices.map(item => ({
      date: item.date,
      [companyData.company.symbol]: item.price
    }));
  }, [companyData, competitorData, timeRange]);

  // Format the date display based on the selected time range
  const formatXAxis = (tickItem: string) => {
    const date = parseISO(tickItem);
    switch (timeRange) {
      case '1W':
      case '1M':
        return format(date, 'MMM dd');
      case '6M':
      case '1Y':
        return format(date, 'MMM yyyy');
      case '3Y':
        return format(date, 'yyyy');
      default:
        return format(date, 'MMM dd');
    }
  };

  // Custom tooltip to display price information
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-surface p-3 border border-gray-200 dark:border-dark-border shadow-md dark:shadow-gray-900 rounded-md">
          <p className="text-gray-600 dark:text-dark-text-secondary font-medium">{format(parseISO(label), 'MMM dd, yyyy')}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              <span className="font-medium">{entry.name}: </span>
              {formatCurrency(entry.value as number)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-3 sm:mb-0">Stock Price History</h2>
        <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto pb-1 sm:pb-0">
          <button 
            onClick={() => setTimeRange('1W')} 
            className={`px-2 sm:px-3 py-1 text-xs rounded-md ${
              timeRange === '1W' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            1W
          </button>
          <button 
            onClick={() => setTimeRange('1M')} 
            className={`px-2 sm:px-3 py-1 text-xs rounded-md ${
              timeRange === '1M' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            1M
          </button>
          <button 
            onClick={() => setTimeRange('6M')} 
            className={`px-2 sm:px-3 py-1 text-xs rounded-md ${
              timeRange === '6M' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            6M
          </button>
          <button 
            onClick={() => setTimeRange('1Y')} 
            className={`px-2 sm:px-3 py-1 text-xs rounded-md ${
              timeRange === '1Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            1Y
          </button>
          <button 
            onClick={() => setTimeRange('3Y')} 
            className={`px-2 sm:px-3 py-1 text-xs rounded-md ${
              timeRange === '3Y' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            3Y
          </button>
        </div>
      </div>

      <div className="h-52 sm:h-64 md:h-80">
        <div className="mt-3 sm:mt-4 text-bases sm:text-base text-gray-500 dark:text-dark-text-secondary">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-end gap-2 sm:gap-0">
            <div className="flex items-center">
              <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 dark:bg-blue-400 rounded-full mr-1 sm:mr-2"></span>
              <span className="truncate max-w-[150px]">{companyData.company.name.trim().split(/[ .]+/)[0]}</span>: {formatCurrency(companyData.currentPrice)}
            </div>
            {competitorData && (
              <div className="flex items-center sm:ml-10">
                <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 dark:bg-red-400 rounded-full mr-1 sm:mr-2"></span>
                <span className="truncate max-w-[150px]">{competitorData.company.name.trim().split(/[ .]+/)[0]}</span>: {formatCurrency(competitorData.currentPrice)}
              </div>
            )}
        </div>
      </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0'} 
            />
            <XAxis 
              dataKey="date"
              tickFormatter={formatXAxis}
              minTickGap={15}
              tick={{
                fontSize: 10, 
                fill: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
              }}
              height={30}
              stroke={document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')} 
              width={60}
              domain={['auto', 'auto']}
              tick={{
                fontSize: 10, 
                fill: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
              }}
              stroke={document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                fontSize: '10px', 
                marginTop: '5px',
                color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey={companyData.company.symbol}
              name={companyData.company.name}
              stroke={document.documentElement.classList.contains('dark') ? '#60a5fa' : '#3b82f6'} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 1, stroke: document.documentElement.classList.contains('dark') ? '#1e1e1e' : '#fff' }}
            />
            {competitorData && (
              <Line 
                type="monotone" 
                dataKey={competitorData.company.symbol}
                name={competitorData.company.name}
                stroke={document.documentElement.classList.contains('dark') ? '#f87171' : '#ef4444'} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 1, stroke: document.documentElement.classList.contains('dark') ? '#1e1e1e' : '#fff' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockPriceChart;