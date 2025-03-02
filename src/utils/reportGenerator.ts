import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CompanyData } from '../types';
import { formatCurrency, formatPercentage } from './formatters';

// General report styling
const styles = {
  headerColor: '#1E40AF', // dark blue
  accentColor: '#3B82F6', // blue
  textPrimary: '#111827', // gray-900
  textSecondary: '#4B5563', // gray-600
  pageMargin: 20,
  columnWidth: 85,
  rowHeight: 10,
};

/**
 * Generate a PDF report for company comparison
 * @param companyData Primary company data
 * @param competitorData Competitor company data (optional)
 * @param elementId DOM element ID to capture
 * @returns Promise that resolves when the PDF is generated
 */
export const generateComparisonReport = async (
  companyData: CompanyData,
  competitorData: CompanyData | null,
  elementId: string
): Promise<void> => {
  // Capture the element as canvas
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  try {
    // Create a PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set up document metadata
    pdf.setProperties({
      title: `Financial Comparison: ${companyData.company.name}${competitorData ? ` vs ${competitorData.company.name}` : ''}`,
      author: 'Financial Analysis Tool',
      subject: 'Company Financial Comparison',
      keywords: 'finance, comparison, analysis',
      creator: 'Financial Analysis Tool',
    });

    // Add title and subtitle
    try {
      addHeader(
        pdf, 
        `Financial Analysis: ${companyData.company.name}${competitorData ? ` vs ${competitorData.company.name}` : ''}`,
        `Report generated on ${new Date().toLocaleDateString()}`
      );
    } catch (error) {
      console.error('Error adding header:', error);
    }
    
    // Add each section with separate try/catch blocks to ensure the report generation continues even if one section fails
    try {
      // Add company overview section
      addCompanyOverview(pdf, companyData, competitorData);
    } catch (error) {
      console.error('Error adding company overview:', error);
      // Add some text to indicate the error
      pdf.text('Company Overview section could not be rendered.', 20, 50);
    }
    
    try {
      // Add key financial metrics
      addKeyMetrics(pdf, companyData, competitorData);
    } catch (error) {
      console.error('Error adding key metrics:', error);
      // Add some text to indicate the error
      pdf.text('Key Financial Metrics section could not be rendered.', 20, 100);
    }
    
    try {
      // Add ratio comparison
      addRatioComparison(pdf, companyData, competitorData);
    } catch (error) {
      console.error('Error adding ratio comparison:', error);
      // Add some text to indicate the error
      pdf.text('Financial Ratios section could not be rendered.', 20, 150);
    }

    // Create a canvas of the visualization
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      // Add visualization from the canvas
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 170; // Width of image on the PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Start visualization on a new page to avoid positioning issues
      pdf.addPage();
      
      // Use fixed positioning for the visualization
      pdf.setFontSize(16);
      pdf.setTextColor(styles.headerColor);
      const visualizationY = 30;
      pdf.text('Visualization', styles.pageMargin, visualizationY);
      
      // Add the image
      pdf.addImage(
        imgData, 
        'PNG', 
        styles.pageMargin, 
        visualizationY + 10, 
        imgWidth, 
        imgHeight
      );
    } catch (e) {
      console.warn('Could not add visualization image:', e);
      // Add a message instead
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setTextColor(styles.headerColor);
      pdf.text('Visualization', styles.pageMargin, 30);
      pdf.setFontSize(12);
      pdf.setTextColor(styles.textPrimary);
      pdf.text('Visualization could not be rendered.', styles.pageMargin, 50);
    }
    
    // Add footnote
    try {
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
          'Generated with Financial Analysis Tool', 
          styles.pageMargin, 
          pdf.internal.pageSize.height - 10
        );
        pdf.text(
          `Page ${i} of ${pageCount}`, 
          pdf.internal.pageSize.width - 40, 
          pdf.internal.pageSize.height - 10
        );
      }
    } catch (error) {
      console.error('Error adding footnotes:', error);
    }
    
    // Download the PDF
    pdf.save(`Financial_Analysis_${companyData.company.name}${competitorData ? `_vs_${competitorData.company.name}` : ''}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generate a shareable image from a chart element
 * @param elementId DOM element ID to capture
 * @returns Promise that resolves with the data URL of the generated image
 */
export const generateChartImage = async (elementId: string): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating chart image:', error);
    throw error;
  }
};

// Helper functions for PDF generation

const addHeader = (pdf: jsPDF, title: string, subtitle: string): void => {
  pdf.setFontSize(20);
  pdf.setTextColor(styles.headerColor);
  pdf.text(title, styles.pageMargin, 20);
  
  pdf.setFontSize(12);
  pdf.setTextColor(styles.textSecondary);
  pdf.text(subtitle, styles.pageMargin, 30);
  
  // Add horizontal line
  pdf.setDrawColor(styles.accentColor);
  pdf.setLineWidth(0.5);
  pdf.line(styles.pageMargin, 35, pdf.internal.pageSize.width - styles.pageMargin, 35);
  
  pdf.setTextColor(styles.textPrimary);
};

const addCompanyOverview = (
  pdf: jsPDF, 
  companyData: CompanyData, 
  competitorData: CompanyData | null
): void => {
  pdf.setFontSize(16);
  pdf.setTextColor(styles.headerColor);
  pdf.text('Company Overview', styles.pageMargin, 45);
  
  // Prepare table data
  const tableHeaders = ['Metric', companyData.company.name];
  if (competitorData) {
    tableHeaders.push(competitorData.company.name);
  }
  
  const tableRows = [
    ['Industry', companyData.company.industry, competitorData?.company.industry || ''],
    ['Market Cap', formatCurrency(companyData.marketCap), competitorData ? formatCurrency(competitorData.marketCap) : ''],
    ['Current Price', `$${companyData.currentPrice.toFixed(2)}`, competitorData ? `$${competitorData.currentPrice.toFixed(2)}` : ''],
    ['52-Week High', `$${companyData.yearHigh.toFixed(2)}`, competitorData ? `$${competitorData.yearHigh.toFixed(2)}` : ''],
    ['52-Week Low', `$${companyData.yearLow.toFixed(2)}`, competitorData ? `$${competitorData.yearLow.toFixed(2)}` : ''],
    ['Dividend Yield', formatPercentage(companyData.dividendYield), competitorData ? formatPercentage(competitorData.dividendYield) : ''],
    ['Beta', companyData.beta.toFixed(2), competitorData ? competitorData.beta.toFixed(2) : '']
  ];
  
  // If no competitor data, remove the empty column
  if (!competitorData) {
    tableRows.forEach(row => row.pop());
  }
  
  // Add the table to the PDF
  autoTable(pdf, {
    startY: 50,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [50, 50, 50],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left', cellWidth: 40 },
      1: { halign: 'right', cellWidth: competitorData ? 60 : 120 },
      2: competitorData ? { halign: 'right', cellWidth: 60 } : {}
    },
    alternateRowStyles: {
      fillColor: [249, 249, 249]
    },
    margin: { left: styles.pageMargin, right: styles.pageMargin }
  });
};

const addKeyMetrics = (
  pdf: jsPDF, 
  companyData: CompanyData, 
  competitorData: CompanyData | null
): void => {
  // Get the Y position after the previous section
  const startY = pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 15 : 100;
  
  pdf.setFontSize(16);
  pdf.setTextColor(styles.headerColor);
  pdf.text('Key Financial Metrics', styles.pageMargin, startY);
  
  // Get latest values for key metrics
  const getLatestValue = (data: any[]) => data[data.length - 1]?.value ?? 0;
  
  // Income Statement Metrics
  const revenue1 = getLatestValue(companyData.incomeStatement.revenue);
  const revenue2 = competitorData ? getLatestValue(competitorData.incomeStatement.revenue) : 0;
  
  const netIncome1 = getLatestValue(companyData.incomeStatement.netIncome);
  const netIncome2 = competitorData ? getLatestValue(competitorData.incomeStatement.netIncome) : 0;
  
  // Balance Sheet Metrics 
  const totalAssets1 = getLatestValue(companyData.balanceSheet.totalAssets);
  const totalAssets2 = competitorData ? getLatestValue(competitorData.balanceSheet.totalAssets) : 0;
  
  const totalLiabilities1 = getLatestValue(companyData.balanceSheet.totalLiabilities);
  const totalLiabilities2 = competitorData ? getLatestValue(competitorData.balanceSheet.totalLiabilities) : 0;
  
  // Cash Flow Metrics
  const operatingCashFlow1 = getLatestValue(companyData.cashFlow.operatingCashFlow);
  const operatingCashFlow2 = competitorData ? getLatestValue(competitorData.cashFlow.operatingCashFlow) : 0;
  
  const freeCashFlow1 = getLatestValue(companyData.cashFlow.freeCashFlow);
  const freeCashFlow2 = competitorData ? getLatestValue(competitorData.cashFlow.freeCashFlow) : 0;
  
  // Prepare table headers
  const tableHeaders = ['Metric', companyData.company.name];
  if (competitorData) {
    tableHeaders.push(competitorData.company.name);
  }
  
  // Prepare table data
  const tableRows = [
    ['Revenue', formatCurrency(revenue1), competitorData ? formatCurrency(revenue2) : ''],
    ['Net Income', formatCurrency(netIncome1), competitorData ? formatCurrency(netIncome2) : ''],
    ['Total Assets', formatCurrency(totalAssets1), competitorData ? formatCurrency(totalAssets2) : ''],
    ['Total Liabilities', formatCurrency(totalLiabilities1), competitorData ? formatCurrency(totalLiabilities2) : ''],
    ['Operating Cash Flow', formatCurrency(operatingCashFlow1), competitorData ? formatCurrency(operatingCashFlow2) : ''],
    ['Free Cash Flow', formatCurrency(freeCashFlow1), competitorData ? formatCurrency(freeCashFlow2) : '']
  ];
  
  // If no competitor data, remove the empty column
  if (!competitorData) {
    tableRows.forEach(row => row.pop());
  }
  
  // Add the table to the PDF
  autoTable(pdf, {
    startY: startY + 5,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [50, 50, 50],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left', cellWidth: 50 },
      1: { halign: 'right', cellWidth: competitorData ? 55 : 110 },
      2: competitorData ? { halign: 'right', cellWidth: 55 } : {}
    },
    alternateRowStyles: {
      fillColor: [249, 249, 249]
    },
    margin: { left: styles.pageMargin, right: styles.pageMargin }
  });
};

const addRatioComparison = (
  pdf: jsPDF, 
  companyData: CompanyData, 
  competitorData: CompanyData | null
): void => {
  // Get the Y position after the previous section
  const startY = pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 15 : 220;
  
  pdf.setFontSize(16);
  pdf.setTextColor(styles.headerColor);
  pdf.text('Financial Ratios', styles.pageMargin, startY);
  
  // Get latest values
  const getLatestValue = (data: any[]) => data[data.length - 1]?.value ?? 0;
  
  // Valuation ratios
  const peRatio1 = getLatestValue(companyData.ratios.peRatio);
  const peRatio2 = competitorData ? getLatestValue(competitorData.ratios.peRatio) : 0;
  const isPEBetter = peRatio1 < peRatio2;
  
  const pbRatio1 = getLatestValue(companyData.ratios.pbRatio);
  const pbRatio2 = competitorData ? getLatestValue(competitorData.ratios.pbRatio) : 0;
  const isPBBetter = pbRatio1 < pbRatio2;
  
  // Profitability ratios
  const roe1 = getLatestValue(companyData.ratios.returnOnEquity);
  const roe2 = competitorData ? getLatestValue(competitorData.ratios.returnOnEquity) : 0;
  const isROEBetter = roe1 > roe2;
  
  const netMargin1 = getLatestValue(companyData.ratios.netProfitMargin);
  const netMargin2 = competitorData ? getLatestValue(competitorData.ratios.netProfitMargin) : 0;
  const isNetMarginBetter = netMargin1 > netMargin2;
  
  // Growth ratios
  const revGrowth1 = getLatestValue(companyData.ratios.revenueGrowth);
  const revGrowth2 = competitorData ? getLatestValue(competitorData.ratios.revenueGrowth) : 0;
  const isRevGrowthBetter = revGrowth1 > revGrowth2;
  
  // Risk ratios
  const debtToEquity1 = getLatestValue(companyData.ratios.debtToEquity);
  const debtToEquity2 = competitorData ? getLatestValue(competitorData.ratios.debtToEquity) : 0;
  const isDebtToEquityBetter = debtToEquity1 < debtToEquity2;
  
  const currentRatio1 = getLatestValue(companyData.ratios.currentRatio);
  const currentRatio2 = competitorData ? getLatestValue(competitorData.ratios.currentRatio) : 0;
  const isCurrentRatioBetter = currentRatio1 > currentRatio2;
  
  // Create multiple tables for different ratio categories
  
  // 1. Valuation Ratios Table
  const valuationTableHeaders = competitorData ? 
    ['Valuation Ratios', companyData.company.name, competitorData.company.name, 'Comparison'] : 
    ['Valuation Ratios', companyData.company.name];
  
  const valuationTableRows = [
    ['P/E Ratio', peRatio1.toFixed(2), competitorData ? peRatio2.toFixed(2) : '', competitorData ? (isPEBetter ? 'Better' : 'Worse') : ''],
    ['P/B Ratio', pbRatio1.toFixed(2), competitorData ? pbRatio2.toFixed(2) : '', competitorData ? (isPBBetter ? 'Better' : 'Worse') : '']
  ];
  
  // 2. Profitability Ratios Table
  const profitabilityTableHeaders = competitorData ? 
    ['Profitability Ratios', companyData.company.name, competitorData.company.name, 'Comparison'] : 
    ['Profitability Ratios', companyData.company.name];
  
  const profitabilityTableRows = [
    ['ROE', formatPercentage(roe1), competitorData ? formatPercentage(roe2) : '', competitorData ? (isROEBetter ? 'Better' : 'Worse') : ''],
    ['Net Margin', formatPercentage(netMargin1), competitorData ? formatPercentage(netMargin2) : '', competitorData ? (isNetMarginBetter ? 'Better' : 'Worse') : '']
  ];
  
  // 3. Growth Ratios Table
  const growthTableHeaders = competitorData ? 
    ['Growth Ratios', companyData.company.name, competitorData.company.name, 'Comparison'] : 
    ['Growth Ratios', companyData.company.name];
  
  const growthTableRows = [
    ['Revenue Growth', formatPercentage(revGrowth1), competitorData ? formatPercentage(revGrowth2) : '', competitorData ? (isRevGrowthBetter ? 'Better' : 'Worse') : '']
  ];
  
  // 4. Risk Ratios Table
  const riskTableHeaders = competitorData ? 
    ['Risk Ratios', companyData.company.name, competitorData.company.name, 'Comparison'] : 
    ['Risk Ratios', companyData.company.name];
  
  const riskTableRows = [
    ['Debt to Equity', debtToEquity1.toFixed(2), competitorData ? debtToEquity2.toFixed(2) : '', competitorData ? (isDebtToEquityBetter ? 'Better' : 'Worse') : ''],
    ['Current Ratio', currentRatio1.toFixed(2), competitorData ? currentRatio2.toFixed(2) : '', competitorData ? (isCurrentRatioBetter ? 'Better' : 'Worse') : '']
  ];
  
  // Remove comparison column if no competitor data
  if (!competitorData) {
    [valuationTableRows, profitabilityTableRows, growthTableRows, riskTableRows].forEach(tableRows => {
      tableRows.forEach(row => {
        row.pop();
        row.pop();
      });
    });
  }
  
  // Common table styling
  const tableOptions = {
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [50, 50, 50],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: competitorData ? {
      0: { fontStyle: 'bold', halign: 'left', cellWidth: 40 },
      1: { halign: 'right', cellWidth: 40 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'center', cellWidth: 30 }
    } : {
      0: { fontStyle: 'bold', halign: 'left', cellWidth: 60 },
      1: { halign: 'right', cellWidth: 100 }
    },
    alternateRowStyles: {
      fillColor: [249, 249, 249]
    },
    margin: { left: styles.pageMargin, right: styles.pageMargin }
  };
  
  // Add the valuation table
  autoTable(pdf, {
    startY: startY + 5,
    head: [valuationTableHeaders],
    body: valuationTableRows,
    ...tableOptions,
    didDrawPage: (data: any) => {
      // Highlight the better/worse values with colors in the comparison column
      if (competitorData) {
        const comparisonColumnIndex = 3;
        data.table.body.forEach((row: any, i: number) => {
          if (row.cells[comparisonColumnIndex]) {
            const cell = row.cells[comparisonColumnIndex];
            if (cell.text[0] === 'Better') {
              cell.styles.fillColor = [230, 255, 230]; // Light green
              cell.styles.textColor = [0, 100, 0]; // Dark green
            } else if (cell.text[0] === 'Worse') {
              cell.styles.fillColor = [255, 230, 230]; // Light red
              cell.styles.textColor = [100, 0, 0]; // Dark red
            }
          }
        });
      }
    }
  });
  
  // Add the profitability table
  const lastTableEndY = pdf.internal.pageSize.height - pdf.internal.pageSize.margin;
  autoTable(pdf, {
    startY: startY + 60,
    head: [profitabilityTableHeaders],
    body: profitabilityTableRows,
    ...tableOptions,
    didDrawPage: (data: any) => {
      // Highlight the better/worse values with colors in the comparison column
      if (competitorData) {
        const comparisonColumnIndex = 3;
        data.table.body.forEach((row: any, i: number) => {
          if (row.cells[comparisonColumnIndex]) {
            const cell = row.cells[comparisonColumnIndex];
            if (cell.text[0] === 'Better') {
              cell.styles.fillColor = [230, 255, 230]; // Light green
              cell.styles.textColor = [0, 100, 0]; // Dark green
            } else if (cell.text[0] === 'Worse') {
              cell.styles.fillColor = [255, 230, 230]; // Light red
              cell.styles.textColor = [100, 0, 0]; // Dark red
            }
          }
        });
      }
    }
  });
  
  // Add the growth table
  autoTable(pdf, {
    startY: startY + 100,
    head: [growthTableHeaders],
    body: growthTableRows,
    ...tableOptions,
    didDrawPage: (data: any) => {
      // Highlight the better/worse values with colors in the comparison column
      if (competitorData) {
        const comparisonColumnIndex = 3;
        data.table.body.forEach((row: any, i: number) => {
          if (row.cells[comparisonColumnIndex]) {
            const cell = row.cells[comparisonColumnIndex];
            if (cell.text[0] === 'Better') {
              cell.styles.fillColor = [230, 255, 230]; // Light green
              cell.styles.textColor = [0, 100, 0]; // Dark green
            } else if (cell.text[0] === 'Worse') {
              cell.styles.fillColor = [255, 230, 230]; // Light red
              cell.styles.textColor = [100, 0, 0]; // Dark red
            }
          }
        });
      }
    }
  });
  
  // Add the risk table
  autoTable(pdf, {
    startY: startY + 120,
    head: [riskTableHeaders],
    body: riskTableRows,
    ...tableOptions,
    didDrawPage: (data: any) => {
      // Highlight the better/worse values with colors in the comparison column
      if (competitorData) {
        const comparisonColumnIndex = 3;
        data.table.body.forEach((row: any, i: number) => {
          if (row.cells[comparisonColumnIndex]) {
            const cell = row.cells[comparisonColumnIndex];
            if (cell.text[0] === 'Better') {
              cell.styles.fillColor = [230, 255, 230]; // Light green
              cell.styles.textColor = [0, 100, 0]; // Dark green
            } else if (cell.text[0] === 'Worse') {
              cell.styles.fillColor = [255, 230, 230]; // Light red
              cell.styles.textColor = [100, 0, 0]; // Dark red
            }
          }
        });
      }
    }
  });
};