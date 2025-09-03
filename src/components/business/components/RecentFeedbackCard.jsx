import { Link } from "react-router-dom";
import { Eye, Clock, Tag, MessageSquare, QrCode, Star } from "lucide-react";

const renderStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <Star
      key={`star-${i}`}
      className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
    />
  ));
};

const RecentFeedbackCard = ({ feedbacks }) => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
      <Link
        to="/businessFeedback"
        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
      >
        <Eye className="h-4 w-4" />
        <span>View All</span>
      </Link>
    </div>
    <div className="space-y-4">
      {feedbacks?.length > 0 ? (
        feedbacks.map((feedback) => (
          <div
            key={`feedback-${feedback.id}`}
            className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(feedback.rating)}</div>
                <span className="text-blue-600 text-sm">{feedback.ratingLabel}</span>
                {feedback.hasMedia && <span className="text-blue-600 text-sm">📷 Media</span>}
              </div>
              <span className="text-gray-500 text-sm flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{feedback.date}</span>
              </span>
            </div>
            <p className="text-gray-900 text-sm mb-2 leading-relaxed">"{feedback.text}"</p>
            <p className="text-gray-600 text-sm mb-1">- {feedback.name}</p>
            <p className="text-gray-600 text-sm mb-1">Product: {feedback.qrCode}</p>
            {Array.isArray(feedback.aspects) && feedback.aspects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {feedback.aspects.map((tag, tagIndex) => (
                  <span
                    key={`tag-${feedback.id}-${tagIndex}`}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-600 text-sm">No tags available</span>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h4>
          <p className="text-gray-500 text-sm max-w-xs">
            When customers start sharing their thoughts, their recent feedback will appear here.
          </p>
          <Link
            to="/businessQrpage"
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            aria-label="Share QR codes"
          >
            <QrCode className="w-4 h-4" />
            Share your QR codes to get started
          </Link>
        </div>
      )}
    </div>
  </div>
);

export default RecentFeedbackCard;