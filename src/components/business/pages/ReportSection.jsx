import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Download,
  Mail,
  Volume2,
  PlayCircle,
  FileText,
  TrendingUp,
  MessageSquare,
  Star,
  TrendingDown,
  Share2,
  QrCode,
  LogOut,
} from "lucide-react";
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react';
import BusinessHeader from './../components/headerComponents';

const ReportSection = () => {
  const [isLoading, setIsLoading] = useState(false); // No initial loading since no data fetching
  const [error, setError] = useState('');
  const [dynamicFeedbackData, setDynamicFeedbackData] = useState([]); // Empty array for future data
  const [dynamicKeywordData, setDynamicKeywordData] = useState([]); // Empty array for future data
  const [metrics, setMetrics] = useState(null); // Null for empty metrics
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Placeholder for future API call
  useEffect(() => {
    // Example API call (commented out to maintain empty state)
    /*
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found');
        const [feedbackResponse, keywordResponse, metricsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/feedback`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/v1/keywords`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/v1/metrics`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setDynamicFeedbackData(feedbackResponse.data || []);
        setDynamicKeywordData(keywordResponse.data || []);
        setMetrics(metricsResponse.data || null);
        setError('');
      } catch (err) {
        setError('Failed to load data.');
        console.error('Data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    */
  }, [BASE_URL]);

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/v1/logout/logout`,
        { refreshToken: token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem('authToken');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-300 border-t-blue-600"></div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <BusinessHeader onLogout={handleLogout} isLoggingOut={isLoading} />

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Reports Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Reports & Insights</h1>
              <p className="text-sm text-gray-500 mt-1">
                AI-powered analysis and automated reporting for Demo Coffee Shop
              </p>
            </div>
            <div className="flex items-start lg:items-center gap-5">
              <select
                className="bg-white outline-blue-600 rounded-lg px-3 py-2 pr-8 appearance-none relative border border-gray-200"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml;utf8,<svg fill=\'%230055aa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.2rem',
                  borderRadius: '0.5rem',
                }}
              >
                <option>This Week</option>
                <option>Today</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center">
                <span className="mr-2">✨</span>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[88rem] mx-auto px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Feedback</p>
                    <p className="text-sm text-gray-500 mt-1">Nothing here yet</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-sm text-gray-500 mt-1">Nothing here yet</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Response Rate</p>
                    <p className="text-sm text-gray-500 mt-1">Nothing here yet</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Growth</p>
                    <p className="text-sm text-gray-500 mt-1">Nothing here yet</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feedback Trends Chart */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Feedback Trends</h3>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded" disabled>
                        <Download className="w-4 h-4 text-gray-500 opacity-50" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" disabled>
                        <Share2 className="w-4 h-4 text-gray-500 opacity-50" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-sm text-gray-500">No feedback data available yet</p>
                  </div>
                </div>
              </div>

              {/* Top Keywords */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Top Keywords</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">Keyword</span>
                      <span className="text-sm font-medium text-gray-500">Frequency</span>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      No keywords available yet
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Insights and Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Left Column - AI Insights */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">AI-Powered Insights</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700" disabled>
                    View All
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-sm text-gray-500">No insights available yet</p>
                </div>
              </div>

              {/* Right Column - Generated Reports */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Generated Reports</h2>
                  <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700" disabled>
                    <Mail className="w-4 h-4 opacity-50" />
                    <span>Email All</span>
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-sm text-gray-500">No reports available yet</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSection;