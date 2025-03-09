import React, { useState, useRef } from 'react';
import { Info } from 'lucide-react';
import { getTermDefinition } from '../utils/financialTerms';

interface ChartTooltipProps {
  title: string;
  termKey: string;
  size?: 'sm' | 'md';
  iconClassName?: string;
  customDefinition?: string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  title,
  termKey,
  size = 'md',
  iconClassName = '',
  customDefinition,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const termDefinition = getTermDefinition(termKey);
  
  const showTooltip = () => {
    setIsVisible(true);
  };
  
  const hideTooltip = () => {
    setIsVisible(false);
  };
  
  // If we have a customDefinition, we'll always show the tooltip
  // Otherwise, we need a valid termDefinition to show the tooltip
  if (!customDefinition && !termDefinition) {
    return (
      <span className="flex items-center">
        {title}
        <Info 
          size={size === 'sm' ? 14 : 16} 
          className={`ml-1 text-gray-400 ${iconClassName}`} 
        />
      </span>
    );
  }
  
  return (
    <div 
      className="relative inline-flex items-center group"
      ref={containerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <span className="mr-1 dark:text-dark-text-primary">{title}</span>
      <Info 
        size={size === 'sm' ? 14 : 16} 
        className={`inline-block cursor-help text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 ${iconClassName}`} 
      />
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 text-sm bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-md shadow-lg dark:shadow-gray-900 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="font-medium text-gray-900 dark:text-dark-text-primary">{termDefinition?.term || title}</div>
          <div className="mt-1 text-xs text-gray-600 dark:text-dark-text-secondary">
            {customDefinition || termDefinition?.definition}
          </div>
          <div className="absolute w-3 h-3 bg-white dark:bg-dark-surface border-b border-r border-gray-200 dark:border-dark-border transform rotate-45 -mb-1.5 left-1/2 -ml-1.5 bottom-0"></div>
        </div>
      )}
    </div>
  );
};

export default ChartTooltip;