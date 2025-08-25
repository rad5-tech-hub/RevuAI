import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QrCode, BarChart3, Users, Star, Mail, Lock, FileText, Building, User, Phone } from 'lucide-react';

const BusinessAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleSignUp = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/business/register-business`, {
        business_name: businessName,
        owner_name: ownerName,
        email,
        phone: phoneNumber,
        address,
        password
      });

      if (response.data.message) {
        setSuccess('Registration successful! Please sign in to continue.');
        setIsSignUp(false);
        setBusinessName('');
        setOwnerName('');
        setPhoneNumber('');
        setAddress('');
        setEmail('');
        setPassword('');
      } else {
        setError('Registration succeeded, but unexpected response format.');
      }
    } catch (err) {
      setError(err.response?.data?.message || `Registration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/business/login-business`, {
        email,
        password
      });

      const token = response.data.data?.token || response.data.token;
      if (token) {
        localStorage.setItem('authToken', token);
        setSuccess('Login successful! Redirecting to dashboard...');
        navigate('/businessDashboard');
      } else {
        setError('Login succeeded, but no token received.');
      }
    } catch (err) {
      setError(err.response?.data?.message || `Login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/business/forgot-password`, {
        email
      });

      if (response.data.message) {
        setSuccess('Password reset link sent');
        setEmail('');
      } else {
        setError('Request succeeded, but unexpected response format.');
      }
    } catch (err) {
      setError(err.response?.data?.message || `Password reset request failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RevuAi</h1>
                <p className="text-sm text-gray-600">Business Portal</p>
              </div>
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
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
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
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isForgotPassword ? 'Reset Your Password' : 'Business Portal Access'}
                  </h3>
                  <p className="text-gray-600">
                    {isForgotPassword ? 'Enter your email to receive a password reset link' : 'Manage your customer feedback and grow your business'}
                  </p>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}
                {!isForgotPassword && (
                  <div className="grid grid-cols-2 gap-0 mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => {
                        setIsSignUp(false);
                        setError('');
                        setSuccess('');
                      }}
                      className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        !isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      disabled={isLoading}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsSignUp(true);
                        setError('');
                        setSuccess('');
                      }}
                      className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
                      <div>
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
                      </div>
                      <button
                        type="button"
                        className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleForgotPassword}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Send Reset Link'}
                      </button>
                      <p className="text-center text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setIsForgotPassword(false);
                            setError('');
                            setSuccess('');
                            setEmail('');
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:underline"
                          disabled={isLoading}
                        >
                          Back to Sign In
                        </button>
                      </p>
                    </>
                  ) : isSignUp ? (
                    <>
                      <div>
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
                      </div>
                      <div>
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
                      </div>
                      <div>
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
                      </div>
                      <div>
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
                      </div>
                      <div>
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
                      </div>
                      <div>
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
                      </div>
                      <button
                        type="button"
                        className={`w-full py-3 px-4 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSignUp}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Start Free Trial'}
                      </button>
                      <p className="text-center text-sm text-gray-500">
                        14-day free trial • No credit card required
                      </p>
                    </>
                  ) : (
                    <>
                      <div>
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
                      </div>
                      <div>
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
                      </div>
                      <button
                        type="button"
                        className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSignIn}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Access Dashboard'}
                      </button>
                      <div className="text-center text-sm text-gray-500">
                        <p>Demo: Use any email and password to continue</p>
                        <button
                          onClick={() => {
                            setIsForgotPassword(true);
                            setError('');
                            setSuccess('');
                            setEmail('');
                            setPassword('');
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:underline mt-2"
                          disabled={isLoading}
                        >
                          Forgot Password?
                        </button>
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