import { BarChart3, TrendingUp, Database, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div data-testid="about-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">About</p>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-black text-zinc-900"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          Project Overview
        </h1>
        <p className="text-base text-zinc-500 mt-4 max-w-2xl leading-relaxed">
          A complete end-to-end Stock Market Prediction System designed for educational purposes. 
          This project demonstrates how machine learning can be applied to financial data to predict 
          short-term stock price trends.
        </p>
      </div>

      {/* Image */}
      <div className="mb-12 border border-zinc-200 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwZGFzaGJvYXJkJTIwZGF0YXxlbnwwfHx8fDE3NzU0NTU3OTJ8MA&ixlib=rb-4.1.0&q=85"
          alt="Stock market data visualization"
          className="w-full h-48 sm:h-64 object-cover"
          data-testid="about-image"
        />
      </div>

      {/* Architecture */}
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl tracking-tight font-bold text-zinc-900 mb-6" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          System Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: BarChart3,
              title: "Frontend (React)",
              items: ["Modern responsive dashboard", "Interactive Recharts visualizations", "Real-time prediction display", "Watchlist management"],
            },
            {
              icon: TrendingUp,
              title: "Backend (FastAPI)",
              items: ["REST API endpoints", "JWT authentication", "ML model inference", "MongoDB data storage"],
            },
            {
              icon: Database,
              title: "ML Model",
              items: ["Linear Regression algorithm", "1,280+ technical indicators", "Train-test split validation", "Trend direction prediction"],
            },
            {
              icon: Shield,
              title: "Dataset",
              items: ["31 stock tickers", "7,700+ data points", "RSI, MACD, EMA, SMA, ATR, CCI", "Bollinger Bands, Stochastic"],
            },
          ].map((section) => (
            <div key={section.title} className="bg-white border border-zinc-200 p-6">
              <section.icon className="w-5 h-5 text-zinc-900 mb-3" />
              <h3 className="text-base font-bold text-zinc-900 mb-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="text-sm text-zinc-500 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-zinc-300 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl tracking-tight font-bold text-zinc-900 mb-6" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          Data Flow
        </h2>
        <div className="bg-white border border-zinc-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            {["User Input", "REST API", "ML Model", "Prediction"].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="bg-zinc-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] whitespace-nowrap">
                  {step}
                </div>
                {i < 3 && <span className="text-zinc-300 hidden sm:block">&rarr;</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-zinc-50 border border-zinc-200 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Disclaimer</p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          This project is designed for <strong>educational purposes only</strong>. It does not provide real financial advice 
          or real-time trading recommendations. The predictions are generated using a simple Linear Regression model 
          and should not be used for actual investment decisions. Always consult a qualified financial advisor before 
          making investment choices.
        </p>
      </div>
    </div>
  );
}
