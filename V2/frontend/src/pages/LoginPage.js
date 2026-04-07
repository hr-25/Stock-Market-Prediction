import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { TrendingUp, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/stocks");
    } else {
      setError(result.error);
    }
  };

  return (
    <div data-testid="login-page" className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-zinc-50/50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-zinc-900" />
            <span className="font-bold text-zinc-900 tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              StockPredict
            </span>
          </Link>
          <h1
            className="text-2xl font-bold text-zinc-900 tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Sign in
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-6 space-y-4">
          {error && (
            <div data-testid="login-error" className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="login-email-input"
              className="rounded-sm border-zinc-300 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="login-password-input"
              className="rounded-sm border-zinc-300 focus:ring-black"
              placeholder="Enter password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            data-testid="login-submit-btn"
            className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" data-testid="login-register-link" className="text-zinc-900 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
