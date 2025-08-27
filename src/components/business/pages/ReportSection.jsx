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
import { useState } from 'react'; // Added missing useState import

const feedbackData = [
  { day: "Mon", feedback: 18, rating: 4.2 },
  { day: "Tue", feedback: 28, rating: 4.1 },
  { day: "Wed", feedback: 22, rating: 4.4 },
  { day: "Thu", feedback: 32, rating: 4.3 },
  { day: "Fri", feedback: 30, rating: 4.5 },
  { day: "Sat", feedback: 19, rating: 4.6 },
  { day: "Sun", feedback: 10, rating: 4.4 },
];

const keywordData = [
  { keyword: "delicious", count: 45, color: "bg-green-500" },
  { keyword: "friendly", count: 38, color: "bg-green-500" },
  { keyword: "slow", count: 23, color: "bg-red-500" },
  { keyword: "cozy", count: 21, color: "bg-green-500" },
  { keyword: "expensive", count: 18, color: "bg-red-500" },
  { keyword: "fresh", count: 16, color: "bg-green-500" },
  { keyword: "crowded", count: 14, color: "bg-red-500" },
  { keyword: "amazing", count: 13, color: "bg-green-500" },
];

const ReportSection = () => {
  const [isLoading, setIsLoading] = useState(true); // Initialize with true if data fetching is intended
  const navigate = useNavigate();
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
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
        <div className="">
          {/* Chart Section - Analytics */}
          <div className="">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Feedback</p>
                    <p className="text-3xl font-bold text-gray-900">153</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-3xl font-bold text-gray-900">4.3</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Response Rate</p>
                    <p className="text-3xl font-bold text-gray-900">87%</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Growth</p>
                    <p className="text-3xl font-bold text-green-600">+12%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
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
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Share2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={feedbackData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                          domain={[0, 40]}
                          label={{ value: 'Feedback Count', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                          domain={[3.5, 5]}
                          label={{ value: 'Rating', angle: 90, position: 'insideRight' }}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="feedback"
                          fill="#60A5FA"
                          radius={[4, 4, 0, 0]}
                          name="Feedback Count"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="rating"
                          stroke="#F59E0B"
                          strokeWidth={3}
                          dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                          name="Average Rating"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value, name) => [value, name]}
                          labelFormatter={(label) => `Day: ${label}`}
                        />
                        <Legend
                          verticalAlign="top"
                          height={36}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
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
                    {keywordData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-32">
                          <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                          <span className="text-sm font-medium text-gray-900 truncate">{item.keyword}</span>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${(item.count / 45) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {/* Service Quality Improved */}
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-green-500">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">Service Quality Improved</span>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-full">
                        high
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Customer satisfaction with service speed increased by 18% this week
                    </p>
                    <button className="px-3 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
                      Take Action
                    </button>
                  </div>
                </div>
                {/* Temperature Issues */}
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-yellow-500">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-gray-900">Temperature Issues</span>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-full">
                        high
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">12 customers mentioned food/drink temperature problems</p>
                    <button className="px-3 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
                      Take Action
                    </button>
                  </div>
                </div>
                {/* Expand Seating */}
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-yellow-500">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-gray-900">Expand Seating</span>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-full">medium</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Multiple requests for more seating during peak hours</p>
                    <button className="px-3 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
                      Take Action
                    </button>
                  </div>
                </div>
                {/* New Menu Items */}
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-green-500">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">New Menu Items</span>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">low</span>
                    </div>
                    <p className="text-sm text-gray-600">Seasonal items receiving excellent feedback (4.7/5 average)</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column - Generated Reports */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Generated Reports</h2>
                <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700">
                  <Mail className="w-4 h-4" />
                  <span>Email All</span>
                </button>
              </div>
              <div className="space-y-4">
                {/* Weekly Customer Satisfaction Summary */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">Weekly Customer Satisfaction Summary</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">AI Summary</span>
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">ready</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Jan 8-14, 2025</p>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Volume2 className="w-4 h-4" />
                      <span>Text + Audio</span>
                    </div>
                  </div>
                </div>
                {/* Monthly Performance Video Report */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">Monthly Performance Video Report</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-full">Video Report</span>
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">ready</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">December 2024</p>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PlayCircle className="w-4 h-4" />
                      <span>MP4 Video</span>
                    </div>
                  </div>
                </div>
                {/* Quarterly Business Intelligence Report */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">Quarterly Business Intelligence Report</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">Detailed Analysis</span>
                          <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-full">generating</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Q4 2024</p>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>PDF + Charts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSection;