import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { TrendingUp, LogOut, Star, BarChart3, Info, Home, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = user
    ? [
        { to: "/stocks", label: "Stocks", icon: BarChart3 },
        { to: "/watchlist", label: "Watchlist", icon: Star },
        { to: "/about", label: "About", icon: Info },
      ]
    : [
        { to: "/about", label: "About", icon: Info },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav data-testid="navbar" className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-all duration-200 hover:opacity-70" data-testid="nav-logo">
            <TrendingUp className="w-5 h-5 text-zinc-900" />
            <span className="font-bold text-zinc-900 tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              StockPredict
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-sm ${
                  isActive(link.to)
                    ? "text-zinc-900 bg-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">{user.name || user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  data-testid="logout-btn"
                  className="text-zinc-500 hover:text-zinc-900 rounded-sm"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" data-testid="nav-login-btn" className="text-zinc-600 hover:text-zinc-900 rounded-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" data-testid="nav-register-btn" className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-200 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-sm ${
                  isActive(link.to) ? "text-zinc-900 bg-zinc-100" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 w-full"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-sm">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full bg-zinc-900 text-white rounded-sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
