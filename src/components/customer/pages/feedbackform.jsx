import { Star, UserX, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeedbackForm = () => {
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [textFeedback, setTextFeedback] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState('Demo Coffee Shop');
  const navigate = useNavigate();
  const { businessId, qrcodeId } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // Fetch business name using qrcodeId
  useEffect(() => {
    if (qrcodeId) {
      const fetchBusinessName = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/v1/qr/${qrcodeId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch business details');
          }

          const data = await response.json();
          setBusinessName(data.business_name || data.label || 'Unknown Business');
        } catch (err) {
          console.error('Error fetching business details:', err);
          toast.error(err.message || 'Failed to load business details');
        }
      };

      fetchBusinessName();
    }
  }, [qrcodeId]);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleBack = () => {
    navigate(qrcodeId && businessId ? `/qr/${businessId}/${qrcodeId}` : '/');
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleTextChange = (e) => {
    setTextFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    if (!businessId || !qrcodeId) {
      toast.error('Please scan a QR code to provide feedback');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        businessId,
        qrcodeId,
        rating,
        comment: textFeedback.trim() || null,
        isAnonymous: !user,
        qrcode_tags: selectedTags,
      };

      console.log('Submitting feedback:', payload);
      const response = await fetch(`${BASE_URL}/api/v1/review/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      console.log('Feedback submitted successfully:', data);
      toast.success('Feedback submitted successfully!');
      navigate('/thankYou');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (value) => {
    switch (value) {
      case 1:
      case 2:
        return 'Needs Improvement';
      case 3:
      case 4:
        return 'Good';
      case 5:
        return 'Excellent';
      default:
        return '';
    }
  };

  const getRatingColor = (value) => {
    switch (value) {
      case 1:
      case 2:
        return { star: 'text-red-500 fill-red-500', label: 'text-red-500' };
      case 3:
      case 4:
        return { star: 'text-yellow-400 fill-yellow-400', label: 'text-yellow-500' };
      case 5:
        return { star: 'text-green-500 fill-green-500', label: 'text-green-500' };
      default:
        return { star: 'text-gray-300 fill-gray-300', label: 'text-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF]">
      <ToastContainer />
      <div className="bg-white flex items-center px-4 py-4 shadow-sm">
        <button
          onClick={handleBack}
          className="text-black cursor-pointer hover:text-blue-700 hover:bg-blue-200 px-2 py-1 rounded flex items-center text-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="w-full max-w-[80rem] mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-blue-600 text-xl font-medium">Share Your Experience</h2>
          <p className="text-gray-500 text-sm mt-1">{businessName}</p>
        </div>

        <div className="bg-white p-4 flex items-center gap-3 rounded-lg shadow-sm mb-4">
          <div className={`${user ? 'bg-blue-100' : 'bg-gray-100'} rounded-full p-2`}>
            {user ? <User className="h-4 w-4 text-blue-600" /> : <UserX className="h-4 w-4 text-gray-600" />}
          </div>
          <div>
            {user ? (
              <p className="text-gray-800 text-sm font-medium">Submitting as {user.fullname || 'User'}</p>
            ) : (
              <p className="text-gray-800 text-sm font-medium">Submitting as anonymous</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <p className="text-gray-800 text-lg text-center mb-6">How was your experience?</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const currentRating = hoverRating || rating;
              const colors = getRatingColor(currentRating);
              return (
                <Star
                  key={star}
                  className={`w-12 h-12 cursor-pointer transition-colors ${
                    star <= currentRating ? colors.star : 'text-gray-300 fill-gray-300'
                  }`}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                />
              );
            })}
          </div>
          <div className="text-center mt-4">
            <span className={`text-sm font-medium ${getRatingColor(hoverRating || rating).label}`}>
              {getRatingLabel(hoverRating || rating)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <p className="text-gray-800 text-sm font-medium mb-3">What stood out? (Optional)</p>
          <div className="flex flex-wrap gap-2">
            {['Service', 'Food Quality', 'Cleanliness', 'Atmosphere', 'Speed', 'Value', 'Staff Friendly', 'Would Recommend'].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => handleTagClick(item)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    selectedTags.includes(item)
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <p className="text-gray-800 text-sm font-medium mb-3">Tell us more (Optional)</p>
          <textarea
            value={textFeedback}
            onChange={handleTextChange}
            className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Share your detailed thoughts, suggestions, or compliments..."
            maxLength={500}
          />
          <p className="text-gray-400 text-xs text-right mt-1">{textFeedback.length}/500 characters</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full cursor-pointer py-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
            loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;