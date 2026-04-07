import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score
from sklearn.preprocessing import StandardScaler
import joblib
import os
import logging

logger = logging.getLogger(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "stock_data.csv")

# Key features to use for prediction
KEY_FEATURES = [
    "open", "high", "low", "close", "adjclose", "volume",
    "RSIadjclose15", "RSIvolume15",
    "MACDhistadjclose15", "MACDhistvolume15",
    "emaadjclose5", "emavolume5", "emaadjclose10",
    "smaadjclose5", "smavolume5", "smaadjclose10",
    "atr5", "atr10",
    "cci5", "cci10",
    "feargreed",
    "laglow1", "laghigh1", "lagvolume1",
    "laglow2", "laghigh2", "lagvolume2",
]

_df_cache = None
_models_cache = {}


def load_dataset():
    global _df_cache
    if _df_cache is not None:
        return _df_cache
    logger.info("Loading stock dataset...")
    df = pd.read_csv(DATA_PATH)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(["ticker", "date"]).reset_index(drop=True)
    _df_cache = df
    logger.info(f"Loaded {len(df)} rows, {df['ticker'].nunique()} tickers")
    return df


def get_tickers():
    df = load_dataset()
    tickers = sorted(df["ticker"].unique().tolist())
    ticker_info = []
    for t in tickers:
        sub = df[df["ticker"] == t]
        last_row = sub.iloc[-1]
        first_row = sub.iloc[0]
        ticker_info.append({
            "ticker": t,
            "records": len(sub),
            "date_range": f"{first_row['date'].strftime('%Y-%m-%d')} to {last_row['date'].strftime('%Y-%m-%d')}",
            "last_close": round(float(last_row["close"]), 2),
        })
    return ticker_info


def get_stock_data(ticker):
    df = load_dataset()
    sub = df[df["ticker"] == ticker].copy()
    if sub.empty:
        return None

    sub = sub.sort_values("date")
    records = []
    for _, row in sub.iterrows():
        records.append({
            "date": row["date"].strftime("%Y-%m-%d"),
            "open": round(float(row["open"]), 2) if pd.notna(row["open"]) else None,
            "high": round(float(row["high"]), 2) if pd.notna(row["high"]) else None,
            "low": round(float(row["low"]), 2) if pd.notna(row["low"]) else None,
            "close": round(float(row["close"]), 2) if pd.notna(row["close"]) else None,
            "volume": int(row["volume"]) if pd.notna(row["volume"]) else None,
        })
    return records


def train_and_predict(ticker):
    df = load_dataset()
    sub = df[df["ticker"] == ticker].copy()
    if sub.empty or len(sub) < 20:
        return None

    sub = sub.sort_values("date").reset_index(drop=True)

    # Create target: next day close price
    sub["next_close"] = sub["close"].shift(-1)
    sub = sub.dropna(subset=["next_close"])

    # Select available features
    available_features = [f for f in KEY_FEATURES if f in sub.columns]
    feature_df = sub[available_features].copy()

    # Fill NaN with column median
    for col in feature_df.columns:
        feature_df[col] = pd.to_numeric(feature_df[col], errors="coerce")
        median_val = feature_df[col].median()
        if pd.isna(median_val):
            median_val = 0
        feature_df[col] = feature_df[col].fillna(median_val)

    X = feature_df.values
    y = sub["next_close"].values[:len(X)]
    dates = sub["date"].values[:len(X)]
    actual_close = sub["close"].values[:len(X)]

    # Train-test split (80-20, keep order)
    split_idx = int(len(X) * 0.8)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    dates_test = dates[split_idx:]
    actual_close_test = actual_close[split_idx:]

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train model
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)

    # Predict on test set
    y_pred = model.predict(X_test_scaled)

    # Metrics
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    # Trend accuracy
    actual_trend = (y_test > actual_close_test).astype(int)
    predicted_trend = (y_pred > actual_close_test).astype(int)
    trend_accuracy = accuracy_score(actual_trend, predicted_trend)

    # Predict next day (using last available row)
    last_features = sub[available_features].iloc[-1:].copy()
    for col in last_features.columns:
        last_features[col] = pd.to_numeric(last_features[col], errors="coerce")
        if last_features[col].isna().any():
            last_features[col] = feature_df[col].median()

    last_scaled = scaler.transform(last_features.values)
    next_day_pred = float(model.predict(last_scaled)[0])
    current_close = float(sub["close"].iloc[-1])
    trend = "UP" if next_day_pred > current_close else "DOWN"
    change_pct = ((next_day_pred - current_close) / current_close) * 100

    # Build comparison data for chart
    comparison = []
    for i in range(len(dates_test)):
        comparison.append({
            "date": pd.Timestamp(dates_test[i]).strftime("%Y-%m-%d"),
            "actual": round(float(y_test[i]), 2),
            "predicted": round(float(y_pred[i]), 2),
        })

    return {
        "ticker": ticker,
        "current_close": round(current_close, 2),
        "predicted_close": round(next_day_pred, 2),
        "trend": trend,
        "change_percent": round(change_pct, 2),
        "metrics": {
            "mae": round(mae, 4),
            "r2_score": round(r2, 4),
            "trend_accuracy": round(trend_accuracy * 100, 2),
        },
        "comparison_data": comparison,
        "features_used": available_features,
        "train_size": split_idx,
        "test_size": len(X_test),
    }
