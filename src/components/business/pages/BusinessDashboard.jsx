import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, Star, MessageSquare, AlertTriangle, Clock, Eye, QrCode, Download, Share2, Tag, LogOut } from 'lucide-react';

const BusinessDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
        refreshToken: token // Using access token as a placeholder; adjust if refresh token is different
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('authToken');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      // Optionally show an error message to the user
      navigate('/');
    }
  };

  // Static data for charts (not provided by API)
  const weeklyData = [
    { day: 'Mon', feedback: 12, rating: 4.2 },
    { day: 'Tue', feedback: 19, rating: 4.1 },
    { day: 'Wed', feedback: 15, rating: 4.5 },
    { day: 'Thu', feedback: 25, rating: 4.3 },
    { day: 'Fri', feedback: 30, rating: 4.4 },
    { day: 'Sat', feedback: 28, rating: 4.6 },
    { day: 'Sun', feedback: 22, rating: 4.2 }
  ];
  const topIssues = [
    { issue: 'Long wait times', priority: 'high', mentions: 12, trend: 'up' },
    { issue: 'Cold food temperature', priority: 'medium', mentions: 8, trend: 'down' },
    { issue: 'Noisy environment', priority: 'low', mentions: 6, trend: 'stable' },
    { issue: 'Limited seating', priority: 'low', mentions: 4, trend: 'down' }
  ];

  useEffect(() => {
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
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Dashboard response:', response.data);
        // Transform rating_distribution object to array
        const ratingDistribution = Object.entries(response.data.rating_distribution || {}).map(([rating, count]) => ({
          rating,
          count,
          percentage: response.data.total_feedbacks ? (count / response.data.total_feedbacks) * 100 : 0
        }));
        // Map recent_feedbacks to match component format
        const recentFeedback = response.data.recent_feedbacks?.map(feedback => ({
          id: feedback.id,
          rating: feedback.rating,
          rating_label: feedback.rating_label,
          comment: feedback.comment || 'No comment provided',
          author: feedback.reviewer || 'Anonymous',
          time: feedback.createdAt || 'Recent',
          media: feedback.qrcodeTags?.length > 0,
          qrcodeTitle: feedback.qrcodeTitle || 'Unknown',
          qrcodeTags: feedback.qrcodeTags || []
        })) || [];
        setDashboardData({
          business_name: response.data.business_name || 'Business Dashboard',
          total_feedbacks: response.data.total_feedbacks || 0,
          average_rating: response.data.average_rating || 0,
          ratingDistribution,
          recentFeedback
        });
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
    fetchDashboardData();
  }, [navigate]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
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
      case 'up': return <TrendingUp className="text-red-600" />;
      case 'down': return <TrendingDown className="text-green-600" />;
      case 'stable': return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
      default: return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-sm text-xs sm:text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'feedback' ? 'Feedback' : 'Rating'}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Link to="/businessDashboard" className="flex items-center space-x-2">
                <div className="w-10 h-10 text-white mx-auto bg-blue-500 mr-2 rounded-full flex items-center justify-center">
                  <QrCode />
                </div>
                <span className="text-xl font-bold text-black">RevuAi</span>
              </Link>
              <span className="text-gray-500">Business Portal</span>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0 items-center">
              <Link
                to="/businessDashboard"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
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
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{dashboardData?.business_name} Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your customer feedback.</p>
          </div>
          <div className="flex flex-row gap-3 items-center">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-blue-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Download /> Export Report
            </button>
            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Share2 /> Share Insights
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Feedback</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.total_feedbacks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                <MessageSquare />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.average_rating.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-500" />
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
                <Users className="w-6 h-6 text-green-500" />
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
                <AlertTriangle className="w-6 h-6 text-red-500" />
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
                  <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                  <YAxis yAxisId="feedback" tick={{ fill: '#6b7280', fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                  <YAxis yAxisId="rating" orientation="right" domain={[0, 5]} />
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
              {dashboardData?.ratingDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{item.rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${item.percentage}%`,
                        animation: `growWidth 1s ease-out ${index * 0.1}s both`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-10 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Issues This Week</h3>
              <a href="/business-feedback" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</a>
            </div>
            <div className="space-y-4">
              {topIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
              <a href="/business-feedback" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>View All</span>
              </a>
            </div>
            <div className="space-y-4">
              {dashboardData?.recentFeedback.map((feedback, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg">
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
                  {feedback.qrcodeTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {feedback.qrcodeTags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;