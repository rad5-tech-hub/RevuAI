import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  MessageCircle,
  Building,
  Award,
  DollarSign,
  RefreshCw,
  BarChart3,
  PieChartIcon,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import logo from "/Social Media Icon.png"; // Adjust path if needed

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
          <p className="text-gray-600">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const adminAuthToken = localStorage.getItem("adminAuthToken");
    if (!adminAuthToken) {
      console.error("AdminDashboard - No adminAuthToken found");
      setError("Please sign in as an admin.");
      navigate("/adminAuth");
      return;
    }

    const fetchMetrics = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${BASE_URL}/api/v1/admins/metrics`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminAuthToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch metrics");
        }

        setMetrics(data.data);
      } catch (err) {
        console.error("AdminDashboard - Fetch metrics error:", err);
        setError(err.message || "Failed to load metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthToken");
    localStorage.removeItem("adminData");
    navigate("/adminAuth");
  };

  const handleLogoClick = () => {
    navigate("/adminDashboard"); // Or navigate("/") if preferred
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Prepare dynamic data for charts with proper initialization
  const totalScansData = metrics
    ? Array.from({ length: 7 }, (_, i) => ({
        day: i,
        v: i === new Date().getDay() ? metrics.scans.today : metrics.scans.total / 7, // Spread total across days, current day gets today value
      }))
    : Array.from({ length: 7 }, (_, i) => ({ day: i, v: 0 }));
  const totalFeedbacksData = metrics
    ? Array.from({ length: 7 }, (_, i) => ({
        day: i,
        v: i === new Date().getDay() ? metrics.feedbacks.today : metrics.feedbacks.total / 7, // Spread total across days
      }))
    : Array.from({ length: 7 }, (_, i) => ({ day: i, v: 0 }));
  const businessSignupsData = metrics
    ? [{ month: 1, signups: metrics.businesses.total }]
    : [{ month: 1, signups: 0 }];
  const userSignupsData = metrics
    ? Array.from({ length: 7 }, (_, i) => ({
        day: i,
        v: i === new Date().getDay() ? metrics.users.today || 0 : metrics.users.total / 7, // Spread total, current day gets today value if available
      }))
    : Array.from({ length: 7 }, (_, i) => ({ day: i, v: 0 }));
  const premiumBusinessesData = [{ v: 0 }]; // Placeholder
  const totalRevenueData = [{ v: 0 }]; // Placeholder
  const revenueTrendData = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
  ]; // Default value, updated if metrics exist
  const revenueBreakdownData = [
    { name: "Premium Subscriptions", value: 0, color: "#2563eb" },
    { name: "QR Code Generation", value: 0, color: "#f59e0b" },
    { name: "Analytics Reports", value: 0, color: "#10b981" },
    { name: "Custom Branding", value: 0, color: "#ef4444" },
  ];
  const activityData = metrics
    ? [
        { day: "Mon", scans: new Date().getDay() === 1 ? metrics.scans.today : 0, feedbacks: new Date().getDay() === 1 ? metrics.feedbacks.today : 0 },
        { day: "Tue", scans: new Date().getDay() === 2 ? metrics.scans.today : 0, feedbacks: new Date().getDay() === 2 ? metrics.feedbacks.today : 0 },
        { day: "Wed", scans: new Date().getDay() === 3 ? metrics.scans.today : 0, feedbacks: new Date().getDay() === 3 ? metrics.feedbacks.today : 0 },
        { day: "Thu", scans: new Date().getDay() === 4 ? metrics.scans.today : 0, feedbacks: new Date().getDay() === 4 ? metrics.feedbacks.today : 0 },
        { day: "Fri", scans: new Date().getDay() === 5 ? metrics.scans.today : 0, feedbacks: new Date().getDay() === 5 ? metrics.feedbacks.today : 0 },
        { day: "Sat", scans: new Date().getDay() === 6 ? metrics.scans.today : 0, feedbacks: new Date().getDay() === 6 ? metrics.feedbacks.today : 0 },
        { day: "Sun", scans: new Date().getDay() === 0 ? metrics.scans.today : 0, feedbacks: new Date().getDay() === 0 ? metrics.feedbacks.today : 0 },
      ]
    : [
        { day: "Mon", scans: 0, feedbacks: 0 },
        { day: "Tue", scans: 0, feedbacks: 0 },
        { day: "Wed", scans: 0, feedbacks: 0 },
        { day: "Thu", scans: 0, feedbacks: 0 },
        { day: "Fri", scans: 0, feedbacks: 0 },
        { day: "Sat", scans: 0, feedbacks: 0 },
        { day: "Sun", scans: 0, feedbacks: 0 },
      ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-2" onClick={handleLogoClick}>
                  <div className="hidden md:flex w-8 h-8 bg-blue-600 rounded-full items-center justify-center cursor-pointer">
                    <span className="text-white text-sm font-bold">S</span>
                  </div>
                  <span className="text-lg md:text-xl font-semibold text-blue-600">ScanReviewAI</span>
                  <span className="text-xs md:text-sm text-gray-500 ml-4">Admin Portal</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-black cursor-pointer hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
              <svg
                className="w-4 h-4 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center text-blue-600">Loading metrics...</div>
          ) : (
            <>
              {/* Dashboard Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600">Monitor platform performance and key metrics</p>
                  <p className="text-sm text-gray-500 mt-1">{getFormattedDate()}</p>
                </div>
                <p className="bg-blue-200 hidden md:flex text-black px-2 py-1 rounded-md text-sm font-medium">
                  Live Data
                </p>
              </div>

              {/* Top Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Scans */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Scans</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics ? metrics.scans.total : 0}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 text-sm ml-1">0%</span>
                        <span className="text-gray-500 text-sm ml-2">Last 7 days</span>
                      </div>
                    </div>
                    <RefreshCw className="h-5 w-5 text-gray-400" />
                  </div>
                  {/* Mini line chart */}
                  <div className="mt-4 h-12 bg-white">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={totalScansData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                        />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Total Feedbacks */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Feedbacks</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics ? metrics.feedbacks.total : 0}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 text-sm ml-1">0%</span>
                        <span className="text-gray-500 text-sm ml-2">Last 7 days</span>
                      </div>
                    </div>
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  {/* Mini line chart */}
                  <div className="mt-4 h-12 bg-white">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={totalFeedbacksData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={false}
                        />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Business Signups */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Business Signups</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics ? metrics.businesses.total : 0}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 text-sm ml-1">0%</span>
                        <span className="text-gray-500 text-sm ml-2">Last 6 months</span>
                      </div>
                    </div>
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  {/* Mini bar chart */}
                  <div className="mt-4 h-12 bg-white">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={businessSignupsData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Bar dataKey="signups" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Second Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* User Signups */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">User Signups</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics ? metrics.users.total : 0}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 text-sm ml-1">0%</span>
                        <span className="text-gray-500 text-sm ml-2">Last 6 months</span>
                      </div>
                    </div>
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  {/* Mini line chart */}
                  <div className="mt-4 h-12 bg-white">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userSignupsData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                        />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Premium Businesses */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Premium Businesses</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 text-sm ml-1">0%</span>
                        <span className="text-gray-500 text-sm ml-2">37.4% of total</span>
                      </div>
                    </div>
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">$0</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 text-sm ml-1">0%</span>
                        <span className="text-gray-500 text-sm ml-2">This month</span>
                      </div>
                    </div>
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  {/* Mini line chart */}
                  <div className="mt-4 h-12 bg-white">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={totalRevenueData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                        />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Trend */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
                      <p className="text-sm text-gray-600">Monthly revenue over the last 6 months</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueTrendData}>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                          formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                          labelStyle={{ color: "#6b7280" }}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Revenue Breakdown</h3>
                      <p className="text-sm text-gray-600">Revenue distribution by service type</p>
                    </div>
                    <PieChartIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {revenueBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {revenueBreakdownData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Platform Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Platform Activity</h3>
                    <p className="text-sm text-gray-600">Scans and feedback submissions over the last 7 days</p>
                  </div>
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} barGap={10}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value, name) =>
                          [value.toLocaleString(), name === "scans" ? "Scans" : "Feedbacks"]
                        }
                        labelStyle={{ color: "#6b7280" }}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                        }}
                      />
                      <Bar dataKey="scans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="feedbacks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">Scans</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">Feedbacks</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;