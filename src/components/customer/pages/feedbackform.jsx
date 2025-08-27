import { Star, 
  // Camera, 
  // Video, 
  UserX, 
  // Upload 
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FeedbackForm = () => {
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [textFeedback, setTextFeedback] = useState('');
  const navigate = useNavigate();

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleBack = () => {
    navigate('/');
  }

  const handleSubmit = () => {
    navigate('/thankYou')
  }

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleTagClick = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleTextChange = (e) => {
    setTextFeedback(e.target.value);
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
        return {
          star: 'text-red-500 fill-red-500',
          label: 'text-red-500'
        };
      case 3:
      case 4:
        return {
          star: 'text-yellow-400 fill-yellow-400',
          label: 'text-yellow-500'
        };
      case 5:
        return {
          star: 'text-green-500 fill-green-500',
          label: 'text-green-500'
        };
      default:
        return {
          star: 'text-gray-300 fill-gray-300',
          label: 'text-gray-500'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF]">
      {/* Header */}
      <div className="bg-white flex items-center px-4 py-4 shadow-sm">
        <button onClick={handleBack}
          className="text-black cursor-pointer hover:text-blue-700 hover:bg-blue-200 px-2 py-1 rounded flex items-center text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="w-full max-w-[80rem] mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-blue-600 text-xl font-medium">Share Your Experience</h2>
          <p className="text-gray-500 text-sm mt-1">Demo Coffee Shop</p>
        </div>

        {/* Anonymous submission info */}
        <div className="bg-white p-4 flex items-center gap-3 rounded-lg shadow-sm mb-4">
          <div className="bg-gray-100 rounded-full p-2"> 
            <UserX className="h-4 w-4 text-gray-600"/> 
          </div>
          <div>
            <p className="text-gray-800 text-sm font-medium">Submitting as anonymous</p>
            <p className="text-gray-500 text-xs">Sign in to earn points</p>
          </div>
        </div>

        {/* Rating section */}
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
                    star <= currentRating 
                      ? colors.star
                      : 'text-gray-300 fill-gray-300'
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

        {/* Tags section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <p className="text-gray-800 text-sm font-medium mb-3">What stood out? (Optional)</p>
          <div className="flex flex-wrap gap-2">
            {['Service', 'Food Quality', 'Cleanliness', 'Atmosphere', 'Speed', 'Value', 'Staff Friendly', 'Would Recommend'].map((item) => (
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
            ))}
          </div>
        </div>

        {/* Text feedback section */}
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

        {/* Media upload section */}
        {/* <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <p className="text-gray-800 text-sm font-medium mb-3">Add Photos or Videos (Optional)</p>
          <div className="grid grid-cols-3 gap-3">
            <button className="aspect-square bg-gray-50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs">Photo</span>
            </button>
            <button className="aspect-square bg-gray-50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
              <Video className="w-6 h-6 mb-1" />
              <span className="text-xs">Video</span>
            </button>
            <button className="aspect-square bg-gray-50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-xs">Upload</span>
            </button>
          </div>
        </div> */}

        {/* Submit button */}
        <button onClick={handleSubmit}
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-sm font-medium transition-colors">
            Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;