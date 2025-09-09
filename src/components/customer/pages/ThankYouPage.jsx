import { Check, Star, Users, QrCode, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrContext, setQrContext] = useState(null);

  // Extract businessId, qrcodeId, and qrContext from location.state or localStorage
  const { businessId, qrcodeId, qrContext: stateQrContext } = state || {};
  const BASE_SCAN_URL = import.meta.env.VITE_SCAN_URL?.replace(/\/+$/, '') || 'https://your-app.vercel.app';

  // Check authentication and construct QR code URL
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    setIsAuthenticated(!!token && !!userData);

    // Set qrContext from state or localStorage
    if (stateQrContext) {
      setQrContext(stateQrContext);
      // console.log('ThankYouPage - Loaded qrContext from location.state:', stateQrContext);
      localStorage.setItem('qrContext', JSON.stringify(stateQrContext));
    } else {
      const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
      if (storedQrContext.businessId && storedQrContext.qrcodeId) {
        setQrContext(storedQrContext);
        // console.log('ThankYouPage - Loaded qrContext from localStorage:', storedQrContext);
      } else {
        console.warn('ThankYouPage - No qrContext found');
      }
    }

    // Construct QR code URL
    if (businessId && qrcodeId) {
      const constructedUrl = `${BASE_SCAN_URL}/qr/${businessId}/${qrcodeId}`;
      setQrCodeUrl(constructedUrl);
      // console.log('ThankYouPage - QR Code URL:', constructedUrl);
    } else {
      const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
      if (storedQrContext.businessId && storedQrContext.qrcodeId) {
        const constructedUrl = `${BASE_SCAN_URL}/qr/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`;
        setQrCodeUrl(constructedUrl);
        // console.log('ThankYouPage - QR Code URL from qrContext:', constructedUrl);
      } else {
        console.warn('ThankYouPage - No businessId or qrcodeId found');
      }
    }
  }, [businessId, qrcodeId, stateQrContext]);

  // Handle navigation to create account
  const handleCreateAccount = () => {
    navigate('/userAuth', { state: { businessId, qrcodeId, qrContext } });
  };

  // Handle navigation to dashboard (signed-in users)
  const handleGoToDashboard = () => {
    navigate('/userAccount', { state: { businessId, qrcodeId, qrContext, fromThankYou: true } });
  };

  // Handle navigation to submit another feedback
  const handleSubmitAnother = () => {
    if (businessId && qrcodeId && qrContext) {
      navigate(`/qr/${businessId}/${qrcodeId}`, { state: { qrContext } });
    } else if (qrContext?.businessId && qrContext?.qrcodeId) {
      navigate(`/qr/${qrContext.businessId}/${qrContext.qrcodeId}`, { state: { qrContext } });
    } else {
      const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
      if (storedQrContext.businessId && storedQrContext.qrcodeId) {
        navigate(`/qr/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`, {
          state: { qrContext: storedQrContext },
        });
      } else {
        console.warn('No businessId or qrcodeId in state or qrContext, navigating to /feedbackForm');
        navigate('/feedbackForm');
      }
    }
  };

  // Handle sharing the QR code URL
  const handleShareQR = async () => {
    if (!qrCodeUrl) {
      toast.error('No QR code URL available to share.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share QR Code',
          text: 'Scan this QR code to provide feedback!',
          url: qrCodeUrl,
        });
        toast.success('QR code shared successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (error) {
        console.error('Share error:', error);
        toast.error('Failed to share QR code.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(qrCodeUrl);
        toast.success('QR code URL copied to clipboard!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (error) {
        console.error('Clipboard copy error:', error);
        toast.error('Failed to copy QR code URL.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E8]">
      <ToastContainer />
      <div className="w-full max-w-[80rem] mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-64 h-32 mx-auto bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center relative">
              <div className="w-48 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
          <h1 className="text-green-600 text-2xl font-semibold mb-2">Thank You!</h1>
          <p className="text-gray-600 text-sm">
            {isAuthenticated
              ? 'Your feedback has been submitted successfully. View your dashboard or submit another feedback.'
              : 'Your feedback has been submitted successfully.'}
          </p>
        </div>

        {/* Signed-In User Actions */}
        {isAuthenticated ? (
          <div className="space-y-4 mb-6">
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Go to Dashboard
            </button>
            <button
              onClick={handleSubmitAnother}
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white py-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Submit Another Feedback
            </button>
          </div>
        ) : (
          <>
            {/* Not Signed In? Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-gray-800 text-lg font-medium mb-2">Not Signed In?</h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Sign in next time to see your history.
                </p>
                <button
                  onClick={handleCreateAccount}
                  className="w-full py-3 px-4 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Your Voice Matters Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-gray-800 text-lg font-medium mb-2">Your Voice Matters</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your feedback helps improve the experience for everyone.<br />
                  Thank you for taking the time to share!
                </p>
              </div>
            </div>

            {/* Submit Another Feedback Button */}
            <button
              onClick={handleSubmitAnother}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-4 rounded-lg text-sm font-medium transition-colors mb-6 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Submit Another Feedback
            </button>
          </>
        )}

        {/* Share Section */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm mb-4">Love this business? Share with friends!</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleShareQR}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <QrCode className="w-4 h-4" />
              Share QR Code
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-xs">Powered by ScanReview</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;