import { useState, useEffect } from "react";
import {
  Eye,
  QrCode,
  Download,
  Share2,
  MessageCircle,
  Star,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const sentimentColors = {
  Positive: "bg-green-100 text-green-700",
  Neutral: "bg-yellow-100 text-yellow-700",
  Negative: "bg-red-100 text-red-700",
};

const FeedbackExplorer = () => {
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true); // Consolidated loading state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/review/all-reviews`);
        const reviews = response.data.reviews.map((review) => ({
          id: review.id,
          name: review.isAnonymous ? "Anonymous" : "Unknown User", // Placeholder since userId is null
          date: new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          rating: review.rating,
          sentiment: getSentiment(review.rating),
          text: review.comment,
          aspects: review.qrcode_tags,
          qrCode: review.qrcode.id, // Using qrcode.id as placeholder for qrCode name
        }));
        setFeedback(reviews);
      } catch (err) {
        setError("Failed to fetch reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const getSentiment = (rating) => {
    if (rating >= 4) return "Positive";
    if (rating === 3) return "Neutral";
    return "Negative";
  };

  const filteredFeedback = feedback.filter((f) =>
    f.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/logout/logout`, {
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

  const handleRetry = () => {
    setLoading(true);
    setError("");
    // Re-run the fetch effect
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/review/all-reviews`);
        const reviews = response.data.reviews.map((review) => ({
          id: review.id,
          name: review.isAnonymous ? "Anonymous" : "Unknown User",
          date: new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          rating: review.rating,
          sentiment: getSentiment(review.rating),
          text: review.comment,
          aspects: review.qrcode_tags,
          qrCode: review.qrcode.id,
        }));
        setFeedback(reviews);
      } catch (err) {
        setError("Failed to fetch reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw size={18} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Total", value: feedback.length.toString() },
          { label: "Positive", value: feedback.filter(f => f.sentiment === "Positive").length.toString() },
          { label: "Neutral", value: feedback.filter(f => f.sentiment === "Neutral").length.toString() },
          { label: "Negative", value: feedback.filter(f => f.sentiment === "Negative").length.toString() },
          { label: "With Media", value: "0" }, // Placeholder, update if API provides media data
          { label: "Flagged", value: "0" },   // Placeholder, update if API provides flagged data
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
          >
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search feedback..."
          className="flex-1 min-w-[200px] bg-blue-100 outline-blue-600 rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-blue-100 outline-blue-600 rounded-lg px-3 py-2 pr-8 md:w-48 appearance-none relative"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg fill=\'%230055aa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.2rem',
            borderRadius: '0.5rem',
          }}
        >
          <option>All Ratings</option>
          <option>5 Stars</option>
          <option>4 Stars</option>
          <option>3 Stars</option>
          <option>2 Stars</option>
          <option>1 Star</option>
        </select>
        <select
          className="bg-blue-100 outline-blue-600 rounded-lg px-3 py-2 pr-8 md:w-48 appearance-none relative"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg fill=\'%230055aa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.2rem',
            borderRadius: '0.5rem',
          }}
        >
          <option>All Sentiments</option>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>
        <select
          className="bg-blue-100 outline-blue-600 rounded-lg px-3 py-2 pr-8 md:w-48 appearance-none relative"
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
          <option>All Time</option>
        </select>
      </div>
      {/* Feedback List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pb-10">
        {filteredFeedback.map((fb) => (
          <div
            key={fb.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 shadow-sm"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < fb.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${sentimentColors[fb.sentiment]}`}
                  >
                    {fb.sentiment}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{fb.date}</div>
              </div>
              <p className="mt-2 text-gray-700">{fb.text}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {fb.aspects.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <QrCode size={16} /> {fb.qrCode}
              </div>
            </div>
            <div className="flex gap-2 self-end sm:self-start">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                <Eye size={18} />
              </button>
              <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                <MessageCircle size={18} />
              </button>
              <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                <Download size={18} />
              </button>
              <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackExplorer;