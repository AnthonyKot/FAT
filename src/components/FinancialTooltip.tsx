import React, { useState, useRef, useEffect } from 'react';
import { getTermDefinition, FinancialTerm } from '../utils/financialTerms';

interface FinancialTooltipProps {
  termKey: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const FinancialTooltip: React.FC<FinancialTooltipProps> = ({
  termKey,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [term, setTerm] = useState<FinancialTerm | undefined>(undefined);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const termDefinition = getTermDefinition(termKey);
    setTerm(termDefinition);
  }, [termKey]);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  // Positioning the tooltip based on the "position" prop
  const getTooltipPosition = () => {
    if (!containerRef.current || !tooltipRef.current) {
      return {};
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px',
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px',
        };
      default:
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
    }
  };

  // If no term is found, just render children without tooltip
  if (!term) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      ref={containerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-64 p-3 text-sm text-white bg-gray-800 dark:bg-gray-900 rounded-md shadow-lg"
          style={getTooltipPosition()}
        >
          <div className="font-medium">{term.term}</div>
          <div className="mt-1 text-xs text-gray-300">{term.definition}</div>
        </div>
      )}
    </div>
  );
};

export default FinancialTooltip;