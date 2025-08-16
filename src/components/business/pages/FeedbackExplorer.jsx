import { useState } from "react";
import {
  Eye,
  QrCode,
  Download,
  Share2,
  MessageCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const mockFeedback = [
  {
    id: 1,
    name: "Jane Doe",
    date: "Aug 12, 2025",
    rating: 5,
    sentiment: "Positive",
    text: "Amazing service! Staff was super friendly and food was excellent.",
    aspects: ["Service", "Food Quality"],
    qrCode: "QR Code 1",
  },
  {
    id: 2,
    name: "John Smith",
    date: "Aug 10, 2025",
    rating: 3,
    sentiment: "Neutral",
    text: "Food was okay, but service was slow.",
    aspects: ["Food Quality", "Service Speed"],
    qrCode: "QR Code 2",
  },
  {
    id: 3,
    name: "Emily Brown",
    date: "Aug 9, 2025",
    rating: 1,
    sentiment: "Negative",
    text: "Very disappointed with the experience.",
    aspects: ["Cleanliness", "Service"],
    qrCode: "QR Code 3",
  },
];

const sentimentColors = {
  Positive: "bg-green-100 text-green-700",
  Neutral: "bg-yellow-100 text-yellow-700",
  Negative: "bg-red-100 text-red-700",
};

const FeedbackExplorer = () => {
  const [search, setSearch] = useState("");

  const filteredFeedback = mockFeedback.filter((f) =>
    f.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <a href="/" className="flex items-center space-x-2 ">
                <div className="w-10 h-10 text-white mx-auto bg-blue-500 mr-2 rounded-full flex items-center justify-center">
                  <QrCode />
                </div>
                <span className="text-xl font-bold text-black">RevuAi</span>
              </a>
              <span className="text-gray-500">Business Portal</span>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-8 mb-4 lg:mb-0">
              <Link
                to="/businessDashboard"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                to="#"
                className="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-t-md"
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

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Total", value: "245" },
          { label: "Positive", value: "180" },
          { label: "Neutral", value: "40" },
          { label: "Negative", value: "25" },
          { label: "With Media", value: "60" },
          { label: "Flagged", value: "5" },
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
          className="flex-1 min-w-[200px]  bg-blue-100 outline-blue-600 rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="
            bg-blue-100 outline-blue-600 rounded-lg px-3 py-2 pr-8 md:w-48 appearance-none relative"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg fill=\'%230055aa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.2rem',
            borderRadius: '0.5rem',
          }}>
          <option>All Ratings</option>
          <option>5 Stars</option>
          <option>4 Stars</option>
          <option>3 Stars</option>
          <option>2 Stars</option>
          <option>1 Star</option>
        </select>
        <select className="
            bg-blue-100 outline-blue-600 rounded-lg px-3 py-2 pr-8 md:w-48 appearance-none relative"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg fill=\'%230055aa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.2rem',
            borderRadius: '0.5rem',
          }}>
          <option>All Sentiments</option>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>
        <select
          className="
            bg-blue-100 outline-blue-600 rounded-lg px-3 py-2 pr-8 md:w-48 appearance-none relative"
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
