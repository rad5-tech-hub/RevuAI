import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, User, Mail, Phone, MapPin, Tag, Bell } from 'lucide-react';
import BusinessHeader from '../components/headerComponents';

const BusinessProfile = () => {
  const [businessData, setBusinessData] = useState({
    business_name: '',
    owner_name: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    business_logo: null,
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    receiveNotifications: false,
    emailNotifications: false,
    whatsAppNotifications: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Fetch business profile and notification preferences
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No auth token found');
        }

        // Fetch business profile
        const profileResponse = await axios.get(`${BASE_URL}/api/v1/business/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { business_name, owner_name, email, phone, address, category, business_logo } =
          profileResponse.data.profile || {};
        setBusinessData({
          business_name: business_name || 'N/A',
          owner_name: owner_name || 'N/A',
          email: email || 'N/A',
          phone: phone || 'N/A',
          address: address || 'N/A',
          category: category || 'N/A',
          business_logo: business_logo || null,
        });

        // Fetch notification preferences
        const prefsResponse = await axios.get(`${BASE_URL}/api/v1/business/notification-preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotificationPrefs({
          receiveNotifications: prefsResponse.data.receiveNotifications || false,
          emailNotifications: prefsResponse.data.emailNotifications || false,
          whatsAppNotifications: prefsResponse.data.whatsAppNotifications || false,
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.response?.data?.message || 'Failed to load business profile or preferences');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle notification preferences change
  const handlePrefsChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs((prev) => ({
      ...prev,
      [name]: checked,
      // If receiveNotifications is unchecked, disable both email and WhatsApp
      ...(name === 'receiveNotifications' && !checked
        ? { emailNotifications: false, whatsAppNotifications: false }
        : {}),
    }));
    setError('');
    setSuccess('');
  };

  // Save notification preferences
  const handleSavePrefs = async () => {
    if (!notificationPrefs.receiveNotifications && (notificationPrefs.emailNotifications || notificationPrefs.whatsAppNotifications)) {
      setError('Please enable notifications to select email or WhatsApp preferences.');
      return;
    }
    setIsSavingPrefs(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${BASE_URL}/api/v1/business/notification-preferences`,
        notificationPrefs,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Notification preferences saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save notification preferences');
    } finally {
      setIsSavingPrefs(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (token && refreshToken) {
        await axios.post(
          `${BASE_URL}/api/v1/logout/logout`,
          { refreshToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authBusinessId');
      localStorage.removeItem('qrCodeIds');
      localStorage.removeItem('qrTypeMap');
      navigate('/businessAuth');
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/businessAuth');
    }
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <BusinessHeader onLogout={handleLogout} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Business Profile</h1>
          <Link
            to="/businessDashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium">
            {success}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Business Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
              <div className="p-8 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    {businessData.business_logo ? (
                      <img
                        src={businessData.business_logo}
                        alt={`${businessData.business_name} Logo`}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200">
                        {businessData.business_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{businessData.business_name}</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your business details</p>
                  </div>
                </div>
              </div>
              <div className="p-8 grid gap-6 sm:grid-cols-2">
                <div className="flex items-start space-x-4">
                  <Building className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Business Name</p>
                    <p className="text-base text-gray-700">{businessData.business_name}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <User className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Owner Name</p>
                    <p className="text-base text-gray-700">{businessData.owner_name}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <p className="text-base text-gray-700">{businessData.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Phone Number</p>
                    <p className="text-base text-gray-700">{businessData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Address</p>
                    <p className="text-base text-gray-700">{businessData.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Tag className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Category</p>
                    <p className="text-base text-gray-700">{businessData.category}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-gray-100">
                <Link
                  to="/businessProfile/edit"
                  className="inline-flex items-center cursor-pointer px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Notification Preferences Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200">
                      <Bell className="w-10 h-10" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage how you receive updates</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Bell className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Receive Notifications</p>
                        <p className="text-sm text-gray-600">Enable to get updates about your business</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="receiveNotifications"
                        checked={notificationPrefs.receiveNotifications}
                        onChange={handlePrefsChange}
                        className="sr-only peer"
                        disabled={isSavingPrefs}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  {notificationPrefs.receiveNotifications && (
                    <div className="ml-10 space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notificationPrefs.emailNotifications}
                          onChange={handlePrefsChange}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={isSavingPrefs}
                        />
                        <label className="text-sm text-gray-700">Email Notifications</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="whatsAppNotifications"
                          checked={notificationPrefs.whatsAppNotifications}
                          onChange={handlePrefsChange}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={isSavingPrefs}
                        />
                        <label className="text-sm text-gray-700">WhatsApp Notifications</label>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <button
                    onClick={handleSavePrefs}
                    disabled={isSavingPrefs}
                    className={`inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg ${
                      isSavingPrefs ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSavingPrefs ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BusinessProfile;