# LLM Financial Analysis Prompts

This document outlines prompts and instructions for leveraging LLMs (specifically Google's Gemini) to analyze financial metrics across different company types, sectors, and sizes. These prompts are designed to guide the LLM through a structured analysis process using the appropriate tools and metrics for each specific context.

## Core Analysis Framework

### 1. Company Context Determination

```
You are a financial analysis expert tasked with analyzing {COMPANY_NAME} ({TICKER}). 

First, determine the following contextual factors about this company:
1. Size category: Large-cap (>$10B), Mid-cap ($2-10B), or Small-cap (<$2B)
2. Growth stage: High-growth, Mature, or Declining
3. Primary industry sector and sub-industry
4. Geographic region of primary operations
5. Key business model characteristics (e.g., subscription-based, manufacturing, retail)

For each factor, briefly explain your determination based on available data.
```

### 2. Metric Selection Based on Company Profile

```
Based on {COMPANY_NAME}'s profile as a {SIZE_CATEGORY}, {GROWTH_STAGE} company in the {INDUSTRY} sector primarily operating in {REGION}, identify the 5 most relevant financial metrics for evaluating this company.

For each selected metric:
1. Explain why this metric is particularly important for this type of company
2. Describe what a "good" value range would typically be for this industry/company type
3. Note any industry-specific considerations when interpreting this metric

Your selection should include a balanced mix of:
- Profitability metrics
- Growth metrics
- Financial health metrics
- Industry-specific operational metrics
```

### 3. Competitor Identification and Comparison

```
Identify 3-5 direct competitors for {COMPANY_NAME} ({TICKER}) that would provide the most meaningful comparison.

For each competitor:
1. Company name and ticker symbol
2. Brief explanation of why this is a relevant competitor
3. Key similarities and differences in business model or market focus
4. 1-2 specific metrics where comparing these companies would yield valuable insights

Format your response as a structured list with clear headings for each competitor.
```

## Advanced Analysis Tools

### 4. Multi-Step Financial Trend Analysis

```
Perform a comprehensive financial trend analysis for {COMPANY_NAME} ({TICKER}) following these steps:

Step 1: Analyze core profitability trends
- Examine Net Profit Margin, Operating Margin, and Gross Margin over the past 3-5 years
- Identify patterns, inflection points, and potential causes for changes

Step 2: Evaluate growth sustainability
- Assess Revenue Growth Rate, Earnings Growth Rate, and Free Cash Flow Growth
- Determine if growth is accelerating, stable, or decelerating
- Analyze the relationship between revenue growth and margin trends

Step 3: Examine financial health indicators
- Review Debt-to-Equity, Interest Coverage, and Free Cash Flow Yield
- Evaluate if the company's financial position is strengthening or weakening

Step 4: Investigate return on capital metrics
- Analyze ROE, ROIC, and ROA trends
- Determine if the company is becoming more or less efficient with its capital

Step 5: Synthesize findings into an overall assessment
- Identify the most significant positive and negative trends
- Provide a nuanced conclusion about the company's financial trajectory
```

### 5. Predictive Model Hypothesis Generation

```
Generate 3 distinct hypotheses about {COMPANY_NAME}'s ({TICKER}) future financial performance that could be tested against historical data.

For each hypothesis:
1. Provide a clear, testable statement about a financial relationship or trend
2. Explain the economic or business logic behind this hypothesis
3. Identify the specific metrics and data points needed to test this hypothesis
4. Describe how you would validate this hypothesis using 1, 3, and 5-year historical data
5. Explain what a confirmation or rejection of this hypothesis would imply for investors

Your hypotheses should focus on different aspects of the company's financial performance (e.g., profitability, growth, efficiency) and incorporate industry-specific considerations.
```

### 6. Industry-Specific Metric Importance Ranking

```
For a company in the {INDUSTRY} sector like {COMPANY_NAME}, rank the following metric categories from most to least important for investment analysis, and explain your reasoning:

1. Profitability Metrics (e.g., Net Margin, Operating Margin, Gross Margin)
2. Growth Metrics (e.g., Revenue Growth, EPS Growth, FCF Growth)
3. Valuation Metrics (e.g., P/E, EV/EBITDA, P/S)
4. Financial Health Metrics (e.g., Debt/Equity, Interest Coverage, Current Ratio)
5. Efficiency Metrics (e.g., Asset Turnover, Inventory Turnover, ROA)
6. Cash Flow Metrics (e.g., FCF, Operating Cash Flow, Cash Conversion)
7. Return Metrics (e.g., ROE, ROIC, ROCE)
8. Industry-Specific Metrics (e.g., Same-Store Sales, R&D as % of Revenue)

For each category:
1. Assign an importance score (1-10)
2. Explain why this category is more or less important for this specific industry
3. Identify the 1-2 most critical individual metrics within each category for this industry
4. Note any special considerations when interpreting these metrics for this industry
```

## Specialized Analysis by Company Type

### 7. Small-Cap Growth Company Analysis

```
Analyze {COMPANY_NAME} ({TICKER}) as a small-cap growth company, focusing on:

1. Growth Sustainability Assessment
   - Analyze Revenue Growth Rate, Customer/User Acquisition Metrics, and TAM penetration
   - Evaluate if current growth rates are sustainable given market size and competition

2. Path to Profitability Analysis
   - Examine Gross Margin trends and Operating Loss as % of Revenue
   - Project timeline to profitability based on current trends
   - Identify key metrics indicating progress toward profitability

3. Cash Runway Evaluation
   - Calculate Cash Burn Rate and months of runway remaining
   - Assess likelihood and potential terms of additional financing needs

4. Competitive Positioning
   - Evaluate market share trends and competitive advantages
   - Identify key differentiators and their sustainability

5. Execution Risk Assessment
   - Analyze management's track record of meeting projections
   - Identify key operational metrics indicating execution quality

Provide a balanced assessment that acknowledges both the growth potential and risks.
```

### 8. Large-Cap Mature Company Analysis

```
Perform a comprehensive analysis of {COMPANY_NAME} ({TICKER}) as a large-cap mature company, focusing on:

1. Capital Allocation Efficiency
   - Evaluate ROIC, ROE, and Capital Expenditure trends
   - Assess management's capital allocation decisions (organic growth, acquisitions, dividends, buybacks)

2. Competitive Moat Strength
   - Analyze margin stability, pricing power, and market share trends
   - Identify sources of competitive advantage and their durability

3. Cash Return to Shareholders
   - Examine Dividend Yield, Dividend Growth Rate, and Buyback Yield
   - Evaluate sustainability of shareholder returns

4. Innovation and Adaptation
   - Assess R&D spending effectiveness and new product/service development
   - Evaluate the company's response to industry disruption threats

5. Long-term Growth Prospects
   - Identify potential growth vectors beyond core business
   - Analyze international expansion opportunities and adjacent market potential

Provide a nuanced assessment that balances stability, income potential, and long-term growth prospects.
```

## Industry-Specific Analysis Frameworks

### 9. Technology Sector Analysis

```
Conduct a specialized analysis of {COMPANY_NAME} ({TICKER}) as a technology company, focusing on:

1. Innovation Metrics
   - R&D as % of Revenue (current: {VALUE}, industry avg: {AVG})
   - Patent generation rate and quality
   - New product revenue contribution

2. Recurring Revenue Analysis
   - Subscription revenue as % of total
   - Net Revenue Retention Rate
   - Customer Lifetime Value (LTV) to Customer Acquisition Cost (CAC) ratio

3. Platform Ecosystem Strength
   - User/customer growth rates
   - Engagement metrics and trends
   - Network effects and switching costs

4. Unit Economics
   - Gross margin by product/service line
   - Contribution margin trends
   - Customer acquisition efficiency

5. Technical Debt and Infrastructure
   - Technology stack modernization
   - Technical talent acquisition and retention
   - Infrastructure scalability and reliability

Provide a comprehensive assessment that evaluates both current performance and long-term technological positioning.
```

### 10. Financial Sector Analysis

```
Perform a specialized analysis of {COMPANY_NAME} ({TICKER}) as a financial institution, focusing on:

1. Asset Quality Assessment
   - Non-performing loans ratio
   - Loan loss provisions adequacy
   - Asset diversification and concentration risk

2. Capital Adequacy
   - Tier 1 Capital Ratio
   - Leverage Ratio
   - Stress test performance

3. Profitability Drivers
   - Net Interest Margin trends
   - Fee income growth
   - Cost-to-Income Ratio

4. Risk Management Effectiveness
   - Risk-weighted assets growth
   - Value at Risk (VaR) metrics
   - Operational risk incidents

5. Digital Transformation Progress
   - Digital customer acquisition metrics
   - Mobile banking adoption rates
   - Technology investment as % of operating expenses

Provide a balanced assessment that considers both traditional financial metrics and forward-looking indicators of competitive positioning.
```

## Tool Integration Prompts

### 11. Financial Data Retrieval Tool

```
To analyze {COMPANY_NAME} ({TICKER}), I need to retrieve the following financial data:

1. Income Statement data for the past 5 years
2. Balance Sheet data for the past 5 years
3. Cash Flow Statement data for the past 5 years
4. Key financial ratios and metrics
5. Stock price performance data

For each data category, specify:
- The exact time periods needed (annual, quarterly, or both)
- Any specific line items of particular importance
- Preferred format for the data (raw values, growth rates, or both)

I will use this data to perform a comprehensive financial analysis focusing on [specific analysis goal].
```

### 12. Comparative Analysis Tool

```
To perform a comparative analysis between {COMPANY_NAME} ({TICKER}) and its competitors, I need to:

1. Identify the appropriate peer group based on:
   - Industry classification
   - Market capitalization range
   - Business model similarity
   - Geographic overlap

2. Retrieve the following comparative metrics for all companies in the peer group:
   - Profitability metrics (margins, ROE, ROIC)
   - Growth metrics (revenue growth, EPS growth)
   - Valuation metrics (P/E, EV/EBITDA, P/S)
   - Financial health metrics (leverage, liquidity)
   - Industry-specific operational metrics

3. Calculate relative performance percentiles for each metric

4. Identify areas where {COMPANY_NAME} significantly outperforms or underperforms peers

This comparative data will be used to assess {COMPANY_NAME}'s competitive positioning and identify potential investment advantages or concerns.
```

### 13. Historical Backtesting Tool

```
To test my hypothesis about {COMPANY_NAME}'s ({TICKER}) financial performance, I need to perform historical backtesting using the following approach:

1. Data Requirements:
   - Historical financial data for years: [specify years]
   - Specific metrics needed: [list metrics]
   - Competitor data for the same periods: [specify competitors]

2. Testing Methodology:
   - Define the specific hypothesis: [state hypothesis]
   - Specify the prediction formula or relationship to test
   - Determine success criteria and accuracy metrics
   - Identify control variables to account for market or industry factors

3. Analysis Plan:
   - Test the hypothesis using data from each historical period
   - Calculate prediction accuracy for each period
   - Identify factors that improve or reduce prediction accuracy
   - Refine the hypothesis based on historical results

4. Output Format:
   - Accuracy scores for each testing period
   - Visualization of predicted vs. actual results
   - Insights on when and why the hypothesis performed well or poorly
   - Refined hypothesis based on backtesting results

This backtesting will help validate whether my financial analysis approach has predictive power and identify ways to improve it.
```

## Metric Selection by Company Type

### 14. Metrics for High-Growth Technology Companies

```
For a high-growth technology company like {COMPANY_NAME} ({TICKER}), analyze the following key metrics:

1. Growth Metrics
   - Revenue Growth Rate (YoY and sequential)
   - Customer/User Growth Rate
   - Annual Recurring Revenue (ARR) Growth
   - Net Revenue Retention Rate

2. Efficiency Metrics
   - Gross Margin and trend
   - Customer Acquisition Cost (CAC)
   - Customer Lifetime Value (LTV)
   - LTV/CAC Ratio
   - Payback Period

3. Unit Economics
   - Average Revenue Per User (ARPU)
   - Contribution Margin
   - Incremental ROI on Sales & Marketing

4. Path to Profitability
   - Operating Loss as % of Revenue (trend)
   - Free Cash Flow Margin (trend)
   - Rule of 40 Score (Revenue Growth % + FCF Margin %)

5. Innovation Metrics
   - R&D as % of Revenue
   - New Product Revenue Contribution
   - Engineering Headcount Growth

For each metric, provide:
- Current value
- Year-over-year change
- Comparison to industry benchmarks
- Assessment of whether the metric indicates strength or concern
```

### 15. Metrics for Mature Manufacturing Companies

```
For a mature manufacturing company like {COMPANY_NAME} ({TICKER}), analyze the following key metrics:

1. Profitability Metrics
   - Gross Margin and trend
   - Operating Margin and trend
   - EBITDA Margin and trend
   - Return on Invested Capital (ROIC)

2. Efficiency Metrics
   - Asset Turnover Ratio
   - Inventory Turnover Ratio
   - Days of Inventory Outstanding
   - Fixed Asset Turnover

3. Financial Health Metrics
   - Debt-to-EBITDA Ratio
   - Interest Coverage Ratio
   - Current Ratio
   - Free Cash Flow Conversion (FCF/Net Income)

4. Growth and Investment Metrics
   - Revenue Growth Rate
   - Order Backlog or Book-to-Bill Ratio
   - Capital Expenditure as % of Depreciation
   - Return on Capital Employed (ROCE)

5. Industry-Specific Metrics
   - Capacity Utilization Rate
   - Manufacturing Cycle Time
   - Quality Metrics (Defect Rates, etc.)
   - Energy Efficiency Metrics

For each metric, provide:
- Current value
- 3-year trend
- Comparison to industry benchmarks
- Assessment of whether the metric indicates strength or concern
```

## Regional Considerations

### 16. U.S. Market Analysis Framework

```
For {COMPANY_NAME} ({TICKER}) as a U.S.-based company, analyze the following aspects with appropriate metrics:

1. Growth and Innovation Focus
   - Revenue Growth Rate (higher growth expectations than other markets)
   - R&D as % of Revenue (innovation premium in valuation)
   - New Product Pipeline and Revenue Contribution
   - Total Addressable Market (TAM) and penetration rate

2. Profitability and Returns
   - Operating Margin (emphasis on operational efficiency)
   - Return on Invested Capital (ROIC vs. WACC spread)
   - Free Cash Flow Generation and Conversion
   - Economic Value Added (EVA)

3. Capital Allocation
   - Share Repurchase Yield (higher emphasis than dividends)
   - M&A Strategy and Historical Returns on Acquisitions
   - Reinvestment Rate into Core Business
   - Balance Sheet Optimization

4. Market Position
   - Market Share Trends
   - Pricing Power Evidence
   - Competitive Moat Strength
   - Brand Value and Intangible Asset Contribution

5. Governance and Compensation
   - Executive Compensation Structure and Alignment
   - Corporate Governance Quality
   - Capital Allocation Track Record
   - Shareholder-Friendly Policies

Provide analysis that acknowledges the U.S. market's emphasis on growth, innovation, and shareholder returns.
```

### 17. European Market Analysis Framework

```
For {COMPANY_NAME} ({TICKER}) as a European-based company, analyze the following aspects with appropriate metrics:

1. Income and Stability Focus
   - Dividend Yield and Dividend Growth Rate (higher emphasis than U.S.)
   - Dividend Coverage Ratio and Sustainability
   - Earnings Stability and Volatility
   - Free Cash Flow Generation and Conversion

2. Profitability and Efficiency
   - Operating Margin (with focus on stability over maximization)
   - Return on Equity (ROE)
   - Cost Control Effectiveness
   - Working Capital Management

3. Financial Strength
   - Debt-to-Equity Ratio (typically more conservative)
   - Interest Coverage Ratio
   - Pension Funding Status (more significant in Europe)
   - Liquidity Metrics

4. Growth Considerations
   - Organic Growth Rate (moderate expectations)
   - Geographic Diversification
   - Emerging Market Exposure
   - Product/Service Innovation Pipeline

5. Stakeholder Approach
   - Labor Relations and Productivity
   - Environmental Impact and Sustainability Metrics
   - Community Investment and Social Responsibility
   - Regulatory Compliance and Relationships

Provide analysis that acknowledges European markets' emphasis on stability, income, and stakeholder considerations.
```

## Feedback Loop Implementation

### 18. Hypothesis Refinement Process

```
Based on the backtesting results for my hypothesis about {COMPANY_NAME} ({TICKER}), I need to refine my analysis approach:

Original Hypothesis:
[State the original hypothesis that was tested]

Backtesting Results:
- Accuracy Score: [X%] overall
- Performance by Year: [List accuracy for each year tested]
- Key Observations: [List main insights from backtesting]

Hypothesis Refinement Process:

1. Identify Strengths and Weaknesses
   - Which aspects of the hypothesis performed well?
   - Which aspects underperformed or failed?
   - Were there specific market conditions where performance varied?

2. Incorporate Additional Factors
   - What additional metrics would improve predictive power?
   - Are there external factors that should be considered?
   - How can industry-specific considerations be better integrated?

3. Adjust Weighting and Relationships
   - Should certain metrics be weighted differently?
   - Are there non-linear relationships to consider?
   - How should outlier periods be handled?

4. Refined Hypothesis:
   [State the refined hypothesis based on backtesting insights]

5. Validation Approach:
   - How will the refined hypothesis be tested?
   - What specific improvements in accuracy are expected?
   - What additional data points might be needed?

This refinement process will create a feedback loop that continuously improves the analysis framework based on empirical results.
```

## Implementation Guidelines

When implementing these prompts in the LangChain.js framework:

1. **Dynamic Prompt Construction**: Use template variables to customize prompts based on company, industry, and analysis context.

2. **Sequential Chaining**: Chain prompts in a logical sequence (e.g., company context → metric selection → analysis).

3. **Tool Integration**: Connect prompts to appropriate tools for data retrieval, calculation, and visualization.

4. **Memory Management**: Maintain context between analysis steps to build comprehensive understanding.

5. **Output Formatting**: Structure responses for consistent parsing and display in the UI.

6. **Error Handling**: Implement fallbacks for when certain data is unavailable or analysis steps fail.

7. **Feedback Integration**: Store analysis results and accuracy metrics to improve future analyses.

These prompts provide a comprehensive framework for financial analysis across different company types, industries, and regions, enabling the LLM to deliver nuanced, context-appropriate insights.
