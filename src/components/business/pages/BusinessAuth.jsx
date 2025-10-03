import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { QrCode, BarChart3, Users, Star, Mail, Lock, FileText, Building, User, Phone, Loader2, Tag, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const BusinessAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  
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
          setError('Unable to verify session. Please try again or log out.');
        }
      }
      setIsAuthChecking(false);
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

  // Enhanced email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('');
      setEmailValid(false);
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setEmailValid(false);
      return false;
    }
    setEmailError('');
    setEmailValid(true);
    return true;
  };

  // Enhanced phone validation (exactly 11 digits, Nigerian format)
  const validatePhone = (phone) => {
    // Remove any non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (!phone) {
      setPhoneError('');
      setPhoneValid(false);
      return false;
    }
    
    if (digitsOnly.length === 0) {
      setPhoneError('Phone number is required');
      setPhoneValid(false);
      return false;
    }
    
    if (digitsOnly.length < 11) {
      setPhoneError(`Phone number must be exactly 11 digits (${digitsOnly.length}/11)`);
      setPhoneValid(false);
      return false;
    }
    
    if (digitsOnly.length > 11) {
      setPhoneError('Phone number cannot exceed 11 digits');
      setPhoneValid(false);
      return false;
    }
    
    // Check if it starts with 0 (Nigerian format)
    if (!digitsOnly.startsWith('0')) {
      setPhoneError('Phone number should start with 0 (e.g., 08012345678)');
      setPhoneValid(false);
      return false;
    }
    
    setPhoneError('');
    setPhoneValid(true);
    return true;
  };

  // Handle email input changes
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // Handle phone input changes
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow digits, prevent non-numeric input
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 11 digits
    if (digitsOnly.length <= 11) {
      setPhoneNumber(digitsOnly);
      validatePhone(digitsOnly);
    }
  };

  // Handle business registration
  const handleSignUp = async () => {
    // Reset previous errors
    setError('');
    setSuccess('');

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phoneNumber);

    if (!businessName.trim()) {
      setError('Business name is required.');
      return;
    }
    if (!ownerName.trim()) {
      setError('Owner name is required.');
      return;
    }
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isPhoneValid) {
      setError('Please enter a valid 11-digit phone number.');
      return;
    }
    if (!address.trim()) {
      setError('Business address is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a business category.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
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
        setSuccess('Registration successful! Please check your email and verify your account before signing in.');
        setIsVerificationPending(true);
        // Clear form
        setBusinessName('');
        setOwnerName('');
        setPhoneNumber('');
        setAddress('');
        setCategoryId('');
        setEmail('');
        setPassword('');
        setEmailValid(false);
        setPhoneValid(false);
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

  // Handle business login with email verification check
  const handleSignIn = async () => {
    // Reset previous errors
    setError('');
    setSuccess('');

    const isEmailValid = validateEmail(email);
    
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/business/login-business`, {
        email: email.trim(),
        password,
      });
      
      const token = response.data?.data?.accessToken || response.data?.accessToken;
      const businessId = response.data?.business?.id || response.data?.data?.businessId;
      // const isEmailVerified = response.data?.business?.email_verified || response.data?.data?.email_verified;
      
      if (token && businessId) {
        // Check if email is verified
        // if (!isEmailVerified) {
        //   setError('Your email is not verified. Please check your email and click the verification link before signing in.');
        //   setIsVerificationPending(true);
        //   return;
        // }
        
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
      
      // Handle specific error cases
      if (err.response?.status === 403 && err.response?.data?.message?.includes('verify')) {
        setError('Your email is not verified. Please check your email and click the verification link.');
        setIsVerificationPending(true);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');

    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/business/forgot-password`, {
        email: email.trim(),
      });
      if (response.data?.message) {
        setSuccess('Password reset link sent to your email.');
        setEmail('');
        setEmailValid(false);
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

  // Handle Enter key press for form submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      if (isSignUp) {
        handleSignUp();
      } else if (!isForgotPassword && !isVerificationPending) {
        handleSignIn();
      } else if (isForgotPassword) {
        handleForgotPassword();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      {isAuthChecking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <Loader2 className="w-20 h-20 text-blue-500 animate-spin absolute -top-2 -left-2" />
            </div>
            <p className="text-lg font-medium text-gray-900">Verifying your session...</p>
          </div>
        </div>
      )}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ScanRevuAi</h1>
                <p className="text-base text-gray-600">Business Portal</p>
              </div>
            </div>
            <div>
              <Link to="/userAuth" className="text-blue-600 hover:text-blue-700 font-medium text-base">
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
              <span className="bg-orange-100 text-orange-800 text-base font-medium px-3 py-1 rounded-full">
                For Businesses
              </span>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Transform Customer Feedback into Business Growth
              </h2>
              <p className="text-2xl text-gray-600 leading-relaxed">
                Get actionable insights from your customers with our comprehensive feedback management platform.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">QR Code Generation</h3>
                  <p className="text-base text-gray-600">Create custom QR codes for your business and products</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Advanced Analytics</h3>
                  <p className="text-base text-gray-600">Real-time insights and feedback trends</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Customer Insights</h3>
                  <p className="text-base text-gray-600">Understand your customers better with detailed feedback</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Reputation Management</h3>
                  <p className="text-base text-gray-600">Monitor and improve your business reputation</p>
                </div>
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
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                      {isVerificationPending
                        ? 'Verify Your Email'
                        : isForgotPassword
                        ? 'Reset Your Password'
                        : isSignUp
                        ? 'Join ScanRevuAi'
                        : 'Access Your Dashboard'}
                    </h3>
                    <p className="text-base text-gray-600">
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
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-base font-medium">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-base font-medium">
                      {success}
                    </div>
                  )}
                  {isVerificationPending ? (
                    <div className="space-y-6">
                      <button
                        type="button"
                        className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-300 shadow-md hover:shadow-lg`}
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
                              setEmailError('');
                              setPhoneError('');
                              setEmailValid(false);
                              setPhoneValid(false);
                            }}
                            className={`py-2 px-4 rounded-md text-base font-semibold transition-colors duration-300 ${
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
                              setEmailError('');
                              setPhoneError('');
                              setEmailValid(false);
                              setPhoneValid(false);
                            }}
                            className={`py-2 px-4 rounded-md text-base font-semibold transition-colors duration-300 ${
                              isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                            disabled={isLoading}
                          >
                            Get Started
                          </button>
                        </div>
                      )}
                      <div className="space-y-6" onKeyPress={handleKeyPress}>
                        {isForgotPassword ? (
                          <>
                            <div className="space-y-2">
                              <div className="relative">
                                <Mail className={`w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                  emailError ? 'text-red-400' : emailValid ? 'text-green-400' : 'text-gray-400'
                                }`} />
                                <input
                                  type="email"
                                  placeholder="Business email"
                                  value={email}
                                  onChange={handleEmailChange}
                                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-300 text-base ${
                                    emailError ? 'border-red-300 focus:ring-red-200' : 
                                    emailValid ? 'border-green-300 focus:ring-green-200' : 
                                    'border-gray-300 focus:ring-blue-200'
                                  }`}
                                  disabled={isLoading}
                                />
                                {emailValid && (
                                  <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                                {emailError && (
                                  <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                              </div>
                              {emailError && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {emailError}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-300 shadow-md hover:shadow-lg ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={handleForgotPassword}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
                                  Processing...
                                </>
                              ) : (
                                'Send Reset Link'
                              )}
                            </button>
                            <p className="text-center text-base text-gray-500 mt-4">
                              <button
                                onClick={() => {
                                  setIsForgotPassword(false);
                                  setIsVerificationPending(false);
                                  setError('');
                                  setSuccess('');
                                  setEmail('');
                                  setEmailError('');
                                  setEmailValid(false);
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
                                <p className="text-base text-gray-600 mt-2">Loading categories...</p>
                              </div>
                            ) : categories.length === 0 ? (
                              <div className="text-center py-4 text-red-600 text-base">
                                No categories available. Please try again later.
                              </div>
                            ) : null}
                            <div className="relative">
                              <Building className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Business name"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-300 text-base"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <User className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Owner name"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-300 text-base"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <Tag className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-300 appearance-none text-base"
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
                            <div className="space-y-2">
                              <div className="relative">
                                <Mail className={`w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                  emailError ? 'text-red-400' : emailValid ? 'text-green-400' : 'text-gray-400'
                                }`} />
                                <input
                                  type="email"
                                  placeholder="Business email"
                                  value={email}
                                  onChange={handleEmailChange}
                                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-300 text-base ${
                                    emailError ? 'border-red-300 focus:ring-red-200' : 
                                    emailValid ? 'border-green-300 focus:ring-green-200' : 
                                    'border-gray-300 focus:ring-blue-200'
                                  }`}
                                  disabled={isLoading}
                                />
                                {emailValid && (
                                  <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                                {emailError && (
                                  <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                              </div>
                              {emailError && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {emailError}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="relative">
                                <Phone className={`w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                  phoneError ? 'text-red-400' : phoneValid ? 'text-green-400' : 'text-gray-400'
                                }`} />
                                <input
                                  type="tel"
                                  placeholder="Phone number (11 digits)"
                                  value={phoneNumber}
                                  onChange={handlePhoneChange}
                                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-300 text-base ${
                                    phoneError ? 'border-red-300 focus:ring-red-200' : 
                                    phoneValid ? 'border-green-300 focus:ring-green-200' : 
                                    'border-gray-300 focus:ring-blue-200'
                                  }`}
                                  disabled={isLoading}
                                  maxLength="11"
                                />
                                {phoneValid && (
                                  <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                                {phoneError && (
                                  <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                              </div>
                              {phoneError && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {phoneError}
                                </p>
                              )}
                              {phoneNumber && !phoneError && (
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  Valid phone number format
                                </p>
                              )}
                            </div>
                            <div className="relative">
                              <Building className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Business address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-300 text-base"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="relative">
                              <Lock className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-300 text-base"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                              >
                                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                              </button>
                            </div>
                            <button
                              type="button"
                              className={`w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors duration-300 shadow-md hover:shadow-lg ${
                                isLoading || categories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={handleSignUp}
                              disabled={isLoading || categories.length === 0}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
                                  Processing...
                                </>
                              ) : (
                                'Start Free Trial'
                              )}
                            </button>
                            <p className="text-center text-base text-gray-500 mt-4">
                              30-day free trial • No credit card required
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <div className="relative">
                                <Mail className={`w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                  emailError ? 'text-red-400' : emailValid ? 'text-green-400' : 'text-gray-400'
                                }`} />
                                <input
                                  type="email"
                                  placeholder="Business email"
                                  value={email}
                                  onChange={handleEmailChange}
                                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-300 text-base ${
                                    emailError ? 'border-red-300 focus:ring-red-200' : 
                                    emailValid ? 'border-green-300 focus:ring-green-200' : 
                                    'border-gray-300 focus:ring-blue-200'
                                  }`}
                                  disabled={isLoading}
                                />
                                {emailValid && (
                                  <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                                {emailError && (
                                  <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                              </div>
                              {emailError && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {emailError}
                                </p>
                              )}
                            </div>
                            <div className="relative">
                              <Lock className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-300 text-base"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                              >
                                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                              </button>
                            </div>
                            <button
                              type="button"
                              className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-300 shadow-md hover:shadow-lg ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={handleSignIn}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
                                  Processing...
                                </>
                              ) : (
                                'Access Dashboard'
                              )}
                            </button>
                            <div className="text-center text-base text-gray-500 mt-4">
                              <button
                                onClick={() => {
                                  setIsForgotPassword(true);
                                  setIsVerificationPending(false);
                                  setError('');
                                  setSuccess('');
                                  setEmail('');
                                  setPassword('');
                                  setEmailError('');
                                  setEmailValid(false);
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
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