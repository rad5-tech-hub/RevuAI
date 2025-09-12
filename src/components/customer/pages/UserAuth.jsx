import { User, Mail, Lock, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '/Social Media Icon.png'; // Adjust path if logo is elsewhere

const UserAuth = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
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

  // Auto-login check
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const validateToken = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/v1/user/validate-token`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          });

          const data = await response.json();

          if (response.ok && data.valid) {
            // Ensure userData exists
            let userData = localStorage.getItem('userData');
            if (!userData) {
              userData = JSON.stringify({ fullname: data.user?.fullname || 'User', email: data.user?.email || '' });
              localStorage.setItem('userData', userData);
            }
            // Navigate to userAccount with QR context
            navigate('/userAccount', { state: { businessId, qrcodeId } });
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      };
      validateToken();
    }
  }, [navigate, businessId, qrcodeId]);

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

        const userData = {
          fullname: data.fullname || formData.email,
          email: formData.email,
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        navigate('/userAccount', { state: { businessId, qrcodeId } });
      } else {
        setActiveTab('signin');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
    const hasQrContext = (businessId && qrcodeId) || (storedQrContext.businessId && storedQrContext.qrcodeId);

    if (hasQrContext) {
      localStorage.removeItem('userData');
      if (businessId && qrcodeId) {
        navigate(`/feedbackForm/${businessId}/${qrcodeId}`);
      } else {
        navigate(`/feedbackForm/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`);
      }
    } else {
      navigate('/businessAuth');
    }
  };

  const handleBack = () => {
    const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
    const hasQrContext = (businessId && qrcodeId) || (storedQrContext.businessId && storedQrContext.qrcodeId);

    if (hasQrContext) {
      if (businessId && qrcodeId) {
        navigate(`/qr/${businessId}/${qrcodeId}`);
      } else {
        navigate(`/qr/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`);
      }
    } else {
      navigate('/');
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      setForgotError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError('Please enter a valid email address');
      return;
    }

    setForgotLoading(true);
    setForgotError('');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/user-forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send password reset email');
      }

      toast.success(data.message || 'Password reset email sent!');
      setIsForgotPasswordOpen(false);
      setForgotEmail('');
    } catch (error) {
      setForgotError(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsForgotPasswordOpen(false);
    setForgotEmail('');
    setForgotError('');
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
          <h1 className="text-blue-600 text-xl font-medium mb-2">Join ScanRevuAI</h1>
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
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2 px-4 text-sm font-medium cursor-pointer rounded-r-lg transition-colors ${
                activeTab === 'signup'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-100'
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

            {activeTab === 'signin' && (
              <div className="text-right">
                <button
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-blue-600 text-xs hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}
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

        {/* Continue as Business */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-black text-sm hover:text-blue-800 rounded-sm hover:bg-blue-100 px-2 py-3 cursor-pointer transition-colors"
          >
            Continue as Business
          </button>
        </div>

        {/* Forgot Password Modal */}
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Reset Password</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {forgotError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{forgotError}</p>
                </div>
              )}

              <div className="relative mb-4">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotError('');
                    setForgotEmail(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <button
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className={`w-full py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center justify-center ${
                  forgotLoading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {forgotLoading ? (
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuth;