import { Lock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (field, value) => {
    setError('');
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!token) {
      setError('Invalid or missing reset token');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/user-reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      toast.success(data.message || 'Password reset successfully! Please sign in.');
      navigate('/userAuth');
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/userAuth');
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
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-blue-600 text-xl font-medium mb-2">Reset Your Password</h1>
          <p className="text-gray-600 text-sm">Enter your new password for your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                placeholder="New password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-medium transition-colors mt-6 flex items-center justify-center ${
              loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
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
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;