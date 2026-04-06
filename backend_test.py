import requests
import sys
import json
from datetime import datetime

class StockPredictionAPITester:
    def __init__(self, base_url="https://price-predictor-44.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_stocks_endpoint(self):
        """Test GET /api/stocks"""
        success, response = self.run_test(
            "Get Stock Tickers",
            "GET",
            "stocks",
            200
        )
        if success and 'tickers' in response:
            tickers = response['tickers']
            print(f"   Found {len(tickers)} tickers")
            if len(tickers) >= 31:
                print("   ✅ Has expected number of tickers (31+)")
            else:
                print(f"   ⚠️  Expected 31+ tickers, got {len(tickers)}")
            return tickers
        return []

    def test_auth_login(self, email="admin@example.com", password="admin123"):
        """Test POST /api/auth/login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'id' in response:
            print(f"   ✅ Logged in as: {response.get('email')} (Role: {response.get('role')})")
            return True
        return False

    def test_auth_register(self):
        """Test POST /api/auth/register"""
        test_email = f"test_user_{datetime.now().strftime('%H%M%S')}@example.com"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={"email": test_email, "password": "TestPass123!", "name": "Test User"}
        )
        if success and 'id' in response:
            print(f"   ✅ Registered user: {response.get('email')}")
            return True
        return False

    def test_auth_me(self):
        """Test GET /api/auth/me"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        if success and 'email' in response:
            print(f"   ✅ Current user: {response.get('email')} (Role: {response.get('role')})")
            return True
        return False

    def test_auth_logout(self):
        """Test POST /api/auth/logout"""
        success, response = self.run_test(
            "Logout",
            "POST",
            "auth/logout",
            200
        )
        return success

    def test_stock_data(self, ticker="ASML"):
        """Test GET /api/stock-data/{ticker}"""
        success, response = self.run_test(
            f"Get Stock Data for {ticker}",
            "GET",
            f"stock-data/{ticker}",
            200
        )
        if success and 'data' in response:
            data_points = len(response['data'])
            print(f"   ✅ Found {data_points} data points for {ticker}")
            return True
        return False

    def test_prediction(self, ticker="ASML"):
        """Test POST /api/predict/{ticker}"""
        success, response = self.run_test(
            f"Run Prediction for {ticker}",
            "POST",
            f"predict/{ticker}",
            200,
            data={}
        )
        if success:
            required_fields = ['ticker', 'current_close', 'predicted_close', 'trend', 'change_percent', 'metrics', 'comparison_data']
            missing_fields = [field for field in required_fields if field not in response]
            if not missing_fields:
                print(f"   ✅ Prediction: {response.get('trend')} {response.get('change_percent')}%")
                print(f"   ✅ Current: ${response.get('current_close')}, Predicted: ${response.get('predicted_close')}")
                print(f"   ✅ Metrics: MAE={response.get('metrics', {}).get('mae')}, R²={response.get('metrics', {}).get('r2_score')}")
                return True
            else:
                print(f"   ⚠️  Missing fields: {missing_fields}")
        return False

    def test_watchlist_add(self, ticker="ASML"):
        """Test POST /api/watchlist"""
        success, response = self.run_test(
            f"Add {ticker} to Watchlist",
            "POST",
            "watchlist",
            200,
            data={"ticker": ticker}
        )
        return success

    def test_watchlist_get(self):
        """Test GET /api/watchlist"""
        success, response = self.run_test(
            "Get Watchlist",
            "GET",
            "watchlist",
            200
        )
        if success and 'watchlist' in response:
            items = response['watchlist']
            print(f"   ✅ Watchlist has {len(items)} items")
            return True
        return False

    def test_watchlist_remove(self, ticker="ASML"):
        """Test DELETE /api/watchlist/{ticker}"""
        success, response = self.run_test(
            f"Remove {ticker} from Watchlist",
            "DELETE",
            f"watchlist/{ticker}",
            200
        )
        return success

    def test_prediction_history(self):
        """Test GET /api/history"""
        success, response = self.run_test(
            "Get Prediction History",
            "GET",
            "history",
            200
        )
        if success and 'history' in response:
            history = response['history']
            print(f"   ✅ Found {len(history)} prediction records")
            return True
        return False

def main():
    print("🚀 Starting Stock Market Prediction API Tests")
    print("=" * 50)
    
    tester = StockPredictionAPITester()
    
    # Test public endpoints first
    print("\n📊 Testing Public Endpoints")
    tickers = tester.test_stocks_endpoint()
    
    if tickers:
        # Test stock data endpoint (public)
        sample_ticker = tickers[0]['ticker'] if tickers else "ASML"
        tester.test_stock_data(sample_ticker)
    
    # Test authentication
    print("\n🔐 Testing Authentication")
    login_success = tester.test_auth_login()
    
    if not login_success:
        print("❌ Login failed, stopping authenticated tests")
        print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
        return 1
    
    # Test authenticated endpoints
    print("\n👤 Testing Authenticated Endpoints")
    tester.test_auth_me()
    
    # Test prediction (requires auth)
    sample_ticker = tickers[0]['ticker'] if tickers else "ASML"
    tester.test_prediction(sample_ticker)
    
    # Test watchlist functionality
    print("\n⭐ Testing Watchlist")
    tester.test_watchlist_add(sample_ticker)
    tester.test_watchlist_get()
    tester.test_prediction_history()
    tester.test_watchlist_remove(sample_ticker)
    
    # Test user registration (creates new session)
    print("\n📝 Testing Registration")
    tester.test_auth_register()
    
    # Test logout
    print("\n🚪 Testing Logout")
    tester.test_auth_logout()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure.get('test', 'Unknown')}: {failure}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())