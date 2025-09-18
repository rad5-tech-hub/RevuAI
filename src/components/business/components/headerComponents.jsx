import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { QrCode, Settings, Menu, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const BusinessHeader = ({ onLogout, isLoggingOut = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // New state for logout confirmation modal
  const [isLoggingOutInternal, setIsLoggingOutInternal] = useState(false);
  const [businessName, setBusinessName] = useState(null);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const navigationItems = [
    { path: '/businessDashboard', label: '📊 Dashboard', icon: '📊' },
    { path: '/businessFeedback', label: '💬 Feedback', icon: '💬' },
    { path: '/businessQrpage', label: '📱 QR Codes', icon: '📱' },
    { path: '/businessReports', label: '📈 Ai Reports', icon: '📈' },
  ];

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      setIsLoadingData(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No auth token found');
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/business/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinessName(response.data.profile?.business_name || 'Business Name');
        setBusinessLogo(response.data.profile?.business_logo || null);
      } catch (err) {
        console.error('Failed to fetch business data:', err);
        setError(err.response?.data?.message || 'Failed to load business details');
        setBusinessName('Business Name');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchBusinessData();
  }, []);

  // Handle logo upload
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setIsLogoDropdownOpen(false);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
      const formData = new FormData();
      formData.append('business_logo', file);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/business/business-logo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setBusinessLogo(response.data.data?.business_logo || null);
    } catch (err) {
      console.error('Failed to upload logo:', err);
      setError(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setIsUploading(false);
      fileInputRef.current.value = null;
    }
  };

  const isActive = (path) => location.pathname === path;

  const getNavLinkClasses = (path) => {
    const baseClasses = 'px-3 py-2 text-sm font-medium rounded-md transition-colors block w-full text-left';
    return isActive(path)
      ? `${baseClasses} bg-blue-100 text-blue-700 border-l-4 border-blue-600 lg:border-l-0 lg:border-b-2`
      : `${baseClasses} text-gray-500 hover:text-gray-700 hover:bg-gray-50`;
  };

  const handleLogout = async () => {
    setIsLogoutModalOpen(true); // Show confirmation modal
  };

  const confirmLogout = async () => {
    setIsLoggingOutInternal(true);
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
    setIsLogoDropdownOpen(false);
    setIsLogoutModalOpen(false);
    try {
      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOutInternal(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSettingsOpen(false);
    setIsLogoDropdownOpen(false);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsMobileMenuOpen(false);
    setIsLogoDropdownOpen(false);
  };

  const toggleLogoDropdown = () => {
    setIsLogoDropdownOpen(!isLogoDropdownOpen);
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
    setIsLogoDropdownOpen(false);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
    setIsLogoDropdownOpen(false);
  }, [location.pathname]);

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-300 border-t-red-600"></div>
  );

  const LogoFallback = () => (
    <div className="w-10 h-10 text-white bg-blue-500 rounded-full flex items-center justify-center">
      <span className="text-xl font-bold">
        {businessName ? businessName.charAt(0).toUpperCase() : 'B'}
      </span>
    </div>
  );

  return (
    <>
      {/* Full-screen loader during logout */}
      {isLoggingOutInternal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 flex flex-col items-center space-y-4 max-w-sm w-full">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <Loader2 className="w-20 h-20 text-blue-500 animate-spin absolute -top-2 -left-2" />
            </div>
            <p className="text-lg font-medium text-gray-900">Logging out...</p>
          </div>
        </div>
      )}
      {/* Logout confirmation modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative pointer-events-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsLogoutModalOpen(false)}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Logout</h3>
              <p className="text-base text-gray-600 mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-300"
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {(isMobileMenuOpen || isSettingsOpen || isLogoDropdownOpen || isModalOpen) && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-gray-900 bg-opacity-50 backdrop-blur-sm pointer-events-auto"
          onClick={() => {
            closeMobileMenu();
            setIsModalOpen(false);
          }}
        />
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex justify-center">
              {businessLogo ? (
                <img
                  src={businessLogo}
                  alt={`${businessName || 'Business'} Logo`}
                  className="w-64 h-64 object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="w-64 h-64 bg-blue-600 rounded-lg flex items-center justify-center text-white text-6xl font-bold">
                  {businessName ? businessName.charAt(0).toUpperCase() : 'B'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <div className="relative">
                <button
                  onClick={toggleLogoDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="Logo options"
                  disabled={isLoadingData || isUploading}
                >
                  {isLoadingData || isUploading ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      {businessLogo ? (
                        <img
                          src={businessLogo}
                          alt={`${businessName || 'Business'} Logo`}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-10 h-10 text-white rounded-full flex items-center justify-center"
                        style={{ display: businessLogo ? 'none' : 'flex' }}
                      >
                        <LogoFallback />
                      </div>
                    </>
                  )}
                </button>
                {isLogoDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsLogoDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      View Profile Image
                    </button>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Update Profile Picture
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>
                )}
              </div>
              <Link to="/businessDashboard" className="flex flex-col">
                <span className="text-xl font-bold text-black">
                  {isLoadingData ? 'Loading...' : (businessName || 'Business Name')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-500">Business Portal</span>
              </Link>
            </div>
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClasses(item.path).replace('block w-full text-left', 'inline-block')}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <div className="relative">
                <button
                  onClick={toggleSettingsMenu}
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      to="/businessProfile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut || isLoggingOutInternal}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut || isLoggingOutInternal ? <LoadingSpinner /> : null}
                      {isLoggingOut || isLoggingOutInternal ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            </nav>
            <div className="lg:hidden flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={toggleSettingsMenu}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="h-6 w-6" />
                </button>
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      to="/businessProfile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut || isLoggingOutInternal}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut || isLoggingOutInternal ? <LoadingSpinner /> : null}
                      {isLoggingOut || isLoggingOutInternal ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors z-60 relative"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div
            className={`lg:hidden transition-all duration-200 ease-in-out z-50 relative ${
              isMobileMenuOpen
                ? 'max-h-screen opacity-100 pb-4'
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-lg mt-2 border border-gray-200">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClasses(item.path)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/businessProfile"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md block w-full text-left"
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut || isLoggingOutInternal}
                className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut || isLoggingOutInternal ? <LoadingSpinner /> : null}
                {isLoggingOut || isLoggingOutInternal ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm font-medium z-50">
          {error}
        </div>
      )}
    </>
  );
};

export default BusinessHeader;