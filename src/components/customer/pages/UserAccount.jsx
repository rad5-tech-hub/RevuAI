import { User, Clock, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const UserAccount = () => {
  const [userStats] = useState({
    totalPoints: 350,
    feedbacks: 12,
    userName: 'Wisdomcezeh'
  });

  const navigate = useNavigate();

  const [recentFeedback] = useState([
    {
      businessName: 'Demo Coffee Shop',
      rating: 5,
      date: '2025-01-15',
      status: 'completed'
    },
    {
      businessName: 'Pizza Palace',
      rating: 3,
      date: '2025-01-10',
      status: 'completed'
    },
    {
      businessName: 'Book Store Cafe',
      rating: 5,
      date: '2025-01-08',
      status: 'pending'
    }
  ]);

  const handleBack = () => {
    navigate('/')
  };

  const handleContinueToFeedback = () => {
    navigate('/feedbackForm');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center px-4 py-4 shadow-sm">
        <button onClick={handleBack}
          className="text-black hover:text-blue-700 cursor-pointer hover:bg-blue-100 px-2 py-1 rounded flex items-center text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-blue-600 text-xl font-medium mb-2">
            Welcome back, {userStats.userName}!
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-center mb-8">         
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">{userStats.feedbacks}</div>
            <div className="text-gray-600 text-sm">Feedbacks</div>
          </div>
        </div>

        
        {/* Recent Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-medium">Recent Feedback</h2>
          </div>
          
          <div className="space-y-4">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="flex items-center justify-between bg-blue-100 rounded-sm px-2 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <h3 className="text-black font-medium text-sm mb-1">{feedback.businessName}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(feedback.rating)}</div>
                    <span className="text-gray-500 text-xs">{feedback.date}</span>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* Continue to Feedback Button */}
        <button 
          onClick={handleContinueToFeedback}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          Continue to Feedback
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UserAccount;