import { Link, 
  useNavigate 
 }from 'react-router-dom';
import { QrCode } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/userAuth');
  };

  const handleContinueAnonymously = () => {
    navigate('/feedbackForm');
  };

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
          <h3 className="text-2xl font-bold text-blue-500 mb-4">Demo Coffee Shop</h3>
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
            className="text-black text-sm underline  hover:text-blue-500 transition-colors"
          >
            Business Owner? Access Portal
          </Link>
        </div>
      </div>

      <p className="text-center text-gray-600 text-sm ">Powered by RevuAi . Privacy Protected</p>
    </div>
  );
};

export default LandingPage;