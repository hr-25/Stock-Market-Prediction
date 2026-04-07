import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, TrendingUp, Star, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function StockSelectionPage() {
  const [tickers, setTickers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [addingTicker, setAddingTicker] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksRes, wlRes] = await Promise.all([
          axios.get(`${API}/stocks`, { withCredentials: true }),
          axios.get(`${API}/watchlist`, { withCredentials: true }).catch(() => ({ data: { watchlist: [] } })),
        ]);
        setTickers(stocksRes.data.tickers);
        setFiltered(stocksRes.data.tickers);
        setWatchlist(wlRes.data.watchlist.map((w) => w.ticker));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(tickers);
    } else {
      setFiltered(tickers.filter((t) => t.ticker.toLowerCase().includes(search.toLowerCase())));
    }
  }, [search, tickers]);

  const handleAddWatchlist = async (ticker, e) => {
    e.stopPropagation();
    setAddingTicker(ticker);
    try {
      if (watchlist.includes(ticker)) {
        await axios.delete(`${API}/watchlist/${ticker}`, { withCredentials: true });
        setWatchlist((prev) => prev.filter((t) => t !== ticker));
      } else {
        await axios.post(`${API}/watchlist`, { ticker }, { withCredentials: true });
        setWatchlist((prev) => [...prev, ticker]);
      }
    } catch (err) {
      console.error(err);
    }
    setAddingTicker(null);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div data-testid="stock-selection-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">Select</p>
        <h1 className="text-2xl sm:text-3xl tracking-tight font-bold text-zinc-900" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          Stock Tickers
        </h1>
        <p className="text-sm text-zinc-500 mt-1">{tickers.length} stocks available for analysis</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticker..."
          data-testid="stock-search-input"
          className="pl-10 rounded-sm border-zinc-300"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((stock) => (
          <div
            key={stock.ticker}
            onClick={() => navigate(`/predict/${stock.ticker}`)}
            data-testid={`stock-card-${stock.ticker}`}
            className="bg-white border border-zinc-200 p-4 cursor-pointer transition-all duration-200 hover:border-zinc-300 hover:shadow-sm group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {stock.ticker}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">{stock.records} records</p>
              </div>
              <button
                onClick={(e) => handleAddWatchlist(stock.ticker, e)}
                disabled={addingTicker === stock.ticker}
                data-testid={`watchlist-toggle-${stock.ticker}`}
                className="p-1.5 transition-all duration-200 hover:bg-zinc-100 rounded-sm"
              >
                <Star
                  className={`w-4 h-4 ${
                    watchlist.includes(stock.ticker) ? "fill-zinc-900 text-zinc-900" : "text-zinc-300 group-hover:text-zinc-500"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Last Close</p>
                <p className="text-xl font-bold text-zinc-900 tabular-nums" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  ${stock.last_close}
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
            </div>
            <p className="text-[10px] text-zinc-400 mt-2 tabular-nums">{stock.date_range}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-zinc-400 text-sm">No tickers found matching "{search}"</p>
        </div>
      )}
    </div>
  );
}
