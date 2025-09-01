import { Link } from "react-router-dom";
import { Eye, Clock, Tag } from "lucide-react";
import {
  QrCode,
  MessageSquare,
  Star,
} from "lucide-react";
const renderStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <Star
      key={`star-${i}`}
      className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
    />
  ));
};

const RecentFeedbackCard = ({ feedbacks }) => (
  <div>
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
            <MessageSquare className="w-6 h-6 text-gray-400" />
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
);

export default RecentFeedbackCard;