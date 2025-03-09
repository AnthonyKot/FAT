import React from 'react';

interface SparklineProps {
  data: number[];
  height?: number;
  width?: number;
  positiveColor?: string;
  negativeColor?: string;
}

// Simple sparkline component for visual trend indicators
const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  height = 30, 
  width = 80, 
  positiveColor = "#10B981", 
  negativeColor = "#EF4444"
}) => {
  const normalizedData = [...data];
  const min = Math.min(...normalizedData);
  const max = Math.max(...normalizedData);
  const range = max - min;
  
  // Calculate if trend is positive
  const isPositive = normalizedData[normalizedData.length - 1] > normalizedData[0];
  const strokeColor = isPositive ? positiveColor : negativeColor;
  
  const points = normalizedData.map((value, index) => {
    const x = (index / (normalizedData.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="ml-2">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        points={points}
      />
      {isPositive && (
        <circle 
          cx={(normalizedData.length - 1) / (normalizedData.length - 1) * width} 
          cy={height - ((normalizedData[normalizedData.length - 1] - min) / range) * height} 
          r="3" 
          fill={positiveColor} 
        />
      )}
    </svg>
  );
};

export default Sparkline;