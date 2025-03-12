import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import requests
from datetime import datetime

# RESULT
# Coefficients: [-0.12979951 -3.69718154  0.15531159  0.02233423 -0.12176068]
# Intercept: 0.298700107269387
# Mean Squared Error: 0.00951624448116753
# R^2 Score: 0.2700105005056772

# --- Netflix Prediction Verification ---
# Final DataFrame for NFLX:
#           date  revenue_growth_rate  operating_profit_margin       roe  debt_to_equity  fcf_yield
# 0  2024-12-31             0.156499                 0.267112  0.352077        0.629772   0.019856
# 1  2023-12-31             0.066668                 0.206208  0.262673        0.706384   0.019622
# 2  2022-12-31             0.064574                 0.178166  0.216193        0.690802   0.005466
# 3  2021-12-31             0.188101                 0.208584  0.322806        0.971207   0.001059
# 4  2020-12-31             0.118961                 0.183440  0.249556        1.473892   0.006547
# Netflix Data:
#          date  revenue_growth_rate  operating_profit_margin       roe  debt_to_equity  fcf_yield
# 0  2024-12-31             0.156499                 0.267112  0.352077        0.629772   0.019856
# 1  2023-12-31             0.066668                 0.206208  0.262673        0.706384   0.019622
# 2  2022-12-31             0.064574                 0.178166  0.216193        0.690802   0.005466
# 3  2021-12-31             0.188101                 0.208584  0.322806        0.971207   0.001059
# 4  2020-12-31             0.118961                 0.183440  0.249556        1.473892   0.006547
# Predicted Revenue Growth Rate for NFLX:
# 2023: 0.21608326625806412
# 2024: 0.20882826980648575

# --- Netflix Additional Predictions Summary ---
# Metric                    2023         2024        
# operating_profit_margin   0.32329851040353486 0.32329851040353486
# roe                       0.35791360190692156 0.35791360190692156
# debt_to_equity            0.8144891988128171 0.8144891988128171
# fcf_yield                 0.03847408206037113 0.03847408206037113

API_KEY = "uoo5z4vjEHjGx8lcqEv6XKng0ioW7cuY"  # Replace with your actual API key

def fetch_financial_metrics(symbol, years=5):
    """
    Fetches financial metrics for a given company symbol for the last 'years' annual reports using Financial Modeling Prep API.
    Metrics:
      1. Revenue Growth Rate
      2. Return on Equity (ROE)
      3. Free Cash Flow Yield
      4. Operating Profit Margin
      5. Debt-to-Equity Ratio
    """
    # Build API URLs
    income_url = f"https://financialmodelingprep.com/api/v3/income-statement/{symbol}?apikey={API_KEY}&limit={years+1}"
    balance_url = f"https://financialmodelingprep.com/api/v3/balance-sheet-statement/{symbol}?apikey={API_KEY}&limit={years}"
    cashflow_url = f"https://financialmodelingprep.com/api/v3/cash-flow-statement/{symbol}?apikey={API_KEY}&limit={years}"
    profile_url = f"https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={API_KEY}"

    try:
        income_data = requests.get(income_url).json()
        balance_data = requests.get(balance_url).json()
        cashflow_data = requests.get(cashflow_url).json()
        profile_data = requests.get(profile_url).json()
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return pd.DataFrame()


    # Check if profile data is valid
    if not isinstance(profile_data, list) or len(profile_data) == 0 or not isinstance(profile_data[0], dict):
        print(f"No valid profile data available for {symbol}")
        return pd.DataFrame()

    if not income_data or not balance_data or not cashflow_data or not profile_data:
        print(f"No data available for {symbol}")
        return pd.DataFrame()

    # Get market cap from profile (assume first element)
    market_cap = profile_data[0].get("mktCap", None)
    if not market_cap:
        print(f"Market cap not available for {symbol}")
        return pd.DataFrame()

    # Sort data by date descending (if not already sorted)
    income_data = sorted(income_data, key=lambda x: x["date"], reverse=True)
    balance_data = sorted(balance_data, key=lambda x: x["date"], reverse=True)
    cashflow_data = sorted(cashflow_data, key=lambda x: x["date"], reverse=True)

    metrics_data = []

    for i in range(years):
        try:
            current_income = income_data[i]
            # Compute revenue growth rate if previous year data is available
            if i < len(income_data) - 1:
                previous_income = income_data[i+1]
                current_revenue = float(current_income.get("revenue", 0))
                previous_revenue = float(previous_income.get("revenue", 0))
                revenue_growth = (current_revenue - previous_revenue) / (previous_revenue if previous_revenue != 0 else 1)
            else:
                revenue_growth = None

            revenue = float(current_income.get("revenue", 0))
            operating_income = float(current_income.get("operatingIncome", 0))
            op_margin = operating_income / revenue if revenue != 0 else None
            net_income = float(current_income.get("netIncome", 0))

            current_balance = balance_data[i]
            # totalStockholdersEquity might be under different keys, try both.
            total_equity = float(current_balance.get("totalStockholdersEquity", current_balance.get("stockholdersEquity", 0)))
            roe = net_income / total_equity if total_equity != 0 else None
            total_debt = float(current_balance.get("totalDebt", 0))
            debt_to_equity = total_debt / total_equity if total_equity != 0 else None

            current_cashflow = cashflow_data[i]
            operating_cf = float(current_cashflow.get("operatingCashFlow", 0))
            capex = float(current_cashflow.get("capitalExpenditures", 0))
            free_cash_flow = operating_cf + capex
            fcf_yield = free_cash_flow / market_cap if market_cap != 0 else None

            metrics_data.append({
                "date": current_income.get("date"),
                "revenue_growth_rate": revenue_growth,
                "operating_profit_margin": op_margin,
                "roe": roe,
                "debt_to_equity": debt_to_equity,
                "fcf_yield": fcf_yield
            })
        except Exception as e:
            print(f"Error processing {symbol} for year index {i}: {e}")

    df_metrics = pd.DataFrame(metrics_data)
    if 'revenue_growth_rate' in df_metrics.columns:
        avg_growth = df_metrics['revenue_growth_rate'].mean(skipna=True)
        df_metrics['revenue_growth_rate'] = df_metrics['revenue_growth_rate'].fillna(avg_growth)
    print(f"Final DataFrame for {symbol}:\n", df_metrics)
    return df_metrics


def fetch_data_for_companies(companies, years=5):
    """
    Fetch financial metrics for a list of companies over the last 'years' annual reports.
    """
    all_data = {}
    for symbol in companies:
        print(f"Fetching data for {symbol}...")
        df = fetch_financial_metrics(symbol, years)
        all_data[symbol] = df
    return all_data


def prepare_dataset(df, target_metric='revenue_growth_rate', feature_metrics=None):
    """
    Given a DataFrame of a company's historical financial metrics (with a 'date' column),
    this function prepares a dataset where for each time point t the features are the current
    period's metrics and the target is the target_metric value at t+1.
    
    Args:
        df: DataFrame sorted by date ascending.
        target_metric: The metric you wish to predict (e.g., 'revenue_growth_rate').
        feature_metrics: List of metric column names to use as features.
    
    Returns:
        X: Feature matrix.
        y: Target vector.
    """
    if feature_metrics is None:
        # Use all available metrics as features (including the one you're predicting)
        feature_metrics = ['roe', 'fcf_yield', 'operating_profit_margin', 'debt_to_equity', 'revenue_growth_rate']
    
    df = df.copy()
    df.sort_values('date', inplace=True)
    
    # Create the target by shifting the target_metric one period earlier
    df['target'] = df[target_metric].shift(-1)
    
    # Drop rows where any of the feature metrics or the target is missing
    df = df.dropna(subset=feature_metrics + ['target'])
    
    X = df[feature_metrics].values
    y = df['target'].values
    return X, y

# Example: Combine data from multiple companies.
# Assume `data` is a dictionary from your fetching script where each key is a company symbol
# and each value is a DataFrame of its metrics over time.
# For example, data might look like:
# data = { 'AAPL': df_aapl, 'MSFT': df_msft, ... }

def combine_company_data(data, target_metric, feature_metrics):
    X_all, y_all = [], []
    for symbol, df in data.items():
        if df.empty:
            continue
        X, y = prepare_dataset(df, target_metric=target_metric, feature_metrics=feature_metrics)
        if len(X) > 0:
            X_all.append(X)
            y_all.append(y)
    if X_all:
        X_all = np.vstack(X_all)
        y_all = np.concatenate(y_all)
        return X_all, y_all
    else:
        return None, None

# Define the feature metrics you'd like to use. You could include all five or a subset.
features = ['roe', 'fcf_yield', 'operating_profit_margin', 'debt_to_equity', 'revenue_growth_rate']

# Fetch data for selected companies using Financial Modeling Prep API
companies = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META']
data = fetch_data_for_companies(companies, years=5)
# Assuming `data` is already fetched from your previous script.
X_all, y_all = combine_company_data(data, 'revenue_growth_rate', features)

if X_all is None or y_all is None:
    print("Not enough data to build the regression model.")
else:
    # Step 3: Build the regression model using OLS (here using scikit-learn's LinearRegression)
    model = LinearRegression()
    model.fit(X_all, y_all)

    # Model parameters
    print("Coefficients:", model.coef_)
    print("Intercept:", model.intercept_)

    # Predict on the training set (or ideally on a separate test set)
    y_pred = model.predict(X_all)
    mse = mean_squared_error(y_all, y_pred)
    r2 = r2_score(y_all, y_pred)
    print("Mean Squared Error:", mse)
    print("R^2 Score:", r2)

def predict_future_for_company(model, df, steps=2, feature_metrics=['roe', 'fcf_yield', 'operating_profit_margin', 'debt_to_equity', 'revenue_growth_rate'], target_metric='revenue_growth_rate'):
    """
    Iteratively predict future target values for a company using the last available row as the base input.

    Args:
        model: Trained regression model.
        df: DataFrame of the company's historical financial metrics (with a 'date' column), sorted by date ascending.
        steps: Number of future periods to predict.
        feature_metrics: List of metric column names to use as features.

    Returns:
        List of predicted target values for each future step.
    """
    df = df.copy()
    df.sort_values('date', inplace=True)
    last_row = df.iloc[-1].copy()
    predictions = []
    for i in range(steps):
        # Prepare input vector using the current values of the feature metrics
        X_new = np.array([last_row[metric] for metric in feature_metrics]).reshape(1, -1)
        y_pred = model.predict(X_new)[0]
        predictions.append(y_pred)
        # Update the feature for the target metric with the predicted value (iterative forecasting)
        last_row[target_metric] = y_pred
    return predictions

def predict_metrics_for_company(data, company_df, target_feature_map, steps=2):
    """
    Predicts multiple financial metrics for a company by training separate regression models for each target metric.
    
    Args:
        data: Dictionary of company data (each value is a DataFrame of historical metrics).
        company_df: DataFrame of the target company's historical financial metrics (sorted by date ascending).
        target_feature_map: Dictionary mapping target metric names to a list of feature metric names.
        steps: Number of future periods to predict.
        
    Returns:
        Dictionary mapping each target metric to its list of predicted future values.
    """
    predictions_summary = {}
    for target, feat in target_feature_map.items():
        X_train, y_train = combine_company_data(data, target, feat)
        if X_train is None or y_train is None or len(X_train) == 0:
            predictions_summary[target] = ["Not enough data"] * steps
        else:
            reg_model = LinearRegression()
            reg_model.fit(X_train, y_train)
            preds = predict_future_for_company(reg_model, company_df, steps=steps, feature_metrics=feat, target_metric=target)
            predictions_summary[target] = preds
    return predictions_summary

# Netflix Prediction Verification Step
print("\n--- Netflix Prediction Verification ---")

# Fetch Netflix data for the last 5 years
netflix_data = fetch_financial_metrics('NFLX', years=5)
if netflix_data.empty:
    print("Netflix data is not available.")
else:
    print("Netflix Data:")
    print(netflix_data)

    # Predict future Revenue Growth Rate for NFLX for 2 future periods (e.g., 2023 and 2024)
    future_predictions = predict_future_for_company(model, netflix_data, steps=2)
    print("Predicted Revenue Growth Rate for NFLX:")
    print("2023:", future_predictions[0])
    print("2024:", future_predictions[1])

# Generalized predictions for additional metrics for Netflix
target_feature_map = {
    'operating_profit_margin': ['roe', 'fcf_yield', 'debt_to_equity', 'revenue_growth_rate'],
    'roe': ['operating_profit_margin', 'fcf_yield', 'debt_to_equity', 'revenue_growth_rate'],
    'debt_to_equity': ['operating_profit_margin', 'roe', 'fcf_yield', 'revenue_growth_rate'],
    'fcf_yield': ['operating_profit_margin', 'roe', 'debt_to_equity', 'revenue_growth_rate']
}

predictions_summary = predict_metrics_for_company(data, netflix_data, target_feature_map, steps=2)

print("\n--- Netflix Additional Predictions Summary ---")
print(f"{'Metric':<25} {'2023':<12} {'2024':<12}")
for metric in ['operating_profit_margin', 'roe', 'debt_to_equity', 'fcf_yield']:
    preds = predictions_summary.get(metric, ["N/A", "N/A"])
    pred_2023 = preds[0] if len(preds) > 0 else "N/A"
    pred_2024 = preds[1] if len(preds) > 1 else "N/A"
    print(f"{metric:<25} {pred_2023:<12} {pred_2024:<12}")