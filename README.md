# FinCompare

A financial data comparison tool for investment insights.

## Overview

Compare financial data between companies, with key metrics, charts, and analysis.

## Features

- Company and competitor selection
- Financial dashboards and metrics
- Interactive stock price charts
- Financial statements comparison
- Ratio analysis
- AI-powered metric importance ranking (powered by Google's Gemini API)
- Personalized metric recommendations based on user preferences
- Industry-specific insights and analysis
- Visualization recommendations for optimal data presentation

## Tech Stack

- React
- TypeScript
- TailwindCSS
- Mock data (API integration planned)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Access the app at http://localhost:5173

## The next things to implement

Competitor Selection Encouragement (1 day)

Quickly enhances user engagement by explicitly prompting users to explore deeper comparative insights.
Actionable Insights Upon Stock Selection (1-2 days)

Immediately delivers value, significantly boosting user satisfaction and retention by providing instant, meaningful insights after selecting a stock.

## Development Notes

Currently uses mock data. See `src/data/` directory.

UI components are in `src/components/` with customizable widgets for future flexibility.

## TODO this sprint

1. AI-driven Similarity and Recommendations

DR prompt "I need an article about comparing predicting specific company price based on historical key indicators (like PE, margin, profic and etc) other company but 1-2-3 years ago" + " I need an example of such framework applied to specific companies pairs. I care about indicators were used and selection of "similar" company approach (like calculation cos distance between indicators or something like that)"

Academic research has applied methods like k-medians clustering on financial ratios​
BACKOFFICE.BIBLIO.UGENT.BE
 and even cosine or Mahalanobis distance on entire financial statement vectors​
BACKOFFICE.BIBLIO.UGENT.BE
 to identify comparable firms



Indicator	PayPal (2016) Historical​
NEWSROOM.PAYPAL-CORP.COM
​
MACROTRENDS.NET
Square/Block (2019) Current​
S21.Q4CDN.COM
​
FINANCECHARTS.COM
Revenue	$10.84 billion (2016)​
NEWSROOM.PAYPAL-CORP.COM
$4.71 billion (2019)​
S21.Q4CDN.COM
Revenue Growth (YoY)	+17% (2016)​
NEWSROOM.PAYPAL-CORP.COM
+43% (2019)​
S21.Q4CDN.COM
Net Income	$1.40 billion (2016)​
MACROTRENDS.NET
$0.375 billion (2019)​
FINANCECHARTS.COM
Net Profit Margin	12.9% (profitable)	8.0% (moderate profit)
P/E Ratio (Year-end)	~34 (at end 2016)​
MACROTRENDS.NET
~70 (at end 2019)*
Debt-to-Equity (D/E)	~0.4 (low leverage, est.)	~0.5 (low-moderate, est.)
Active Customer Accounts	~197 million (2016)**	~24 million (2019)**
Stock Price Outcome (analog’s next 2–3 years)	+174% (PayPal 2016–2019)​
MACROTRENDS.NET
+>200% (Square 2019–2021)​
COMPANIESMARKETCAP.COM
​
NETCIALS.COM

Implement AI-based sorting by similarity for companies.

Clearly label AI-suggested UI elements with an "✨ AI Recommended" badge.

Provide concise explanations next to highlighted UI elements explaining why they're recommended (e.g., "Research & Innovation identified as critical due to rapid industry changes affecting Adyen’s growth potential").

2. Actionable Insights on Selection

Upon initial stock selection, prompt users with actionable insights (e.g., "Did you know Alphabet's stock increased by X% compared to Apple this quarter?").

3. Competitor Selection Encouragement

Implement micro-copy or subtle animations encouraging users to select a competitor after choosing the primary stock (e.g., tooltip: "Select a competitor to reveal detailed comparative insights.").

4. Enhanced Search Result Clarity

Visually differentiate ticker symbols from company names (e.g., brighter font or distinct color).

Add industry/category tags (Tech, Financial, etc.) in the search dropdown to help users contextualize quickly.

5. Immediate Value upon Stock Selection from Search

Display brief key insights or recent highlights instantly after selection (e.g., “Adyen stock rose by 5% last week”).

6. Improved Comparative Chart Visualization

Implement dual-axis charts for clearer visualization when comparing stocks with significantly different prices.

7. Actionable Summary for Charts

Provide a short, highlighted summary beneath comparison charts (e.g., "Alphabet significantly outperformed Adyen during the selected period.").

8. Tooltips for Complex Financial Metrics

Add interactive tooltips or "?" icons for complex metrics like P/E Ratio, Quick Ratio, and Beta to improve user comprehension without navigating away from the current view.

## prompts TODO

🟢 #0 Trending Comparisons
Integration: Easy (clear API endpoint and prompt)
Robustness: High (straightforward prompt response)
Recommendation: Highly recommended—clear immediate value to users.

```
You are an AI assistant specialized in financial market analysis. Provide a list of 5 currently trending or popular stock comparisons among investors. 

Format the response as a JSON array. Each comparison should include:
- "company_1": First company's full name.
- "ticker_1": First company's stock ticker symbol.
- "company_2": Second company's full name.
- "ticker_2": Second company's stock ticker symbol.
- "reason": Briefly explain why investors are actively comparing these two stocks (e.g., recent earnings reports, market competition, similar growth patterns).

Example Format:
[
  {
    "company_1": "Tesla, Inc.",
    "ticker_1": "TSLA",
    "company_2": "Rivian Automotive, Inc.",
    "ticker_2": "RIVN",
    "reason": "Recent EV market developments and competition in electric truck manufacturing."
  },
  ...
]
```


🟢 #1 Executive Summaries of Companies
Integration: Easy (clear and consistent output format)
Robustness: High (clear and reusable prompt structure)
Value: High impact, instantly useful for users seeking quick company snapshots.

```
You are a financial analyst AI providing concise executive summaries for companies based on recent financial data.

Generate a clear and insightful executive summary for the company "[COMPANY_NAME]" (ticker: [TICKER]) that includes:

- Brief description of the company's primary business activities.
- Overview of recent financial performance and trends (revenue growth, profitability, notable strengths, or risks).
- Current position within its industry (market standing, competitive advantages, or market challenges).
- Short commentary on key competitive dynamics or recent events affecting the company.

The summary should be concise (approx. 100-150 words), actionable, and useful for investors.

Example Output:

\"Executive Summary:
Alphabet Inc. (GOOG) is a leading technology company known primarily for its search engine, advertising services, and diverse tech products. In the past quarter, Alphabet demonstrated strong revenue growth of 13.9% year-over-year, driven by increased advertising revenue and cloud computing services. With a net profit margin of 28.6%, Alphabet maintains robust profitability, although competitive pressures in cloud and AI present potential risks. Investors should monitor rising operational expenses impacting future margins but can remain optimistic given Alphabet's continued innovation and financial health.\"

Format your response similarly, maintaining clarity and conciseness."
```

🟢 #2 Competitors
```
You're an AI financial analyst specializing in competitive analysis.

Provide a clear, concise list of 5-7 major competitors for "[COMPANY_NAME]" ([TICKER]). 

For each competitor, include:
- "competitor_name": Name of the competitor company.
- "ticker": Competitor company's ticker symbol.
- "reason": A brief explanation (1-2 sentences) why this company is considered a major competitor. Focus on market overlap, similar products or services, and direct competitive dynamics.

Format your response as a JSON array, for example:

[
  {
    "competitor_name": "Ford Motor Company",
    "ticker": "F",
    "reason": "Directly competes with Tesla through significant investments in electric vehicles and autonomous driving technologies."
  },
  ...
]

Ensure the provided competitors represent meaningful competitive threats or alternatives for investors to consider.
```

🟢 #3 Industry-Specific Metric Explanation
Request Example:

"Provide a list of 5 metrics for EV companies, with brief explanations."

Integration: Easy (clear output format, stable LLM responses)
Robustness: High, standardized format, easy error handling.
User Value: High, helps educate users and contextualize analysis.

```
You're an AI financial analyst providing clear explanations of key financial metrics for specific industries.

Generate a JSON-formatted list of the **5 most important financial metrics** investors typically use to evaluate companies within the "[INDUSTRY_NAME]" industry.

Each metric should include:
- "metric": Name of the financial metric.
- "explanation": A concise, investor-friendly explanation of why this metric is particularly important for evaluating companies in this industry.

Example JSON Output:

[
  {
    "metric": "Net Profit Margin",
    "explanation": "Indicates how efficiently a company converts revenue into actual profit, essential in evaluating overall profitability."
  },
  {
    "metric": "R&D as Percentage of Revenue",
    "explanation": "Measures innovation investment intensity, crucial for technology-driven industries to sustain competitive advantage."
  }
  ...
]

Please maintain clarity and brevity in your explanations to ensure easy understanding by users."
```

🟡 #4 SWOT

```
You're an AI financial analyst tasked with providing a concise SWOT analysis for publicly traded companies.

Generate a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for "[COMPANY_NAME]" ([TICKER]) formatted as a clear JSON object.

The analysis should follow this structure precisely:

{
  "company": "[COMPANY_NAME]",
  "ticker": "[TICKER]",
  "strengths": [
    "Brief, actionable strength 1",
    "Brief, actionable strength 2",
    ...
  ],
  "weaknesses": [
    "Clear weakness 1",
    "Clear weakness 2",
    ...
  ],
  "opportunities": [
    "Identified growth opportunity 1",
    "Identified growth opportunity 2",
    ...
  ],
  "threats": [
    "Relevant risk or competitive threat 1",
    "Relevant risk or competitive threat 2",
    ...
  ]
}

Maintain brevity and ensure each SWOT component contains 2-4 concise, actionable bullet points clearly relevant to investors.
```

🟡 #1 Company Executive Summaries
Request Example:

"Generate a summary of Adyen based on this Tesla executive summary example."

Integration: Moderate (needs fine-tuning prompt clarity and format consistency)
Robustness: Good but requires testing to ensure consistency across companies.

```
You're an AI financial analyst tasked with creating concise and insightful executive summaries of publicly traded companies.

Generate a brief executive summary (approx. 100-150 words) for "[COMPANY_NAME]" ([TICKER]). The summary should include:

- A clear overview of the company’s core business activities and markets.
- Highlights of recent financial performance (mention growth rate, profitability trends, significant strengths, or concerns).
- The company's current competitive positioning in its industry, mentioning any unique competitive advantages or challenges.
- Brief commentary on recent developments, strategic moves, or industry events affecting the company’s outlook.

Example:

"Executive Summary:
Tesla, Inc. (TSLA) is a global leader in electric vehicle manufacturing, renewable energy solutions, and autonomous driving technologies. Tesla continues robust revenue growth, with a 42.3% compound annual growth rate over the past five years, coupled with steadily improving profit margins. Despite consistent profitability, valuation models indicate the stock price currently exceeds calculated intrinsic values under various scenarios. Tesla’s industry-leading technology, expanding production capacities, and strong brand equity sustain its dominant market position, though growing competition in the EV sector and regulatory risks remain key factors investors should monitor closely."

Provide a similarly structured, clear, and concise executive summary for the requested company."
```

🟡 #2 Multi-year Price Horizon Analysis
Request Example:

"Could you provide Tesla price predictions for the next 2-3 years?"

Integration: Moderate complexity (clear prompt needed, plus careful communication about uncertainty)
Robustness: Generally robust if kept qualitative (scenario-based rather than specific price targets).
```
You're an AI financial analyst providing scenario-based multi-year price horizon analyses for publicly traded companies.

Provide a structured, insightful analysis outlining potential stock price scenarios for "[COMPANY_NAME]" ([TICKER]) over a 2-3 year horizon. 

Include the following clearly-defined scenarios:

1. **Optimistic Scenario**:
   - Key positive assumptions (e.g., rapid growth, increased profitability, market expansion).
   - Estimated price trajectory or valuation implications.

2. **Base Case Scenario**:
   - Most likely outcomes based on current trends.
   - Balanced assumptions regarding growth, market conditions, and profitability.
   - Estimated price trajectory or valuation implications.

3. **Pessimistic Scenario**:
   - Main risks or challenges (e.g., increased competition, regulatory pressures, declining margins).
   - Potential impact on stock price or valuation implications.

Provide each scenario briefly and clearly, helping investors understand plausible outcomes without implying certainty.

Format example:

**Optimistic Scenario**  
Assuming strong growth and sustained market leadership, stock price appreciation could reach X%-Y% over the next 2-3 years.

**Base Case Scenario**  
Moderate growth and stable market conditions suggest potential price appreciation of A%-B%.

**Pessimistic Scenario**  
Intensified competition or margin pressures may limit growth, with stock prices potentially remaining flat or declining by C%-D%.

Maintain clarity, brevity, and neutrality throughout your analysis.

```

🗒️ Recommendations:
Start with Trending Comparisons and Industry-Specific Metrics, as these will quickly demonstrate tangible value with minimal complexity.
Follow up with Executive Summaries and Multi-year Price Horizon Analysis after verifying reliability and prompt effectiveness.
Consider the Specific Metric Categories last, as these may require more refinement and experimentation.