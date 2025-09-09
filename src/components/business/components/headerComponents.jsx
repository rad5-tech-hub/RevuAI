import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, LogOut, Menu, X } from 'lucide-react';

const BusinessHeader = ({ onLogout, isLoggingOut = false }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOutInternal, setIsLoggingOutInternal] = useState(false);
  
  const navigationItems = [
    {
      path: '/businessDashboard',
      label: '📊 Dashboard',
      icon: '📊'
    },
    {
      path: '/businessFeedback',
      label: '💬 Feedback',
      icon: '💬'
    },
    {
      path: '/businessQrpage',
      label: '📱 QR Codes',
      icon: '📱'
    },
    {
      path: '/businessReports',
      label: '📈 Reports',
      icon: '📈'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavLinkClasses = (path) => {
    const baseClasses = "px-3 py-2 text-sm font-medium rounded-md transition-colors block w-full text-left";
    
    if (isActive(path)) {
      return `${baseClasses} bg-blue-100 text-blue-700 border-l-4 border-blue-600 lg:border-l-0 lg:border-b-2`;
    }
    
    return `${baseClasses} text-gray-500 hover:text-gray-700 hover:bg-gray-50`;
  };

  const handleLogout = async () => {
    setIsLoggingOutInternal(true);
    setIsMobileMenuOpen(false);
    
    // Add a small delay for better UX
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
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-300 border-t-red-600"></div>
  );

  const currentlyLoggingOut = isLoggingOut || isLoggingOutInternal;

 return (
  <>
    {/* Mobile menu overlay */}
    {isMobileMenuOpen && (
      <div
        className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25 pointer-events-auto"
        onClick={closeMobileMenu}
      />
    )}

    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/businessDashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 text-white bg-blue-500 rounded-full flex items-center justify-center">
                <img src='/Social Media Icon.png' className="w-10 h-10 text-white rounded-full " />
              </div>
              <span className="text-xl font-bold text-black">RevuAI</span>
            </Link>
            <span className="text-gray-500 hidden sm:block">Business Portal</span>
          </div>
          {/* Desktop Navigation */}
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
            <button
              onClick={handleLogout}
              disabled={currentlyLoggingOut}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Logout"
            >
              {currentlyLoggingOut ? <LoadingSpinner /> : <LogOut className="w-4 h-4" />}
              {currentlyLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </nav>
          {/* Mobile menu button */}
          <div className="lg:hidden">
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
        {/* Mobile Navigation Menu */}
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
            <button
              onClick={handleLogout}
              disabled={currentlyLoggingOut}
              className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentlyLoggingOut ? <LoadingSpinner /> : <LogOut className="w-4 h-4" />}
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