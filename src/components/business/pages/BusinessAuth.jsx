import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { QrCode, BarChart3, Users, Star, Mail, Lock, FileText, Building, User, Phone, Loader2, Tag } from 'lucide-react';

const BusinessAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || '';

  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const businessId = localStorage.getItem('authBusinessId');
      if (token && businessId) {
        try {
          await axios.get(`${BASE_URL}/api/v1/business/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          navigate('/businessDashboard');
        } catch (err) {
          console.error('Auth check failed:', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
          });
          // Do not clear authToken or authBusinessId; user remains logged in
          navigate('/businessAuth');
          setError('Unable to verify session. Please try again or log out.');
        }
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/category/all-category`);
        setCategories(Array.isArray(response.data?.categories) ? response.data.categories : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again later.');
        setCategories([]);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate phone number (basic check)
  const isValidPhone = (phone) => {
    return /^\+?[\d\s-]{8,15}$/.test(phone);
  };

  // Handle business registration
  const handleSignUp = async () => {
    if (!businessName.trim() || !ownerName.trim() || !email || !phoneNumber || !address.trim() || !categoryId || !password) {
      setError('All fields are required.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (!isValidPhone(phoneNumber)) {
      setError('Invalid phone number format.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/business/register-business`, {
        business_name: businessName.trim(),
        owner_name: ownerName.trim(),
        email: email.trim(),
        phone: phoneNumber.trim(),
        address: address.trim(),
        categoryId,
        password,
      });
      if (response.data?.message) {
        setSuccess('Registration successful! Please verify your email before signing in.');
        setIsVerificationPending(true);
        setBusinessName('');
        setOwnerName('');
        setPhoneNumber('');
        setAddress('');
        setCategoryId('');
        setEmail('');
        setPassword('');
      } else {
        setError('Registration succeeded, but unexpected response format.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle business login
  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/business/login-business`, {
        email: email.trim(),
        password,
      });
      const token = response.data?.data?.accessToken || response.data?.accessToken;
      const businessId = response.data?.business?.id || response.data?.data?.businessId;
      if (token && businessId) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authBusinessId', businessId);
        setSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/businessDashboard'), 1000);
      } else {
        setError('Login succeeded, but no token or business ID received.');
      }
    } catch (err) {
      console.error('Login error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/business/forgot-password`, {
        email: email.trim(),
      });
      if (response.data?.message) {
        setSuccess('Password reset link sent to your email.');
        setEmail('');
      } else {
        setError('Request succeeded, but unexpected response format.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Password reset request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification acknowledgment
  const handleVerificationAcknowledged = () => {
    setIsVerificationPending(false);
    setIsSignUp(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ScanRevuAi</h1>
                <p className="text-sm text-gray-600">Business Portal</p>
              </div>
            </div>
            <div>
              <Link to="/userAuth" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In as User
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                For Businesses
              </span>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Transform Customer Feedback into Business Growth
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get actionable insights from your customers with our comprehensive feedback management platform.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">QR Code Generation</h3>
                  <p className="text-gray-600">Create custom QR codes for your business and products</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Advanced Analytics</h3>
                  <p className="text-gray-600">Real-time insights and feedback trends</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Customer Insights</h3>
                  <p className="text-gray-600">Understand your customers better with detailed feedback</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Reputation Management</h3>
                  <p className="text-gray-600">Monitor and improve your business reputation</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">500K+</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                      {isForgotPassword ? (
                        <Mail className="w-8 h-8 text-white" />
                      ) : (
                        <FileText className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
                      {isVerificationPending ? 'Verify Your Email' : isForgotPassword ? 'Reset Your Password' : isSignUp ? 'Join ScanRevuAi' : 'Access Your Dashboard'}
                    </h3>
                    <p className="text-gray-600">
                      {isVerificationPending
                        ? 'A verification link has been sent to your email. Please verify your email to continue.'
                        : isForgotPassword
                        ? 'Enter your email to receive a password reset link'
                        : isSignUp
                        ? 'Create your business account to start managing feedback'
                        : 'Sign in to manage your customer feedback'}
                    </p>
                  </div>
                </div>
                <div className="p-8">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium">
                      {success}
                    </div>
                  )}
                  {isVerificationPending ? (
                    <div className="space-y-6">
                      <button
                        type="button"
                        className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg`}
                        onClick={handleVerificationAcknowledged}
                      >
                        I Have Verified My Email
                      </button>
                    </div>
                  ) : (
                    <>
                      {!isForgotPassword && (
                        <div className="grid grid-cols-2 gap-0 mb-6 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => {
                              setIsSignUp(false);
                              setIsForgotPassword(false);
                              setIsVerificationPending(false);
                              setError('');
                              setSuccess('');
                              setEmail('');
                              setPassword('');
                            }}
                            className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                              !isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                            disabled={isLoading}
                          >
                            Sign In
                          </button>
                          <button
                            onClick={() => {
                              setIsSignUp(true);
                              setIsForgotPassword(false);
                              setIsVerificationPending(false);
                              setError('');
                              setSuccess('');
                              setEmail('');
                              setPassword('');
                            }}
                            className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                              isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                            disabled={isLoading}
                          >
                            Get Started
                          </button>
                        </div>
                      )}
                      <div className="space-y-6">
                        {isForgotPassword ? (
                          <>
                            <div className="relative">
                              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="email"
                                placeholder="Business email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <button
                              type="button"
                              className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={handleForgotPassword}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                                  Processing...
                                </>
                              ) : (
                                'Send Reset Link'
                              )}
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-4">
                              <button
                                onClick={() => {
                                  setIsForgotPassword(false);
                                  setIsVerificationPending(false);
                                  setError('');
                                  setSuccess('');
                                  setEmail('');
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                                disabled={isLoading}
                              >
                                Back to Sign In
                              </button>
                            </p>
                          </>
                        ) : isSignUp ? (
                          <>
                            {isCategoriesLoading ? (
                              <div className="text-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                                <p className="text-sm text-gray-600 mt-2">Loading categories...</p>
                              </div>
                            ) : categories.length === 0 ? (
                              <div className="text-center py-4 text-red-600 text-sm">
                                No categories available. Please try again later.
                              </div>
                            ) : null}
                            <div className="relative">
                              <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Business name"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Owner name"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors appearance-none"
                                disabled={isLoading || categories.length === 0}
                              >
                                <option value="" disabled>
                                  Select category
                                </option>
                                {categories.map((cat) => (
                                  <option key={cat.id || cat.name} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="relative">
                              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="email"
                                placeholder="Business email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="tel"
                                placeholder="Phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Business address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="password"
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <button
                              type="button"
                              className={`w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg ${
                                isLoading || categories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={handleSignUp}
                              disabled={isLoading || categories.length === 0}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                                  Processing...
                                </>
                              ) : (
                                'Start Free Trial'
                              )}
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-4">
                              14-day free trial • No credit card required
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="relative">
                              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="email"
                                placeholder="Business email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                            <button
                              type="button"
                              className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={handleSignIn}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                                  Processing...
                                </>
                              ) : (
                                'Access Dashboard'
                              )}
                            </button>
                            <div className="text-center text-sm text-gray-500 mt-4">
                              <button
                                onClick={() => {
                                  setIsForgotPassword(true);
                                  setIsVerificationPending(false);
                                  setError('');
                                  setSuccess('');
                                  setEmail('');
                                  setPassword('');
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold mt-2"
                                disabled={isLoading}
                              >
                                Forgot Password?
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessAuth;