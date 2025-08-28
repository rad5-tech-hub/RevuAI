import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, Star, MessageSquare, AlertTriangle, Clock, Eye, QrCode, Download, Share2, Tag, LogOut, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';

// Define CSS animation for growWidth
const styles = `
  @keyframes growWidth {
    from { width: 0%; }
    to { width: 100%; }
  }
`;

// Inject styles into the document (if not using a CSS-in-JS solution)
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const BusinessDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/v1/logout/logout`, {
        refreshToken: token,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('authToken');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/');
    }
  };

  // Static data for charts
  const weeklyData = [
    { day: 'Mon', feedback: 12, rating: 4.2 },
    { day: 'Tue', feedback: 19, rating: 4.1 },
    { day: 'Wed', feedback: 15, rating: 4.5 },
    { day: 'Thu', feedback: 25, rating: 4.3 },
    { day: 'Fri', feedback: 30, rating: 4.4 },
    { day: 'Sat', feedback: 28, rating: 4.6 },
    { day: 'Sun', feedback: 22, rating: 4.2 },
  ];

  const topIssues = [
    { issue: 'Long wait times', priority: 'high', mentions: 12, trend: 'up' },
    { issue: 'Cold food temperature', priority: 'medium', mentions: 8, trend: 'down' },
    { issue: 'Noisy environment', priority: 'low', mentions: 6, trend: 'stable' },
    { issue: 'Limited seating', priority: 'low', mentions: 4, trend: 'down' },
  ];

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('No authentication token found. Please sign in.');
      setIsLoading(false);
      navigate('/');
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/v1/business/business-dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Dashboard response:', response.data);

      // Check if response.data exists
      if (!response.data) {
        throw new Error('No data received from the server');
      }

      const ratingDistribution = Object.entries(response.data.rating_distribution || {}).map(([rating, count]) => ({
        rating,
        count,
        percentage: response.data.total_feedbacks ? (count / response.data.total_feedbacks) * 100 : 0,
      }));

      const recentFeedback = (response.data.recent_feedbacks || []).map(feedback => ({
        id: feedback.id || `feedback-${Math.random()}`, // Fallback ID if not provided
        rating: feedback.rating || 0,
        rating_label: feedback.rating_label || 'N/A',
        comment: feedback.comment || 'No comment provided',
        author: feedback.reviewer || 'Anonymous',
        time: feedback.createdAt || 'Recent',
        media: feedback.qrcodeTags?.length > 0,
        qrcodeTitle: feedback.qrcodeTitle || 'Unknown',
        qrcodeTags: feedback.qrcodeTags || [],
      }));

      setDashboardData({
        business_name: response.data.business_name || 'Business Dashboard',
        total_feedbacks: response.data.total_feedbacks || 0,
        average_rating: response.data.average_rating || 0,
        ratingDistribution,
        recentFeedback,
      });
      setRetryCount(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={`star-${i}`} // Added unique key
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-red-600 w-4 h-4" />; // Standardized size
      case 'down': return <TrendingDown className="text-green-600 w-4 h-4" />; // Standardized size
      case 'stable': return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
      default: return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length && label) {
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-sm text-xs sm:text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.dataKey === 'feedback' ? 'Feedback' : 'Rating'}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Enhanced Loading Component
  const LoadingState = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={`nav-${i}`} className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={`stat-${i}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        {/* Charts Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="h-72 md:h-80 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={`rating-${i}`} className="flex items-center space-x-3">
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-10 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {[1, 2].map(section => (
            <div key={`section-${section}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(item => (
                  <div key={`item-${item}`} className="p-4 bg-gray-50 rounded-lg">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Loading indicator with spinner */}
        <div className="fixed bottom-8 right-8 bg-white rounded-full shadow-lg border p-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
            <span className="text-sm font-medium text-gray-700">Loading dashboard...</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Error Component
  const ErrorState = () => {
    const getErrorDetails = () => {
      if (error.includes('Network Error') || error.includes('timeout')) {
        return {
          icon: WifiOff,
          title: 'Connection Problem',
          message: 'Unable to connect to our servers. Please check your internet connection.',
          suggestion: 'Try refreshing the page or check your network connection.',
        };
      } else if (error.includes('401') || error.includes('unauthorized')) {
        return {
          icon: AlertTriangle,
          title: 'Authentication Error',
          message: 'Your session has expired. Please sign in again.',
          suggestion: 'You will be redirected to the login page.',
        };
      } else {
        return {
          icon: AlertCircle,
          title: 'Something went wrong',
          message: error,
          suggestion: 'This is usually temporary. Please try again.',
        };
      }
    };

    const errorDetails = getErrorDetails();
    const ErrorIcon = errorDetails.icon;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <ErrorIcon className="w-8 h-8 text-red-600" />
            </div>
            {/* Error Content */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {errorDetails.title}
            </h1>
            <p className="text-gray-600 mb-2 leading-relaxed">
              {errorDetails.message}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              {errorDetails.suggestion}
            </p>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                aria-label="Retry loading dashboard"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Retrying...' : 'Try Again'}
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                aria-label="Back to login page"
              >
                <LogOut className="w-4 h-4" />
                Back to Login
              </button>
            </div>
            {/* Retry Counter */}
            {retryCount > 0 && (
              <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Retry attempt: {retryCount}
                  {retryCount >= 3 && " - If this persists, please contact support."}
                </p>
              </div>
            )}
            {/* Support Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help?{' '}
                <a
                  href="mailto:support@revuai.com"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Link to="/businessDashboard" className="flex items-center space-x-2" aria-current="page">
                <div className="w-10 h-10 text-white mx-auto bg-blue-500 mr-2 rounded-full flex items-center justify-center">
                  <QrCode className="w-6 h-6" /> {/* Standardized size */}
                </div>
                <span className="text-xl font-bold text-black">RevuAi</span>
              </Link>
              <span className="text-gray-500">Business Portal</span>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0 items-center">
              <Link
                to="/businessDashboard"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                aria-current="page"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/businessFeedback"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                💬 Feedback
              </Link>
              <Link
                to="/businessQrpage"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📱 QR Codes
              </Link>
              <Link
                to="/businessReports"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📈 Reports
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{dashboardData?.business_name ?? 'Business'} Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your customer feedback.</p>
          </div>
          <div className="flex flex-row gap-3 items-center">
            <button
              className="flex items-center gap-2 bg-gray-100 hover:bg-blue-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              aria-label="Export report"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              aria-label="Share insights"
            >
              <Share2 className="w-4 h-4" />
              Share Insights
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Feedback</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.total_feedbacks ?? 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6" /> {/* Standardized size */}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.average_rating?.toFixed(1) ?? 'N/A'}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500" /> {/* Standardized size */}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">N/A</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-500" /> {/* Standardized size */}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Issues</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">N/A</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" /> {/* Standardized size */}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Feedback Trends</h3>
            <div className="h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} /> {/* Removed window.innerWidth */}
                  <YAxis yAxisId="feedback" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis yAxisId="rating" orientation="right" domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="feedback" dataKey="feedback" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="rating" type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} dot />
                  <Legend verticalAlign="top" height={36} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Rating Distribution</h3>
            <div className="space-y-4">
              {dashboardData?.ratingDistribution?.length > 0 ? (
                dashboardData.ratingDistribution.map((item, index) => (
                  <div key={`rating-dist-${item.rating}-${index}`} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 w-8">{item.rating}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${item.percentage}%`,
                          animation: `growWidth 1s ease-out ${index * 0.1}s both`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-10 text-right">{item.count}</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-gray-400" /> {/* Standardized size */}
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h4>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Once customers start leaving feedback, you'll see the rating distribution here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Issues This Week</h3>
              <Link to="/businessFeedback" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {topIssues.map((issue, index) => (
                <div key={`issue-${issue.issue}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{issue.issue}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full text-center ${getPriorityColor(issue.priority)}`}>
                        {issue.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{issue.mentions} mentions</p>
                  </div>
                  <div className="text-lg ml-4">
                    {getTrendIcon(issue.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
              <Link to="/businessFeedback" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>View All</span>
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData?.recentFeedback?.length > 0 ? (
                dashboardData.recentFeedback.map((feedback) => (
                  <div key={`feedback-${feedback.id}`} className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex">{renderStars(feedback.rating)}</div>
                        <span className="text-blue-600 text-sm">{feedback.rating_label}</span>
                        {feedback.media && <span className="text-blue-600 text-sm">📷 Tags</span>}
                      </div>
                      <span className="text-gray-500 text-sm flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{feedback.time}</span>
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm mb-2 leading-relaxed">"{feedback.comment}"</p>
                    <p className="text-gray-600 text-sm mb-1">- {feedback.author}</p>
                    <p className="text-gray-600 text-sm mb-1">Product: {feedback.qrcodeTitle}</p>
                    {feedback.qrcodeTags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {feedback.qrcodeTags.map((tag, tagIndex) => (
                          <span
                            key={`tag-${feedback.id}-${tagIndex}`}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-gray-400" /> {/* Standardized size */}
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h4>
                  <p className="text-gray-500 text-sm max-w-xs">
                    When customers start sharing their thoughts, their recent feedback will appear here.
                  </p>
                  <button
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    aria-label="Share QR codes"
                  >
                    <QrCode className="w-4 h-4" />
                    Share your QR codes to get started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;