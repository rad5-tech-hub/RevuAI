import { useState } from 'react';
import { QrCode, BarChart3, Users, Star, Mail, Lock, FileText, Building, User, Phone } from 'lucide-react';

const ScanReviewLanding = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-block">
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                For Businesses
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Transform Customer Feedback into Business Growth
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get actionable insights from your customers with our comprehensive feedback management platform.
              </p>
            </div>

            {/* Features */}
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

            {/* Stats */}
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

          {/* Right Content - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Portal Access</h3>
                  <p className="text-gray-600">Manage your customer feedback and grow your business</p>
                </div>

               {/* Toggle Buttons */}
                <div className="grid grid-cols-2 gap-0 mb-6 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      !isSignUp 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      isSignUp 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Get Started
                  </button>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {isSignUp ? (
                    /* Sign Up Form */
                    <>
                      {/* Business Name */}
                      <div>
                        <div className="relative">
                          <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Business name"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Owner Name */}
                      <div>
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Owner name"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Business Email */}
                      <div>
                        <div className="relative">
                          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="email"
                            placeholder="Business email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <div className="relative">
                          <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Create Password */}
                      <div>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="password"
                            placeholder="Create password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Start Free Trial Button */}
                      <button
                        type="button"
                        className="w-full py-3 px-4 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
                        onClick={() => console.log('Starting free trial...')}
                      >
                        Start Free Trial
                      </button>

                      {/* Trial Info */}
                      <p className="text-center text-sm text-gray-500">
                        14-day free trial • No credit card required
                      </p>
                    </>
                  ) : (
                    /* Sign In Form */
                    <>
                      {/* Email Input */}
                      <div>
                        <div className="relative">
                          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="email"
                            placeholder="Business email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Access Dashboard Button */}
                      <button
                        type="button"
                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        onClick={() => console.log('Accessing dashboard...')}
                      >
                        Access Dashboard
                      </button>

                      {/* Demo Text */}
                      <p className="text-center text-sm text-gray-500">
                        Demo: Use any email and password to continue
                      </p>
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

export default ScanReviewLanding;