import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line , ComposedChart} from 'recharts';
import { Link }from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Star, 
  MessageSquare, 
  AlertTriangle, 
  Clock,
  Eye,
  QrCode,
  Download,
  Share2
} from 'lucide-react';

function BusinessDashboard () {
  // Sample data for charts
  const weeklyData = [
    { day: 'Mon', feedback: 12, rating: 4.2 },
    { day: 'Tue', feedback: 19, rating: 4.1 },
    { day: 'Wed', feedback: 15, rating: 4.5 },
    { day: 'Thu', feedback: 25, rating: 4.3 },
    { day: 'Fri', feedback: 30, rating: 4.4 },
    { day: 'Sat', feedback: 28, rating: 4.6 },
    { day: 'Sun', feedback: 22, rating: 4.2 }
  ];

  const ratingDistribution = [
    { rating: '5★', count: 145, percentage: 58 },
    { rating: '4★', count: 89, percentage: 36 },
    { rating: '3★', count: 34, percentage: 14 },
    { rating: '2★', count: 12, percentage: 5 },
    { rating: '1★', count: 8, percentage: 3 }
  ];

  const recentFeedback = [
    {
      id: 1,
      rating: 5,
      comment: "Amazing coffee and great service! Will definitely come back.",
      author: "Sarah M.",
      time: "2 hours ago",
      media: true
    },
    {
      id: 2,
      rating: 3,
      comment: "Coffee was good but had to wait too long for my order.",
      author: "Anonymous",
      time: "4 hours ago",
      media: false
    },
    {
      id: 3,
      rating: 5,
      comment: "Love the new seasonal menu! Perfect atmosphere for working.",
      author: "John D.",
      time: "6 hours ago",
      media: true
    }
  ];

  const topIssues = [
    { issue: "Long wait times", priority: "high", mentions: 12, trend: "up" },
    { issue: "Cold food temperature", priority: "medium", mentions: 8, trend: "down" },
    { issue: "Noisy environment", priority: "low", mentions: 6, trend: "stable" },
    { issue: "Limited seating", priority: "low", mentions: 4, trend: "down" }
  ];

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
      case 'up': return <TrendingUp className="text-red-600"/>;
      case 'down': return <TrendingDown className="text-green-600"/>;
      case 'stable': return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
      default: return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
    }
  };

  // Custom tooltip for charts
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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ReUseable Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <a href="/" className="flex items-center space-x-2 ">
                <div className="w-10 h-10 text-white mx-auto bg-blue-500 mr-2 rounded-full flex items-center justify-center">
                  <QrCode />
                </div>
                <span className="text-xl font-bold text-black">RevuAi</span>
              </a>
              <span className="text-gray-500">Business Portal</span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0">
              <Link
                to="#"
                className="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-t-md"
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row gap-4 justify-between item-center mb-8">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900">Demo Coffee Shop Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your customer feedback.</p>
          </div>

          {/* Action Buttons */}
            <div className="flex flex-row  gap-3 items-center ">
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-blue-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Download /> Export Report
              </button>
              <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Share2 /> Share Insights
              </button>
            </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Feedback */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Feedback</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">288</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                <MessageSquare />
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">4.3</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Response Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">87%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Active Issues */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Issues</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500"/>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Weekly Feedback Trends */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Feedback Trends</h3>
            <div className="h-72 md:h-80">
             <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day"  tick={{ fill: '#6b7280', fontSize: window.innerWidth < 640 ? 10 : 12 }}/>
                <YAxis yAxisId="feedback" tick={{ fill: '#6b7280', fontSize: window.innerWidth < 640 ? 10 : 12 }}/>
                <YAxis yAxisId="rating" orientation="right" domain={[0, 5]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="feedback" dataKey="feedback" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="rating" type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} dot />
              </ComposedChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Rating Distribution</h3>
            <div className="space-y-4">
              {ratingDistribution.map((item, index) => (
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

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Top Issues This Week */}
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

          {/* Recent Feedback */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
              <a href="/business-feedback" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>View All</span>
              </a>
            </div>
            <div className="space-y-4">
              {recentFeedback.map((feedback, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(feedback.rating)}</div>
                      {feedback.media && <span className="text-blue-600 text-sm">📷 Media</span>}
                    </div>
                    <span className="text-gray-500 text-sm flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{feedback.time}</span>
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm mb-2 leading-relaxed">"{feedback.comment}"</p>
                  <p className="text-gray-600 text-sm">- {feedback.author}</p>
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