import { Link, useNavigate, useParams } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function LandingPage() {
  const navigate = useNavigate();
  const { businessId, qrcodeId } = useParams(); // Extract parameters from URL
  const [businessName, setBusinessName] = useState('Demo Coffee Shop'); // Default fallback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Fetch QR code details
  useEffect(() => {
    if (qrcodeId) {
      const fetchQrDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/api/v1/qr/${qrcodeId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch QR code details');
          }

          const data = await response.json();
          // Assuming API returns { business_name, label, businessId, qrcodeId }
          setBusinessName(data.business_name || data.label || 'Unknown Business');
        } catch (err) {
          console.error('Error fetching QR details:', err);
          setError(err.message);
          toast.error(err.message || 'Failed to load business details');
        } finally {
          setLoading(false);
        }
      };

      fetchQrDetails();
    }
  }, [qrcodeId]);

  const handleSignIn = () => {
    navigate('/userAuth');
  };

  const handleContinueAnonymously = () => {
    // Pass businessId and qrcodeId to feedbackForm
    navigate(`/feedbackForm/${businessId}/${qrcodeId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Business</h2>
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-[88rem] mx-auto px-6 pt-12 pb-8 text-center">
        {/* Logo */}
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
          <QrCode />
        </div>

        {/* ScanReview Title */}
        <h1 className="text-2xl font-bold text-black mb-2">RevuAI</h1>
        <p className="text-black text-sm mb-8">Share your experience</p>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-black text-base mb-2">Welcome to</h2>
          <h3 className="text-2xl font-bold text-blue-500 mb-4">{businessName}</h3>
          <p className="text-black text-sm leading-relaxed">
            Your feedback helps us serve you better. Share your thoughts and get rewarded!
          </p>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 mb-4"
        >
          Sign In
        </button>

        {/* Continue Anonymously */}
        <button
          onClick={handleContinueAnonymously}
          className="w-full cursor-pointer bg-white hover:bg-blue-200 text-black hover:text-blue-700 font-medium py-4 px-6 rounded-xl border hover:border-blue-700 transition-colors duration-200 mb-6"
        >
          Continue Anonymously
        </button>

        {/* Business Owner Link */}
        <div className="text-center">
          <Link
            to="/businessAuth"
            className="text-black text-sm underline hover:text-blue-500 transition-colors"
          >
            Business Owner? Access Portal
          </Link>
        </div>
      </div>

      <p className="text-center text-gray-600 text-sm">Powered by RevuAi . Privacy Protected</p>
    </div>
  );
}

export default LandingPage;