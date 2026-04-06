# Stock Market Prediction System - PRD

## Original Problem Statement
Build a complete end-to-end web application for "Stock Market Prediction System – Data-Driven Investment Insights" with Linear Regression ML model, JWT auth, watchlist, prediction accuracy display.

## Architecture
- **Frontend**: React + Recharts + Tailwind + Shadcn UI
- **Backend**: FastAPI + MongoDB + scikit-learn
- **ML Model**: Linear Regression on user-provided CSV dataset (31 tickers, 1285 features)
- **Auth**: JWT with httpOnly cookies, bcrypt password hashing

## User Personas
- Students learning ML/finance
- Educators demonstrating stock prediction concepts
- Developers exploring full-stack ML apps

## Core Requirements
- Stock selection with search
- Historical price visualization
- ML prediction with trend direction (UP/DOWN)
- Prediction accuracy metrics (MAE, R², Trend Accuracy)
- Actual vs Predicted comparison chart
- Watchlist management
- Prediction history tracking
- JWT authentication

## What's Been Implemented (2026-04-06)
- Full backend with 12 API endpoints
- ML prediction engine with Linear Regression
- JWT auth (register, login, logout, me, refresh)
- Watchlist CRUD
- Prediction history storage
- Complete frontend with 7 pages
- Swiss/High-Contrast minimal design
- Cabinet Grotesk + IBM Plex Sans typography
- Recharts visualizations (Area chart, Line chart)
- Responsive design
- Admin seeding

## Prioritized Backlog
- P1: Login system enhancements (forgot password, reset)
- P1: Add more stock data sources
- P2: Real-time price alerts
- P2: Export predictions as PDF/CSV
- P3: Compare multiple stocks side by side
- P3: Additional ML models (Random Forest, XGBoost)
