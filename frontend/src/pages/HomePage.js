import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { TrendingUp, BarChart3, Shield, Zap } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div data-testid="home-page" className="min-h-[calc(100vh-56px)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/30506523/pexels-photo-30506523.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 animate-fade-in">
              Data-Driven Investment Insights
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-black text-zinc-900 leading-none animate-fade-in animate-fade-in-delay-1"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Stock Market
              <br />
              Prediction System
            </h1>
            <p className="mt-6 text-base sm:text-lg text-zinc-500 max-w-xl leading-relaxed animate-fade-in animate-fade-in-delay-2">
              Predict short-term stock price trends using Linear Regression on historical data.
            </p>
            <div className="mt-8 flex gap-3 animate-fade-in animate-fade-in-delay-3">
              {user ? (
                <Link to="/stocks">
                  <Button size="lg" data-testid="hero-explore-btn" className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-sm px-8">
                    Explore Stocks
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" data-testid="hero-get-started-btn" className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-sm px-8">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Features</p>
          <h2
            className="text-2xl sm:text-3xl tracking-tight font-bold text-zinc-900 mb-12"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            What you can do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Historical Analysis",
                desc: "View detailed price history with OHLCV data across 31 stock tickers. Interactive charts powered by Recharts.",
              },
              {
                icon: TrendingUp,
                title: "ML Predictions",
                desc: "Linear Regression model trained on 1280+ technical indicators. Get next-day price predictions and trend direction.",
              },
              {
                icon: Shield,
                title: "Track & Monitor",
                desc: "Build your personal watchlist. Track prediction history and model accuracy metrics over time.",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="bg-white border border-zinc-200 p-6 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm"
                data-testid={`feature-card-${i}`}
              >
                <feature.icon className="w-5 h-5 text-zinc-900 mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Stock Tickers", value: "31" },
              { label: "Features", value: "1,280+" },
              { label: "Data Points", value: "7,700+" },
              { label: "Model", value: "Linear Reg" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
