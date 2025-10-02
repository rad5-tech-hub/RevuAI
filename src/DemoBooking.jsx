import { useState, useRef, useEffect } from 'react';
import { CheckCircle, Sparkles, Star, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

const DemoBooking = () => {
  const [state, handleSubmit] = useForm("xgvnvzeq");
  const [formData, setFormData] = useState({
    businessName: '',
    yourName: '',
    phone: '',
    email: '',
    businessType: 'Hotel',
    location: '',
    reviewCount: 'Less than 50',
    biggestChallenge: '',
    otherChallenge: '', // New field for custom input when "Other" is selected
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // Handle input changes for text inputs and selects
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle radio button changes for biggestChallenge
  const handleChallengeChange = (value) => {
    setFormData((prev) => ({ ...prev, biggestChallenge: value }));
    if (errors.biggestChallenge) {
      setErrors((prev) => ({ ...prev, biggestChallenge: '' }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.businessName) tempErrors.businessName = 'Business Name is required';
    if (!formData.yourName) tempErrors.yourName = 'Your Name is required';
    if (!formData.phone) tempErrors.phone = 'Phone/WhatsApp is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.location) tempErrors.location = 'Location is required';
    if (!formData.biggestChallenge) tempErrors.biggestChallenge = 'Please select a challenge';
    if (formData.biggestChallenge === 'Other' && !formData.otherChallenge.trim()) {
      tempErrors.otherChallenge = 'Please specify your challenge';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const url = import.meta.env.VITE_GOOGLE_SHEETS_WEB_URL;

  // Function to append form data to Google Sheet
  const appendToGoogleSheet = async () => {
    try {
      const submissionData = {
        ...formData,
        biggestChallenge: formData.biggestChallenge === 'Other' ? formData.otherChallenge : formData.biggestChallenge,
      };
      const response = await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      console.log("Data sent to Google Sheet successfully");
      return true;
    } catch (error) {
      console.error("Failed to save to Google Sheet:", error);
      return false;
    }
  };

  // Custom form submission handler
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const submissionData = {
          ...formData,
          biggestChallenge: formData.biggestChallenge === 'Other' ? formData.otherChallenge : formData.biggestChallenge,
        };
        await Promise.all([handleSubmit(submissionData), appendToGoogleSheet()]);
      } catch (error) {
        console.log('Submission failed. Please try again.');
      }
    } else {
      console.log('Please fill out all required fields.');
    }
  };

  // Reset form after successful submission and handle redirect
  useEffect(() => {
    if (state.succeeded) {
      setFormData({
        businessName: '',
        yourName: '',
        phone: '',
        email: '',
        businessType: 'Hotel',
        location: '',
        reviewCount: 'Less than 50',
        biggestChallenge: '',
        otherChallenge: '',
      });
      setErrors({});
      if (formRef.current) {
        formRef.current.reset();
      }

      const redirectTimer = setTimeout(() => {
        window.location.href = '/';
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [state.succeeded]);

  const challengeOptions = [
    'We rarely get direct feedback from customers',
    'We find out about problems too late (in online reviews)',
    'Guests leave without telling us what went wrong or what they enjoyed',
    'We don\'t have time to read through all the feedback',
    'We get feedback but don\'t know what to fix first',
    'Other',
  ];

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-400 flex items-center justify-center px-4 py-12 sm:p-6">
        <div className="bg-white/70 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-lg md:shadow-2xl border border-blue-600 max-w-xs sm:max-w-sm md:max-w-md w-full text-center animate-pulse">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
            <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2 sm:mb-4">Thank You!</h2>
          <p className="text-blue-700 text-base sm:text-lg mb-4 sm:mb-6">Your demo request has been submitted successfully, you have been added to the wait list.</p>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-blue-600">
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
            <span className="text-sm sm:text-base">Redirecting.....</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-200/20 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-300/20 rounded-full blur-xl sm:blur-2xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <div className="bg-white/70 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-md md:shadow-xl border border-blue-600 hover:shadow-blue-200/50 transition-all duration-700">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center justify-center w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl md:rounded-2xl mb-2 sm:mb-4 shadow-md">
                <Calendar className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 sm:mb-3">
                Book Your FREE Demo
              </h1>
              <p className="text-blue-600 text-base sm:text-lg font-medium">See ScanRevuAI Transform Your Business</p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={onSubmit} ref={formRef}>
              <div className="group">
                <label className="block text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                    ${errors.businessName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                    } focus:outline-none placeholder-blue-600`}
                  placeholder="Enter your business name"
                />
                <ValidationError 
                  prefix="Business Name" 
                  field="businessName"
                  errors={state.errors}
                />
                {errors.businessName && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.businessName}</p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">Your Name *</label>
                <input
                  type="text"
                  name="yourName"
                  id="yourName"
                  value={formData.yourName}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                    ${errors.yourName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                    } focus:outline-none placeholder-blue-600`}
                  placeholder="Enter your full name"
                />
                <ValidationError 
                  prefix="Your Name" 
                  field="yourName"
                  errors={state.errors}
                />
                {errors.yourName && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.yourName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">Phone/WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                      ${errors.phone 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                      } focus:outline-none placeholder-blue-500`}
                    placeholder="+234 xxx xxx xxxx"
                  />
                  <ValidationError 
                    prefix="Phone" 
                    field="phone"
                    errors={state.errors}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                      ${errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                      } focus:outline-none placeholder-blue-500`}
                    placeholder="your@email.com"
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border-2 border-blue-500 focus:border-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm focus:outline-none text-blue-800"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Other">Other</option>
                  </select>
                  <ValidationError 
                    prefix="Business Type" 
                    field="businessType"
                    errors={state.errors}
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                      ${errors.location 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                      } focus:outline-none placeholder-blue-500`}
                    placeholder="City, Country"
                  />
                  <ValidationError 
                    prefix="Location" 
                    field="location"
                    errors={state.errors}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.location}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-semibold text-blue-900 mb-1 sm:mb-2">Current Monthly Reviews</label>
                <select
                  name="reviewCount"
                  id='reviewCount'
                  value={formData.reviewCount}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border-2 border-blue-500 focus:border-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm focus:outline-none text-blue-800"
                >
                  <option value="Less than 50">Less than 50</option>
                  <option value="50-200">50-200</option>
                  <option value="200-500">200-500</option>
                  <option value="500+">500+</option>
                </select>
                <ValidationError 
                  prefix="Monthly Reviews" 
                  field="reviewCount"
                  errors={state.errors}
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-semibold text-blue-900 mb-2 sm:mb-3">What's your biggest challenge with customer feedback? *</label>
                <div className="space-y-2 sm:space-y-3">
                  {challengeOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="biggestChallenge"
                        value={option}
                        checked={formData.biggestChallenge === option}
                        onChange={() => handleChallengeChange(option)}
                        className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 border-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-blue-900 text-sm sm:text-base">{option}</span>
                    </label>
                  ))}
                </div>
                <ValidationError 
                  prefix="Biggest Challenge" 
                  field="biggestChallenge"
                  errors={state.errors}
                />
                {errors.biggestChallenge && (
                  <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.biggestChallenge}</p>
                )}
                {formData.biggestChallenge === 'Other' && (
                  <div className="mt-3 sm:mt-4">
                    <textarea
                      name="otherChallenge"
                      id="otherChallenge"
                      value={formData.otherChallenge}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                        ${errors.otherChallenge 
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                          : 'border-blue-500 focus:border-blue-700 focus:ring-4 focus:ring-blue-100'
                        } focus:outline-none placeholder-blue-700 resize-none`}
                      rows="3 sm:rows-4"
                      placeholder="Please specify your challenge..."
                    />
                    {errors.otherChallenge && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.otherChallenge}</p>
                    )}
                  </div>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={state.submitting}
                className={`w-full bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl shadow-md md:shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-base sm:text-lg group ${state.submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <Calendar className="w-4 sm:w-5 h-4 sm:h-5 group-hover:animate-pulse" />
                  <span>{state.submitting ? 'Submitting...' : 'Book My FREE Demo'}</span>
                  <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 group-hover:animate-spin" />
                </span>
              </button>
            </form>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-2 sm:mb-4">
                Transform Your Customer Experience in 15 Minutes
              </h2>
              <p className="text-blue-700 text-base sm:text-lg leading-relaxed">
                See exactly how ScanRevuAI can revolutionize your review management and boost customer satisfaction.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6">
              <div className="bg-white/40 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-blue-200 hover:bg-white/60 transition-all duration-300 group">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-blue-900 mb-1 sm:mb-2">QR Code Feedback System</h3>
                    <p className="text-blue-700 text-xs sm:text-sm md:text-base">Watch how customers leave feedback instantly with our seamless QR system</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-blue-200 hover:bg-white/60 transition-all duration-300 group">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-blue-900 mb-1 sm:mb-2">Real-time AI Analysis</h3>
                    <p className="text-blue-700 text-xs sm:text-sm md:text-base">See AI analyze sentiment and extract insights from customer feedback instantly</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-blue-200 hover:bg-white/60 transition-all duration-300 group">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-blue-900 mb-1 sm:mb-2">Personalized Recommendations</h3>
                    <p className="text-blue-700 text-xs sm:text-sm md:text-base">Get tailored insights and action plans specific to your business type</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-blue-200 hover:bg-white/60 transition-all duration-300 group">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-blue-900 mb-1 sm:mb-2">Complete Setup Guide</h3>
                    <p className="text-blue-700 text-xs sm:text-sm md:text-base">Learn step-by-step how to implement and optimize your feedback system</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-blue-200">
              <div className="text-center">
                <p className="text-blue-800 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Join 500+ Businesses Already Using ScanRevuAI</p>
                <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-blue-700 text-xs sm:text-sm md:text-base ml-1 sm:ml-2">4.9/5 Average Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBooking;