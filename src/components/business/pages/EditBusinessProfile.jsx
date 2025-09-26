import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, User, Mail, Phone, MapPin, Tag, Image, Loader2 } from 'lucide-react';
import BusinessHeader from '../components/headerComponents';

const EditBusinessProfile = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    email: '',
    phone: '',
    address: '',
    categoryId: '',
    business_logo: null,
  });
  const [categories, setCategories] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch profile data and categories
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/businessAuth');
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch business profile
        const businessResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const profile = businessResponse.data?.profile || {};
        // Fetch categories to map category name to categoryId
        const categoriesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/category/all-category`
        );
        const fetchedCategories = categoriesResponse.data?.categories || [];
        setCategories(fetchedCategories);
        // Find categoryId based on category name
        const matchedCategory = fetchedCategories.find((cat) => cat.name === (profile.category || ''));
        const categoryId = matchedCategory ? matchedCategory.id : '';
        setFormData({
          business_name: profile.business_name || '',
          owner_name: profile.owner_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          categoryId: categoryId || '',
          business_logo: profile.business_logo || null,
        });
        setLogoPreview(profile.business_logo || null);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('authBusinessId');
          navigate('/businessAuth');
        } else {
          setError(err.response?.data?.message || 'Failed to load profile data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  // Handle logo file upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a JPEG or PNG image');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        return;
      }
      setFormData((prev) => ({ ...prev, business_logo: file }));
      setLogoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.business_name.trim()) return 'Business name is required';
    if (!formData.owner_name.trim()) return 'Owner name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return 'Valid email is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.categoryId) return 'Category is required';
    return '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
      let logoUrl = formData.business_logo;
      if (formData.business_logo instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append('business_logo', formData.business_logo);
        const logoResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/business/business-logo`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        logoUrl = logoResponse.data?.data?.business_logo || logoUrl;
      }
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/business/edit-business`,
        {
          business_name: formData.business_name.trim(),
          owner_name: formData.owner_name.trim(),
          email: formData.email,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          categoryId: formData.categoryId, // Still include categoryId in submission
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/businessProfile'), 1000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authBusinessId');
        navigate('/businessAuth');
      } else {
        setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
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
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authBusinessId');
      localStorage.removeItem('qrCodeIds');
      localStorage.removeItem('qrTypeMap');
      navigate('/businessAuth');
      setIsLoggingOut(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
  );

  // Get category name from categoryId
  const getCategoryName = () => {
    const category = categories.find((cat) => cat.id === formData.categoryId);
    return category ? category.name : 'Not set';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <BusinessHeader onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Business Profile</h1> {/* Adjusted to text-2xl */}
          <Link
            to="/businessProfile"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Business Logo Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200"
                      onError={(e) => {
                        e.target.src = '';
                        setLogoPreview(null);
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200">
                      {formData.business_name.charAt(0).toUpperCase() || 'B'}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{formData.business_name || 'Edit Your Profile'}</h2> {/* Adjusted to text-lg */}
                  <p className="text-sm text-gray-500 mt-1">Update your business details</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {categories.length === 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
                  Categories could not be loaded. Please try refreshing or contact support.
                </div>
              )}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="relative">
                  <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    placeholder="Business Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm" 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleInputChange}
                    placeholder="Owner Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm" 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Business Email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm" 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative sm:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Business Address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm" 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative">
                  <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={getCategoryName()}
                    readOnly
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed" 
                    title="Category cannot be changed"
                  />
                </div>
                <div className="relative">
                  <Image className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleLogoChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:hover:bg-blue-100 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex cursor-pointer items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <Link
                  to="/businessProfile"
                  className="inline-flex items-center cursor-pointer px-6 py-3 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditBusinessProfile;