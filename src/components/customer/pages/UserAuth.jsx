import { User, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserAuth = () => {
const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(''); // Clear error when switching tabs
    // Clear form when switching tabs
    setFormData({
      fullname: '',
      email: '',
      password: ''
    });
  };

  const handleInputChange = (field, value) => {
    setError(''); // Clear error when user starts typing
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (activeTab === 'signup' && !formData.fullname.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const url = activeTab === 'signin' 
        ? 'http://localhost:3000/api/v1/user/login'
        : 'http://localhost:3000/api/v1/user/register-user';

      const payload = activeTab === 'signin' 
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            fullname: formData.fullname, // Note: API expects 'fullname' not 'fullName'
            email: formData.email,
            password: formData.password
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${activeTab === 'signin' ? 'Login' : 'Registration'} failed`);
      }

      // Success - handle the response
      console.log(`${activeTab === 'signin' ? 'Login' : 'Registration'} successful:`, data);
      
      // Store token if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Navigate to user account
      navigate('/userAccount');
      alert(`${activeTab === 'signin' ? 'Login' : 'Registration'} successful!`);

    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/feedbackForm');
  };

  const handleBack = () => {
    navigate('/');
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

      <div className="w-full max-w-md mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-blue-600 text-xl font-medium mb-2">Join ScanReview</h1>
          <p className="text-gray-600 text-sm">
            Sign in to track your feedback history
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Tab Navigation */}
          <div className="flex mb-6">
            <button
              onClick={() => handleTabChange('signin')}
              className={`flex-1 py-2 px-4 text-sm font-medium cursor-pointer rounded-l-lg transition-colors ${
                activeTab === 'signin'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2 px-4 text-sm font-medium cursor-pointer rounded-r-lg transition-colors ${
                activeTab === 'signup'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name - Only for Sign Up */}
            {activeTab === 'signup' && (
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.fullname}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                placeholder={activeTab === 'signin' ? 'Password' : 'Create password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-lg text-sm cursor-pointer font-medium transition-colors mt-6 ${
              activeTab === 'signin'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800'
            }`}
          >
            {activeTab === 'signin' ? 'Sign In ' : 'Create Account'}
          </button>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            {activeTab === 'signin' ? (
              <p className="text-gray-500 text-xs">
                Demo: Use any email and password to continue
              </p>
            ) : (
              <p className="text-gray-500 text-xs">
                By signing up, you agree to our Terms and Privacy Policy
              </p>
            )}
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-black text-sm hover:text-blue-800 rounded-sm hover:bg-blue-100 px-2 py-3 cursor-pointer transition-colors"
          >
            Skip for now, continue to feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;