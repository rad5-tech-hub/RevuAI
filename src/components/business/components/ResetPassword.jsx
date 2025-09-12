import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Loader2, FileText } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extract token from query parameter
  const BASE_URL = import.meta.env.SCAN_API_URL || 'https://revu-ai-sage.vercel.app';
  const API_URL = import.meta.env.VITE_API_URL;

  // Handle form submission
  const handleResetPassword = async () => {
    // Validate inputs
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    if (!password || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
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
      console.log('Sending request to:', `${API_URL}/api/v1/business/reset-password/${token}`);
      console.log('Request body:', { password, confirmPassword });

      await axios.post(`${API_URL}/api/v1/business/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      // API returns no response body on success
      setSuccess('Password reset successfully! Redirecting to sign-in...');
      setTimeout(() => navigate('/businessAuth'), 2000);
    } catch (err) {
      console.error('Password reset error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || `Password reset failed: ${err.response?.statusText || err.message}`);
    } finally {
      setIsLoading(false);
    }
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
              <Link to="/businessAuth" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Reset Your Password
                  </h3>
                  <p className="text-gray-600">
                    Enter your new password to regain access to your account
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
                <div className="space-y-6">
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="button"
                    className={`w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    <Link
                      to="/businessAuth"
                      className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                    >
                      Back to Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;