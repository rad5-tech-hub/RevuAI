import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, User, Mail, Phone, MapPin, Tag } from 'lucide-react';
import BusinessHeader from '../components/headerComponents';

const BusinessProfile = () => {
  const [businessData, setBusinessData] = useState({
    business_name: '',
    owner_name: '',
    email: '',
    phone: '',
    address: '',
    categoryId: '',
    business_logo: null,
  });
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch business data and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No auth token found');
        }
        const businessResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/business-dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { business_name, owner_name, email, phone, address, categoryId, business_logo } =
          businessResponse.data;
        setBusinessData({
          business_name: business_name || 'N/A',
          owner_name: owner_name || 'N/A',
          email: email || 'N/A',
          phone: phone || 'N/A',
          address: address || 'N/A',
          categoryId: categoryId || '',
          business_logo: business_logo || null,
        });
        if (categoryId) {
          const categoriesResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/category/all-category`
          );
          const category = categoriesResponse.data.categories?.find(cat => cat.id === categoryId);
          setCategoryName(category?.name || 'N/A');
        } else {
          setCategoryName('N/A');
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load business profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (token && refreshToken) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/logout/logout`,
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
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                  <p className="text-base text-gray-700">{categoryName}</p>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-gray-100">
              <Link
                to="/businessProfile/edit"
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusinessProfile;