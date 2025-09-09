import { User, Clock, ArrowRight, Tag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserAccount = () => {
  const [userStats, setUserStats] = useState({
    fullName: '',
    totalFeedbacks: 0,
    totalBusinessesReviewed: 0,
    businessesReviewed: [],
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Extract businessId and qrcodeId from navigation state
  const { businessId, qrcodeId, fromThankYou } = location.state || {};

  // Debug location.state and token
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    // console.log('UserAccount Location State:', location.state);
    // console.log('Auth token:', token || 'No token');
  }, [location.state]);

  // Fetch user dashboard data
  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
          toast.error('Please sign in to view your dashboard');
          navigate('/userAuth', { state: { businessId, qrcodeId } });
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/user/dashboard`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            toast.error('Session expired. Please sign in again.');
            navigate('/userAuth', { state: { businessId, qrcodeId } });
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch dashboard data: ${response.status}`);
        }

        const data = await response.json();
        // console.log('Dashboard API Response:', JSON.stringify(data, null, 2));

        setUserStats({
          fullName: data.fullname || 'User',
          totalFeedbacks: data.total_feedbacks || 0,
          totalBusinessesReviewed: data.total_businesses_reviewed || 0,
          businessesReviewed: Array.isArray(data.businesses_reviewed) ? data.businesses_reviewed : [],
        });

        if (Array.isArray(data.recent_feedbacks)) {
          // Parse qrcode_tags if it's a string
          const parsedFeedbacks = data.recent_feedbacks.map((feedback) => ({
            ...feedback,
            qrcode_tags: typeof feedback.qrcode_tags === 'string'
              ? JSON.parse(feedback.qrcode_tags)
              : Array.isArray(feedback.qrcode_tags)
                ? feedback.qrcode_tags
                : [],
          }));
          setRecentFeedback(parsedFeedbacks);
          // Log qrcode_tags for each feedback
          parsedFeedbacks.forEach((feedback, index) => {
            // console.log(`Feedback ${index} qrcode_tags:`, feedback.qrcode_tags, 'Type:', typeof feedback.qrcode_tags);
          });
        } else {
          console.warn('recent_feedbacks is not an array:', data.recent_feedbacks);
          setRecentFeedback([]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        toast.error(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDashboard();
  }, [navigate, businessId, qrcodeId]);

  const handleBack = () => {
    // console.log('handleBack - location.state:', location.state, 'recentFeedback:', recentFeedback);
    if (location.state?.businessId && location.state?.qrcodeId) {
      navigate(`/qr/${location.state.businessId}/${location.state.qrcodeId}`);
    } else {
      const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
      if (storedQrContext.businessId && storedQrContext.qrcodeId) {
        navigate(`/qr/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`);
      } else if (recentFeedback.length > 0 && recentFeedback[0].businessId && recentFeedback[0].qrcodeId) {
        navigate(`/qr/${recentFeedback[0].businessId}/${recentFeedback[0].qrcodeId}`);
      } else {
        navigate(-1);
      }
    }
  };

  const handleContinueToFeedback = () => {
    if (location.state?.businessId && location.state?.qrcodeId) {
      navigate(`/feedbackForm/${location.state.businessId}/${location.state.qrcodeId}`);
    } else {
      const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
      if (storedQrContext.businessId && storedQrContext.qrcodeId) {
        navigate(`/feedbackForm/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`);
      } else if (recentFeedback.length > 0 && recentFeedback[0].businessId && recentFeedback[0].qrcodeId) {
        navigate(`/feedbackForm/${recentFeedback[0].businessId}/${recentFeedback[0].qrcodeId}`);
      } else {
        navigate('/feedbackForm');
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-sm ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white flex items-center px-4 py-4 shadow-sm">
        <button
          onClick={handleBack}
          className="text-black hover:text-blue-700 cursor-pointer hover:bg-blue-100 px-2 py-1 rounded flex items-center text-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-blue-600 text-xl font-medium mb-2">Welcome back, {userStats.fullName}!</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.totalFeedbacks}</div>
            <div className="text-gray-600 text-sm">Total Feedbacks</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{userStats.totalBusinessesReviewed}</div>
            <div className="text-gray-600 text-sm">Reviewed Businesses</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-medium">Reviewed Businesses</h2>
          </div>
          {userStats.businessesReviewed.length > 0 ? (
            <div className="space-y-2">
              {userStats.businessesReviewed.map((business, index) => (
                <div
                  key={business.id || index}
                  className="flex items-center justify-between bg-gray-50 rounded-sm px-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-sm text-gray-800">{business.name || 'Unknown Business'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No businesses reviewed yet</p>
              <p className="text-sm">Start giving feedback to see businesses here!</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-medium">Recent Feedback</h2>
          </div>
          {recentFeedback.length > 0 ? (
            <div className="space-y-4">
              {recentFeedback.map((feedback, index) => (
                <div
                  key={`${feedback.id || 'feedback'}-${index}`}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between bg-blue-50 rounded-sm px-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1 max-w-full">
                    <h3 className="text-black font-medium text-sm mb-1">
                      {feedback.business?.business_name || 'Unknown Business'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex">{renderStars(feedback.rating || 0)}</div>
                      <span className="text-gray-500 text-xs">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {feedback.ratingLabel || 'No Label'}
                      </span>
                      {feedback.isAnonymous && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          Anonymous
                        </span>
                      )}
                    </div>
                    {Array.isArray(feedback.qrcode_tags) && feedback.qrcode_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 max-w-full">
                        {feedback.qrcode_tags.map((tag, tagIndex) => (
                          <span
                            key={`${tag}-${tagIndex}`}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {feedback.comment && (
                      <p className="text-gray-600 text-xs mt-1 max-w-full truncate">
                        "{feedback.comment}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent feedback found</p>
              <p className="text-sm">Start giving feedback to see your activity here!</p>
            </div>
          )}
        </div>

        {!fromThankYou && businessId && qrcodeId && (
          <button
            onClick={handleContinueToFeedback}
            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            Continue to Feedback
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserAccount;