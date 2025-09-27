import { useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";
import  { ToastContainer } from 'react-toastify';
import "./Homepage.css";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const Homepage = () => {
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for active feature tab
  const [activeFeature, setActiveFeature] = useState('feature-qr');

  // State for chart data
  const [chartPeriod, setChartPeriod] = useState('weekly');

  // Mock data for chart
  const mockData = {
    weekly: {
      labels: ['Slow Service', 'Great Atmosphere', 'Product Quality', 'Cleanliness', 'Price', 'Staff Friendliness'],
      data: [12, 19, 8, 15, 5, 22],
    },
    monthly: {
      labels: ['Slow Service', 'Great Atmosphere', 'Product Quality', 'Cleanliness', 'Price', 'Staff Friendliness'],
      data: [45, 80, 35, 62, 25, 95],
    },
    quarterly: {
      labels: ['Slow Service', 'Great Atmosphere', 'Product Quality', 'Cleanliness', 'Price', 'Staff Friendliness'],
      data: [130, 250, 110, 190, 80, 310],
    },
  };

  // Chart data configuration
  const chartData = {
    labels: mockData[chartPeriod].labels,
    datasets: [
      {
        label: '# of Mentions',
        data: mockData[chartPeriod].data,
        backgroundColor: 'rgba(14, 95, 216, 0.6)',
        borderColor: 'rgba(14, 95, 216, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(200, 200, 200, 0.2)' },
      },
      x: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 6,
      },
    },
  };

  // Handle feature tab click
  const handleFeatureTabClick = (featureId) => {
    setActiveFeature(featureId);
  };

  // Handle chart filter click
  const handleChartFilterClick = (period) => {
    setChartPeriod(period);
  };

  // Handle mobile menu toggle and close on nav link click
  const handleNavLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="font-inter bg-stone-50 text-black scroll-smooth scroll"> 
      <ToastContainer position="top-right" />
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link className="text-xl lg:text-2xl font-bold text-blue-700">ScanRevuAI</Link>
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/demoBooking"
              className="px-4 py-2 rounded-md cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={handleNavLinkClick}
            >
              Book Demo
            </Link>
          </div>
          <button
            className="md:hidden p-2 rounded-md text-black hover:bg-blue-100 cursor-pointer focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>
        <div className={`md:hidden px-4 pt-2 pb-4 space-y-2 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <Link
            to="/demoBooking"
            className="block px-4 py-2 rounded-md bg-blue-600 cursor-pointer text-white hover:bg-blue-700 transition-colors"
            onClick={handleNavLinkClick}
          >
            Book Demo
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg text-white text-center py-16 md:py-24 px-6 h-[90vh] flex items-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl max-w-5xl mx-auto font-bold tracking-tight mb-4">
            Nigeria’s #1 AI-Powered Feedback Intelligence Platform for Hotels & Restaurants. 
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-6 font-bold">
            Turn thousands of customer reviews into clear action plans that boost your ratings and increase revenue.
          </p>
          <p className="max-w-xl mx-auto text-md md:text-lg mb-10 font-bold">
            Stop drowning in reviews. Start growing from them!
          </p>
          <Link
            to="/demoBooking"
            className="max-w-fit px-6 py-3 bg-white text-blue-700 cursor-pointer rounded-lg hover:bg-blue-200 transition-all font-semibold"
          >
            Book Your FREE Demo Today
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="container mx-auto px-6 py-16 md:py-32 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black">The Challenge Nigerian Hospitality Businesses Face</h2>
          <p className="max-w-2xl mx-auto mt-4 text-black">
            Are you spending hours reading customer reviews without knowing what to fix?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Scattered Feedback</h3>
            <p className="text-black">Feedback across multiple platforms you can't control.</p>
          </div>
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Delayed Responses</h3>
            <p className="text-black">Finding out about problems too late.</p>
          </div>
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Reactive Approach</h3>
              <p className="text-black">Only hearing complaints after customers leave unhappy.</p>
            </div>
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">No Direct Channel</h3>
              <p className="text-black">Customers leave without telling you what went wrong.</p>
            </div>
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">No Real-Time Insights</h3>
            <p className="text-black">Missing insights while customers are still in your business.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="bg-blue-50 py-16 md:py-32 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">How ScanRevuAI Solves This</h2>
          <p className="max-w-2xl mx-auto text-black mb-10">
            ScanRevuAI captures customer feedback instantly and tells you exactly what guests loved, the top issues, and specific actions to improve service quality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2 text-blue-700">What Guests Loved</h3>
              <p className="text-black">Highlights the best aspects of their experience.</p>
            </div>
            <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Top Issues</h3>
              <p className="text-black">Identifies key areas affecting satisfaction.</p>
            </div>
            <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Actionable Steps</h3>
              <p className="text-black">Provides specific improvements to enhance service.</p>
            </div>
            <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Real-Time Alerts</h3>
              <p className="text-black">Notifies you instantly of problems needing attention.</p>
            </div>
          </div>
          <div className="mt-24">
            <h3 className="text-2xl font-bold text-black mb-4">Simple 3-Step Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">1</div>
                <h4 className="text-lg font-semibold">Generate</h4>
                <p className="text-black">Get your unique QR code to display in your business.</p>
              </div>
              <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center" style={{ animationDelay: '0.1s' }}>
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">2</div>
                <h4 className="text-lg font-semibold">Collect</h4>
                <p className="text-black">Customers scan and leave instant feedback.</p>
              </div>
              <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center" style={{ animationDelay: '0.2s' }}>
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">3</div>
                <h4 className="text-lg font-semibold">Analyze</h4>
                <p className="text-black">AI processes reviews for clear insights & recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16 md:py-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black">What Powers ScanRevuAI</h2>
          <p className="max-w-2xl mx-auto mt-4 text-black">
            Discover the key features that make ScanRevuAI simple, smart, and effective — from QR code feedback collection to analytics that drive improvement.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${activeFeature === 'feature-qr' ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                  onClick={() => handleFeatureTabClick('feature-qr')}
                >
                  Unique QR Codes
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${activeFeature === 'feature-dashboard' ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                  onClick={() => handleFeatureTabClick('feature-dashboard')}
                >
                  Analytics Dashboard
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${activeFeature === 'feature-loyalty' ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                  onClick={() => handleFeatureTabClick('feature-loyalty')}
                >
                  Loyalty Programs
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${activeFeature === 'feature-interface' ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                  onClick={() => handleFeatureTabClick('feature-interface')}
                >
                  User Feedback Interface
                </button>
              </li>
            </ul>
          </div>
          <div className="md:w-2/3 bg-white p-8 rounded-lg shadow-lg min-h-[300px]">
            <div className={activeFeature === 'feature-qr' ? 'block' : 'hidden'}>
              <h3 className="text-2xl font-bold mb-4">QR Code Generation & Deployment</h3>
              <p className="text-black space-y-3">
                <span><strong>Business-Specific Codes:</strong> Generate codes for your physical locations to gather general feedback.</span><br /><br />
                <span><strong>Product-Specific Codes:</strong> Attach QR codes to individual products for granular reviews and performance tracking.</span><br /><br />
                <span><strong>Customizable:</strong> Add your branding for a seamless customer experience.</span>
              </p>
            </div>
            <div className={activeFeature === 'feature-dashboard' ? 'block' : 'hidden'}>
              <h3 className="text-2xl font-bold mb-4">Comprehensive Business Dashboard</h3>
              <p className="text-black space-y-3">
                <span><strong>Centralized View:</strong> See all feedback in one secure place.</span><br /><br />
                <span><strong>Automated Summaries:</strong> AI-powered reports highlight key themes, common complaints, and praises.</span><br /><br />
                <span><strong>Frequency Prioritization:</strong> Automatically identify and flag the most frequent feedback points.</span><br /><br />
                <span><strong>Multimedia Reports:</strong> Generate audio/video summaries for quick updates.</span>
              </p>
            </div>
            <div className={activeFeature === 'feature-loyalty' ? 'block' : 'hidden'}>
              <h3 className="text-2xl font-bold mb-4">Loyalty Program Integration</h3>
              <p className="text-black space-y-3">
                <span><strong>Track Engagement:</strong> Monitor feedback from registered users.</span><br /><br />
                <span><strong>Incentivize Feedback:</strong> Reward engaged customers with bonuses and offers.</span><br /><br />
                <span><strong>Build Community:</strong> Turn customers into loyal advocates.</span>
              </p>
            </div>
            <div className={activeFeature === 'feature-interface' ? 'block' : 'hidden'}>
              <h3 className="text-2xl font-bold mb-4">Intuitive User Feedback Interface</h3>
              <p className="text-black space-y-3">
                <span><strong>Instant & App-less:</strong> A mobile-optimized web page for feedback.</span><br /><br />
                <span><strong>Multi-Format Feedback:</strong> Submit text, ratings, images, and videos.</span><br /><br />
                <span><strong>Anonymity & Accounts:</strong> Choose anonymity or account-based submission.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Demo Section */}
      <section id="dashboard-demo" className="py-16 md:py-32 bg-white p-6 md:p-10 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black">Interactive Dashboard Demo</h2>
          <p className="max-w-3xl mx-auto mt-4 text-black">
            This simulation shows how ScanRevuAI categorizes and quantifies feedback. Use filters to explore trends over time.
          </p>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              className={`px-4 py-2 text-sm cursor-pointer font-medium ${chartPeriod === 'weekly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} border border-blue-700 rounded-l-lg hover:bg-blue-700 hover:text-blue-500`}
              onClick={() => handleChartFilterClick('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-4 py-2 text-sm cursor-pointer font-medium ${chartPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} border-t border-b border-blue-700 hover:bg-blue-50 hover:text-blue-500`}
              onClick={() => handleChartFilterClick('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm cursor-pointer font-medium ${chartPeriod === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} border border-blue-700 rounded-r-md hover:bg-blue-50 hover:text-blue-500`}
              onClick={() => handleChartFilterClick('quarterly')}
            >
              Quarterly
            </button>
          </div>
        </div>
        <div className="relative w-full max-w-[800px] mx-auto h-[300px] md:h-[400px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto flex flex-col items-center justify-center px-6 py-16 md:py-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black">What You Get</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Instant Feedback!</h3>
            <p className="text-black">Get insights while customers are still in your business.</p>
          </div>
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg        transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Actionable Insights!</h3>
            <p className="text-black">AI guides you on improvements and strengths.</p>
          </div>
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Real-Time Alerts!</h3>
            <p className="text-black">Know immediately when issues arise.</p>
          </div>
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Direct Channel!</h3>
              <p className="text-black">Easy feedback collection from customers.</p>
            </div>
          <div className="card animate-fade-in text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40 w-80" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Prevent Lost Customers!</h3>
            <p className="text-black">Address problems before bad reviews.</p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="social-proof" className="bg-blue-50 py-16 md:py-32 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">Why Nigerian Hospitality Businesses Choose ScanRevuAI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-black italic mb-4">"ScanRevuAI gave us a direct line to our customers. We now catch issues immediately and fix them before they become bigger problems."</p>
              <p className="font-semibold text-blue-700">— Hotel Manager, Lagos</p>
            </div>
            <div className="card animate-fade-in bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
              <p className="text-black italic mb-4">"Our guests love how easy it is to share feedback. We've improved our service quality dramatically since we can address concerns in real-time."</p>
              <p className="font-semibold text-blue-700">— Restaurant Owner, Abuja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000C2D] text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">ScanRevuAI</h3>
              <p className="text-sm">Nigeria’s #1 AI-Powered Feedback Intelligence Platform for Hotels & Restaurants..</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm hover:text-blue-300 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm hover:text-blue-300 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@scanrevuai.com
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +234 707 296 7842
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +234 916 130 5561
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  3rd Floor, 7 Factory Road, Aba, Abia State, Nigeria
                </li>
              </ul>
            </div>

            {/* Social Icons */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {/* <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a> */}
                <a href="https://x.com/Revu_Ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                  <FaXTwitter className="w-6 h-6" />
                </a>
                {/* <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a> */}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
            &copy; 2025 ScanRevuAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;