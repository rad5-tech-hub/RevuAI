import { Check, Star, Users, QrCode } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleCreateAccount = () => {
    navigate('/userAuth');
  };

  const handleSubmitAnother = () => {
    const { businessId, qrcodeId } = state || {};
    if (businessId && qrcodeId) {
      console.log('Navigating to QR landing page:', `/qr/${businessId}/${qrcodeId}`);
      navigate(`/qr/${businessId}/${qrcodeId}`);
    } else {
      console.warn('No businessId or qrcodeId in state, navigating to home');
      navigate('/');
    }
  };

  const handleShareQR = () => {
    console.log('Share QR Code clicked');
  };

  const handleRateGoogle = () => {
    console.log('Rate on Google clicked');
  };

  return (
    <div className="min-h-screen bg-[#E8F5E8]">

      <div className="w-full max-w-[80rem] mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-64 h-32 mx-auto bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center relative">
              <div className="w-48 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
          
          <h1 className="text-green-600 text-2xl font-semibold mb-2">Thank You!</h1>
          <p className="text-gray-600 text-sm">Your feedback has been submitted successfully</p>
        </div>

        {/* Want to Earn Rewards Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-gray-800 text-lg font-medium mb-2">Not Signed in?</h2>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Submit Another Feedback
        </button>

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
            <button 
              onClick={handleRateGoogle}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Star className="w-4 h-4" />
              Rate on Google
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