import { User, Mail, Lock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserAuth = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Extract businessId and qrcodeId from navigation state
  const { businessId, qrcodeId } = location.state || {};

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setFormData({
      fullname: '',
      email: '',
      password: '',
    });
  };

  const handleInputChange = (field, value) => {
    setError('');
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      const url =
        activeTab === 'signin'
          ? `${BASE_URL}/api/v1/user/login`
          : `${BASE_URL}/api/v1/user/register-user`;

      const payload =
        activeTab === 'signin'
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              fullname: formData.fullname,
              email: formData.email,
              password: formData.password,
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

      toast.success(`${activeTab === 'signin' ? 'Login' : 'Registration'} successful!`);

      if (activeTab === 'signin') {
        // Store token
        let token = null;
        if (data.token) {
          token = data.token;
        } else if (data.accessToken) {
          token = data.accessToken;
        } else if (data.access_token) {
          token = data.access_token;
        } else if (data.authToken) {
          token = data.authToken;
        } else if (data.jwt) {
          token = data.jwt;
        }

        if (token) {
          localStorage.setItem('authToken', token);
        } else {
          toast.warning('Login successful but no token received.');
        }

        // Store user data
        const userData = {
          fullname: data.fullname || formData.email,
          email: formData.email,
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Navigate to userAccount with businessId and qrcodeId
        console.log('UserAuth handleSubmit - Location State:', location.state);
        navigate('/userAccount', { state: { businessId, qrcodeId } });
      } else {
        setActiveTab('signin');
        toast.info('Account created successfully! Please sign in.');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

    const handleSkip = () => {
      console.log('UserAuth handleSkip - Location State:', location.state);
      if (businessId && qrcodeId) {
        navigate(`/feedbackForm/${businessId}/${qrcodeId}`);
      } else {
        const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
        if (storedQrContext.businessId && storedQrContext.qrcodeId) {
          navigate(`/feedbackForm/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`);
        } else {
          navigate('/feedbackForm');
        }
      }
    };

    const handleBack = () => {
      console.log('UserAuth handleBack - Location State:', location.state);
      if (businessId && qrcodeId) {
        navigate(`/qr/${businessId}/${qrcodeId}`);
      } else {
        const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
        if (storedQrContext.businessId && storedQrContext.qrcodeId) {
          navigate(`/qr/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`);
        } else {
          navigate(-1);
        }
      }
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      {/* Header */}
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

      <div className="w-full max-w-md mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-blue-600 text-xl font-medium mb-2">Join ScanReview</h1>
          <p className="text-gray-600 text-sm">Sign in to track your feedback history</p>
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
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm cursor-pointer font-medium transition-colors mt-6 flex items-center justify-center ${
              activeTab === 'signin'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                Processing...
              </>
            ) : activeTab === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            {activeTab === 'signin' ? (
              <p className="text-gray-500 text-xs">Demo: Use any email and password to continue</p>
            ) : (
              <p className="text-gray-500 text-xs">By signing up, you agree to our Terms and Privacy Policy</p>
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