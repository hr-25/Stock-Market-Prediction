import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, Trash2, Loader2, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingTicker, setRemovingTicker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wlRes, histRes] = await Promise.all([
          axios.get(`${API}/watchlist`, { withCredentials: true }),
          axios.get(`${API}/history`, { withCredentials: true }),
        ]);
        setWatchlist(wlRes.data.watchlist);
        setHistory(histRes.data.history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemove = async (ticker) => {
    setRemovingTicker(ticker);
    try {
      await axios.delete(`${API}/watchlist/${ticker}`, { withCredentials: true });
      setWatchlist((prev) => prev.filter((w) => w.ticker !== ticker));
    } catch (err) {
      console.error(err);
    }
    setRemovingTicker(null);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div data-testid="watchlist-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Watchlist Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-zinc-400" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Your</p>
        </div>
        <h1
          className="text-2xl sm:text-3xl tracking-tight font-bold text-zinc-900 mb-6"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          Watchlist
        </h1>

        {watchlist.length === 0 ? (
          <div className="bg-white border border-zinc-200 p-8 text-center">
            <Star className="w-6 h-6 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 mb-4">No stocks in your watchlist yet</p>
            <Button onClick={() => navigate("/stocks")} className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-sm" data-testid="browse-stocks-btn">
              Browse Stocks
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {watchlist.map((item) => (
              <div
                key={item.ticker}
                className="bg-white border border-zinc-200 p-4 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm group"
                data-testid={`watchlist-item-${item.ticker}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => navigate(`/predict/${item.ticker}`)}
                  >
                    <h3
                      className="text-lg font-bold text-zinc-900 tracking-tight group-hover:underline"
                      style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                    >
                      {item.ticker}
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.ticker)}
                    disabled={removingTicker === item.ticker}
                    data-testid={`remove-watchlist-${item.ticker}`}
                    className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    {removingTicker === item.ticker ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prediction History */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">Recent</p>
        <h2
          className="text-xl sm:text-2xl tracking-tight font-bold text-zinc-900 mb-6"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          Prediction History
        </h2>

        {history.length === 0 ? (
          <div className="bg-white border border-zinc-200 p-8 text-center">
            <TrendingUp className="w-6 h-6 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No predictions yet. Select a stock and run a prediction.</p>
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="prediction-history-table">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/50">
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Ticker</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Current</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Predicted</th>
                    <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Trend</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Accuracy</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-zinc-900">{h.ticker}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-600">${h.current_close}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-600">${h.predicted_close}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 ${
                            h.trend === "UP"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {h.trend === "UP" ? <TrendingUp className="w-3 h-3" /> : null}
                          {h.trend} {h.change_percent > 0 ? "+" : ""}{h.change_percent}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-600">{h.metrics?.trend_accuracy}%</td>
                      <td className="px-4 py-3 text-right text-zinc-400 text-xs">
                        {new Date(h.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
