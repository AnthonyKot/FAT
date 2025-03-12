# WHILE WATING
1. combine KEY indicators and Overview page and make it "expandable" to display data for 5 years
2. Move chart under "Summary"
3. Add competitor to "Analysis Summary (AAPL)" and make exandable the same way is #2
4. display relative price by default
5. When we do "Ratio Analysis Summary" define threshold +-10% to show yellow result of comparation and add text
6. "Research & Innovation Metrics" check how it's calculated and show competitor
7. Bring "Balance Sheet

Income Statement

Cash Flow" to main page and hide
8. Check how many real data is used on financial health page. Clean up fake data on "PROD"
9. Actually we don't need some of indicators to make Gemini estimate - just name ("Gemini API Results")
10. yellow overall assesmtent make no sense. Ask Gemini 
(Overall assessment: Apple Inc. shows mixed performance compared to Meta Platforms, Inc., with strengths in some areas and weaknesses in others.)


 const calculateGrahamNumber = (company: CompanyData): FinancialData[] => {
      5    const { incomeStatement, balanceSheet, marketCap, currentPrice } = company;
      6    return incomeStatement.eps.map((epsItem, index) => {
      7      const bookValuePerShare = balanceSheet.totalEquity[index]?.value / 
      8                               (marketCap / currentPrice); // Rough estimate of shares outstanding
      9      return {
     10        year: epsItem.year,
     11        quarter: epsItem.quarter,
     12        value: Math.sqrt(15 * epsItem.value * 1.5 * bookValuePerShare)
     13      };
     14    });
     15  };
     

	•	AI-Driven Similarity and Recommendations
→ Matches our AI-Driven Enhancements stories (integrating AI sorting, badges, and tooltips).
	•	Actionable Insights & Highlights Upon Stock Selection
→ Captured under our UX Enhancements, with stories for displaying insights and highlights immediately upon selection.
	•	Competitor Selection Encouragement
→ Directly aligned with our UX task to add subtle animations or micro-copy to encourage competitor selection.
	•	Enhanced Search Result Clarity
→ Reflected in our UX Improvements for differentiating ticker symbols and adding industry tags.
	•	Dual-Axis Comparative Chart
→ Covered under our visualization enhancements with a dedicated story for dual-axis charts.
	•	Actionable Chart Summaries
→ Included as a UX improvement to add highlighted summaries beneath comparison charts.
	•	Interactive Metric Tooltips
→ Addressed within our UX tasks to include tooltips for complex metrics.
	•	Complete AI-Powered Dashboard Components
→ Matches our comprehensive task of finalizing dashboard components with real-time data and peer comparisons.
	•	Visualization Enhancements
→ Mapped to our dedicated visualization improvements, including trend calculations and interactive features.
	•	User-Centric Dashboard Improvements
→ Covered by our tasks to add metric search/filtering, customizable importance sliders, and export functionalities.
	•	AI Metric Importance Integration & Debugging
→ Reflected in our AI integration and debugging tasks for Gemini API and conditional UI updates.


### UI Implementation Ideas

1. **Financial Health Dashboard**
   - Add a health score based on key metrics (Debt/Equity, Interest Coverage, Current Ratio)
   - Create gauge charts for critical metrics with industry benchmark indicators
   - Implement a financial strength scorecard with color-coded indicators
   - Display risk assessment metrics with trend indicators

2. **Operational Efficiency Panel**
   - Display inventory, receivables, and payables metrics with industry comparisons
   - Create a visualization of the cash conversion cycle
   - Show trends in operational metrics over time
   - Implement Days of Inventory On Hand, Days Payables Outstanding, and Inventory Turnover visuals

3. **Investor Value Metrics**
   - Create a section focused on shareholder returns and value metrics
   - Display Graham Number vs Current Price with buy/sell indicators
   - Show FCF Yield and Dividend Yield with historical trends
   - Add EV/EBITDA and PEG Ratio comparisons to peers

4. **Research & Innovation Tracker**
   - For tech and R&D-heavy companies, highlight R&D spending trends (using R&D to Revenue data)
   - Compare R&D spending to peers and show correlation with growth
   - Visualize R&D effectiveness (R&D spending vs revenue growth)
   - Track CapEx to Operating Cash Flow and CapEx to Depreciation ratios over time

5. **Capital Efficiency Dashboard**
   - Visualize ROIC with peer comparison
   - Display trends in capital allocation efficiency
   - Compare return on capital vs cost of capital
   - Show management effectiveness through capital allocation decisions