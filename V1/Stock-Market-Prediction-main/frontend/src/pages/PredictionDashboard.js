import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { Button } from "../components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Loader2, BarChart3, Target, Activity } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PredictionDashboard() {
  const { ticker } = useParams();
  const [stockData, setStockData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const { data } = await axios.get(`${API}/stock-data/${ticker}`, { withCredentials: true });
        setStockData(data.data);
      } catch (err) {
        setError("Failed to load stock data");
      } finally {
        setLoadingData(false);
      }
    };
    fetchStock();
  }, [ticker]);

  const handlePredict = async () => {
    setLoadingPrediction(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/predict/${ticker}`, {}, { withCredentials: true });
      setPrediction(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed");
    } finally {
      setLoadingPrediction(false);
    }
  };

  // Prepare historical chart data (last 60 days)
  const historicalChart = stockData
    ? stockData.slice(-60).map((d) => ({
        date: d.date,
        close: d.close,
        high: d.high,
        low: d.low,
      }))
    : [];

  if (loadingData) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div data-testid="prediction-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/stocks" data-testid="back-to-stocks">
          <Button variant="ghost" size="sm" className="rounded-sm text-zinc-500 hover:text-zinc-900">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">Analysis</p>
          <h1
            className="text-3xl sm:text-4xl tracking-tighter font-black text-zinc-900"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="ticker-heading"
          >
            {ticker}
          </h1>
          {stockData && (
            <p className="text-sm text-zinc-500 mt-1">
              {stockData.length} data points &middot; Last: ${stockData[stockData.length - 1]?.close}
            </p>
          )}
        </div>
        <Button
          onClick={handlePredict}
          disabled={loadingPrediction}
          data-testid="predict-button"
          className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-sm px-6"
          size="lg"
        >
          {loadingPrediction ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
          Run Prediction
        </Button>
      </div>

      {error && (
        <div data-testid="prediction-error" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Historical Chart - spans 3 cols */}
        <div className="lg:col-span-3 bg-white border border-zinc-200 p-4 sm:p-6" data-testid="historical-chart">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Historical Prices (Last 60 Days)</h3>
          </div>
          <div className="h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalChart}>
                <defs>
                  <linearGradient id="closeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#09090B" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#09090B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#A1A1AA" }}
                  tickFormatter={(v) => v.slice(5)}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10, fill: "#A1A1AA" }} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "2px", fontSize: "12px", fontFamily: "'IBM Plex Sans', sans-serif" }}
                />
                <Area type="monotone" dataKey="close" stroke="#09090B" strokeWidth={1.5} fill="url(#closeGrad)" name="Close" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="space-y-4">
          {stockData && stockData.length > 0 && (
            <>
              <MetricCard label="Current Close" value={`$${stockData[stockData.length - 1].close}`} testId="metric-close" />
              <MetricCard label="Day High" value={`$${stockData[stockData.length - 1].high}`} testId="metric-high" />
              <MetricCard label="Day Low" value={`$${stockData[stockData.length - 1].low}`} testId="metric-low" />
              <MetricCard
                label="Volume"
                value={stockData[stockData.length - 1].volume?.toLocaleString() || "N/A"}
                testId="metric-volume"
              />
            </>
          )}
        </div>
      </div>

      {/* Prediction Results */}
      {prediction && (
        <div className="mt-6 animate-fade-in">
          {/* Trend + Prediction Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div
              className={`border p-6 col-span-1 md:col-span-2 flex items-center gap-4 ${
                prediction.trend === "UP"
                  ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-red-50/50 border-red-200"
              }`}
              data-testid={prediction.trend === "UP" ? "trend-indicator-up" : "trend-indicator-down"}
            >
              {prediction.trend === "UP" ? (
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Predicted Trend</p>
                <p
                  className={`text-2xl font-black tracking-tight ${
                    prediction.trend === "UP" ? "text-emerald-700" : "text-red-700"
                  }`}
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {prediction.trend} {prediction.change_percent > 0 ? "+" : ""}{prediction.change_percent}%
                </p>
              </div>
            </div>

            <MetricCard label="Predicted Close" value={`$${prediction.predicted_close}`} testId="metric-predicted" />
            <MetricCard label="Current Close" value={`$${prediction.current_close}`} testId="metric-current" />
          </div>

          {/* Model Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <MetricCard label="MAE" value={prediction.metrics.mae} testId="metric-mae" />
            <MetricCard label="R² Score" value={prediction.metrics.r2_score} testId="metric-r2" />
            <MetricCard
              label="Trend Accuracy"
              value={`${prediction.metrics.trend_accuracy}%`}
              testId="metric-accuracy"
              highlight
            />
          </div>

          {/* Prediction vs Actual Chart */}
          <div className="bg-white border border-zinc-200 p-4 sm:p-6" data-testid="prediction-chart">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Predicted vs Actual (Test Set)</h3>
            </div>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prediction.comparison_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#A1A1AA" }}
                    tickFormatter={(v) => v.slice(5)}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#A1A1AA" }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "2px", fontSize: "12px", fontFamily: "'IBM Plex Sans', sans-serif" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="actual" stroke="#09090B" strokeWidth={1.5} dot={false} name="Actual" />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 bg-white border border-zinc-200 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Model Details</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-zinc-400">Algorithm</span>
                <p className="font-medium text-zinc-900">Linear Regression</p>
              </div>
              <div>
                <span className="text-zinc-400">Train Size</span>
                <p className="font-medium text-zinc-900 tabular-nums">{prediction.train_size}</p>
              </div>
              <div>
                <span className="text-zinc-400">Test Size</span>
                <p className="font-medium text-zinc-900 tabular-nums">{prediction.test_size}</p>
              </div>
              <div>
                <span className="text-zinc-400">Features</span>
                <p className="font-medium text-zinc-900 tabular-nums">{prediction.features_used.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, testId, highlight }) {
  return (
    <div
      className={`bg-white border border-zinc-200 p-4 transition-all duration-200 hover:border-zinc-300 ${highlight ? "ring-1 ring-zinc-900" : ""}`}
      data-testid={testId}
    >
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-zinc-900 tabular-nums" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {value}
      </p>
    </div>
  );
}
