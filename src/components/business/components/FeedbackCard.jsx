
import { useState } from "react";
import { Star, QrCode, Eye, MessageCircle, Download, Share2, Send } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
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
  const [replyInput, setReplyInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState(feedback.replies || []);

  const handleReplySubmit = async () => {
    if (!replyInput.trim()) {
      toast.error("Reply cannot be empty.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to reply.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/response/reply/${feedback.id}`,
        { response: replyInput.trim() },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setReplies([...replies, response.data.data]);
      setReplyInput("");
      setIsReplying(false);
      toast.success("Reply added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Reply submission error:", err);
      toast.error(err.response?.data?.message || "Failed to submit reply.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

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
          {Array.isArray(feedback.aspects) && feedback.aspects.length > 0 ? (
            feedback.aspects.map((tag) => (
              <span key={tag} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-slate-500 text-xs">No tags available</span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <QrCode size={16} /> {feedback.qrCode} ({feedback.businessName})
        </div>
        {replies.length > 0 && (
          <div className="mt-3 space-y-2">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-slate-50 p-2 rounded-lg text-sm text-slate-600">
                <strong>Business Reply:</strong> {reply.response}
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(reply.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {isReplying ? (
          <div className="mt-3 flex gap-2">
            <input
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={handleReplySubmit}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>
            <button
              onClick={() => setIsReplying(false)}
              className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsReplying(true)}
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <MessageCircle size={16} />
            Reply
          </button>
        )}
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
        <button
          onClick={onShare}
          className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
          aria-label="Share Feedback"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;
