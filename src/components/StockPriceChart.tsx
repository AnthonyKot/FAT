// This component is now just a wrapper for StockPriceHistory
import React from 'react';
import { CompanyData } from '../types';
import StockPriceHistory from './StockPriceHistory';

interface StockPriceChartProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
}

const StockPriceChart: React.FC<StockPriceChartProps> = ({ companyData, competitorData }) => {
  return (
    <StockPriceHistory 
      companyData={companyData}
      competitorData={competitorData}
    />
  );
};

export default StockPriceChart;