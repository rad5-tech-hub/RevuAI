import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { QrCode, Settings, Menu, X } from 'lucide-react';
import axios from 'axios';

const BusinessHeader = ({ onLogout, isLoggingOut = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOutInternal, setIsLoggingOutInternal] = useState(false);
  const [businessName, setBusinessName] = useState(null);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const navigationItems = [
    { path: '/businessDashboard', label: '📊 Dashboard', icon: '📊' },
    { path: '/businessFeedback', label: '💬 Feedback', icon: '💬' },
    { path: '/businessQrpage', label: '📱 QR Codes', icon: '📱' },
    { path: '/businessReports', label: '📈 Reports', icon: '📈' },
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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/business/business-dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBusinessName(response.data.business_name);
        setBusinessLogo(response.data.business_logo || null);
      } catch (err) {
        console.error('Failed to fetch business data:', err);
        setError('Failed to load business details');
        setBusinessName('Business Name');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchBusinessData();
  }, []);

  const isActive = (path) => location.pathname === path;

  const getNavLinkClasses = (path) => {
    const baseClasses = "px-3 py-2 text-sm font-medium rounded-md transition-colors block w-full text-left";
    return isActive(path)
      ? `${baseClasses} bg-blue-100 text-blue-700 border-l-4 border-blue-600 lg:border-l-0 lg:border-b-2`
      : `${baseClasses} text-gray-500 hover:text-gray-700 hover:bg-gray-50`;
  };

  const handleLogout = async () => {
    setIsLoggingOutInternal(true);
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOutInternal(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSettingsOpen(false); // Close settings dropdown when toggling mobile menu
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsMobileMenuOpen(false); // Close mobile menu when opening settings
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
  }, [location.pathname]);

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-300 border-t-red-600"></div>
  );

  const currentlyLoggingOut = isLoggingOut || isLoggingOutInternal;

  const LogoFallback = () => (
    <div className="w-10 h-10 text-white bg-blue-500 rounded-full flex items-center justify-center">
      <span className="text-xl font-bold">
        {businessName ? businessName.charAt(0).toUpperCase() : 'B'}
      </span>
    </div>
  );

  return (
    <>
      {(isMobileMenuOpen || isSettingsOpen) && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25 pointer-events-auto"
          onClick={closeMobileMenu}
        />
      )}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <Link to="/businessDashboard" className="flex items-center space-x-2">
                {isLoadingData ? (
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
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-black">
                    {isLoadingData ? 'Loading...' : (businessName || 'Business Name')}
                  </span>
                  <span className="text-sm text-gray-500">Business Portal</span>
                </div>
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
                      disabled={currentlyLoggingOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentlyLoggingOut ? <LoadingSpinner /> : null}
                      {currentlyLoggingOut ? "Logging out..." : "Logout"}
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
                      disabled={currentlyLoggingOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentlyLoggingOut ? <LoadingSpinner /> : null}
                      {currentlyLoggingOut ? "Logging out..." : "Logout"}
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
                disabled={currentlyLoggingOut}
                className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentlyLoggingOut ? <LoadingSpinner /> : null}
                {currentlyLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default BusinessHeader;