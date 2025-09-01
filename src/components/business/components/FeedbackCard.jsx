import { Star, QrCode, Eye, MessageCircle, Download, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sentimentColors = {
  Positive: "bg-green-100 text-green-700",
  Neutral: "bg-yellow-100 text-yellow-700",
  Negative: "bg-red-100 text-red-700",
};

const FeedbackCard = ({
  feedback,
  onDownloadPNG,
  onDownloadSVG,
  onDownloadPDF,
  onShare,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}
              />
            ))}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sentimentColors[feedback.sentiment]}`}>
              {feedback.sentiment}
            </span>
          </div>
          <div className="text-sm text-slate-500">{feedback.date}</div>
        </div>
        <p className="mt-2 text-slate-700">{feedback.text}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {feedback.aspects.map((tag) => (
            <span key={tag} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <QrCode size={16} /> {feedback.qrCode} ({feedback.businessName})
        </div>
      </div>
      <div className="flex gap-2 self-end sm:self-start">
        <button
          onClick={() =>
            toast.info("View feedback details coming soon!", {
              position: "top-right",
              autoClose: 3000,
            })
          }
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          aria-label="View Feedback"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={() =>
            toast.info("Reply to feedback coming soon!", {
              position: "top-right",
              autoClose: 3000,
            })
          }
          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
          aria-label="Reply to Feedback"
        >
          <MessageCircle size={18} />
        </button>
        <div className="relative group">
          <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" aria-label="Download Feedback">
            <Download size={18} />
          </button>
          <div className="absolute hidden group-hover:block bg-white border border-slate-200 rounded-lg shadow-lg z-10">
            <button
              onClick={onDownloadPNG}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              PNG
            </button>
            <button
              onClick={onDownloadSVG}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              SVG
            </button>
            <button
              onClick={onDownloadPDF}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              PDF
            </button>
          </div>
        </div>
        <button onClick={onShare} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" aria-label="Share Feedback">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;