import { useNavigate } from "react-router-dom";
import { RefreshCw, LogOut, AlertTriangle, AlertCircle, WifiOff } from "lucide-react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ErrorState = ({ onRetry, retryCount, error: propError, isLoading: propIsLoading }) => {
  const navigate = useNavigate();
  const error = propError || "An unexpected error occurred";
  const isLoading = propIsLoading || false;

  const getErrorDetails = () => {
    if (error.includes("Network Error") || error.includes("timeout")) {
      return {
        icon: WifiOff,
        title: "Connection Problem",
        message: "Unable to connect to our servers. Please check your internet connection.",
        suggestion: "Try refreshing the page or check your network connection.",
      };
    } else if (error.includes("401") || error.includes("unauthorized")) {
      return {
        icon: AlertTriangle,
        title: "Authentication Error",
        message: "Your session has expired. Please sign in again.",
        suggestion: "You will be redirected to the login page.",
      };
    } else {
      return {
        icon: AlertCircle,
        title: "Something went wrong",
        message: error,
        suggestion: "This is usually temporary. Please try again.",
      };
    }
  };
  const errorDetails = getErrorDetails();
  const ErrorIcon = errorDetails.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <ErrorIcon className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{errorDetails.title}</h1>
          <p className="text-gray-600 mb-2 leading-relaxed">{errorDetails.message}</p>
          <p className="text-sm text-gray-500 mb-8">{errorDetails.suggestion}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRetry}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              aria-label="Retry loading dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Retrying..." : "Try Again"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              aria-label="Back to login page"
            >
              <LogOut className="w-4 h-4" />
              Back to Login
            </button>
          </div>
          {retryCount > 0 && (
            <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Retry attempt: {retryCount}
                {retryCount >= 3 && " - If this persists, please contact support."}
              </p>
            </div>
          )}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="mailto:support@revuai.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;