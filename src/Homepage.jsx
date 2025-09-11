import  { useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
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
    <div className="font-inter bg-stone-50 text-slate-800">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-700">ScanRevuAI</div>
          <div className="hidden md:flex items-center space-x-2">
            <a
              href="#how-it-works"
              className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
              onClick={handleNavLinkClick}
            >
              How It Works
            </a>
            <a
              href="#features"
              className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
              onClick={handleNavLinkClick}
            >
              Features
            </a>
            <a
              href="#dashboard-demo"
              className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
              onClick={handleNavLinkClick}
            >
              Dashboard Demo
            </a>
            <a
              href="#benefits"
              className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
              onClick={handleNavLinkClick}
            >
              Benefits
            </a>
          </div>
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-blue-100 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>
        <div className={`md:hidden px-4 pt-2 pb-4 space-y-2 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <a
            href="#how-it-works"
            className="block px-4 py-2 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
            onClick={handleNavLinkClick}
          >
            How It Works
          </a>
          <a
            href="#features"
            className="block px-4 py-2 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
            onClick={handleNavLinkClick}
          >
            Features
          </a>
          <a
            href="#dashboard-demo"
            className="block px-4 py-2 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
            onClick={handleNavLinkClick}
          >
            Dashboard Demo
          </a>
          <a
            href="#benefits"
            className="block px-4 py-2 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
            onClick={handleNavLinkClick}
          >
            Benefits
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center mb-20 bg mx-auto px-6 py-8 md:py-32 flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Smarter Feedback. Better Decisions.
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-white mb-10">
          ScanRevuAI is a simple AI tool that helps businesses collect and analyze customer feedback, delivering actionable daily and weekly recommendations.
        </p>
        <Link
          // href="https://forms.gle/EE2gVMah3ntVsXRG9"
          to="/businessAuth"
          // target="_blank"
          // rel="noopener noreferrer"
          className="max-w-fit p-4 border border-white text-white rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center font-semibold"
        >
          Get Started For Free
        </Link>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-8 md:pb-16">
        {/* How It Works Section */}
        <section id="how-it-works" className="mb-20 md:mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">From Scan to Smart Decisions in 3 Simple Steps</h2>
            <p className="max-w-2xl mx-auto mt-4 text-slate-600">
              With ScanRevuAI, collecting and acting on customer feedback is effortless. Just a quick scan, instant feedback, and actionable insights—all in one seamless flow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Scan the QR Code</h3>
              <p className="text-slate-500">
                Customers simply scan a unique QR code at your business location or on a product—no app required.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Share Feedback Instantly</h3>
              <p className="text-slate-500">
                They’re taken to a mobile-friendly page where they can leave ratings and reviews, and even upload photos or videos — anonymously or with an account.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Actionable Insights</h3>
              <p className="text-slate-500">
                ScanRevuAI organizes and analyzes feedback in your private dashboard, highlighting trends, prioritizing recurring issues, and delivering clear, data-driven recommendations.
              </p>
            </div>
          </div>
          <Link
          // href="https://forms.gle/EE2gVMah3ntVsXRG9"
          to="/businessAuth"
          // target="_blank"
          // rel="noopener noreferrer"
          className="max-w-fit p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100 hover:border-white-500 mx-auto hover:text-blue-500 transition-all flex items-center justify-center font-semibold mt-12"
        >
          Get Started For Free
        </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-20 md:mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">What Powers ScanRevuAI</h2>
            <p className="max-w-2xl mx-auto mt-4 text-slate-600">
              Discover the key features that make ScanRevuAI simple, smart, and effective — from QR code feedback collection to loyalty programs that keep customers engaged.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left p-4 border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${activeFeature === 'feature-qr' ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                    onClick={() => handleFeatureTabClick('feature-qr')}
                  >
                    Unique QR Codes
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-4 border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${activeFeature === 'feature-dashboard' ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                    onClick={() => handleFeatureTabClick('feature-dashboard')}
                  >
                    Analytics Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-4 border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${activeFeature === 'feature-loyalty' ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                    onClick={() => handleFeatureTabClick('feature-loyalty')}
                  >
                    Loyalty Programs
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-4 border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${activeFeature === 'feature-interface' ? 'bg-blue-600 text-white border-blue-600' : ''}`}
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
                <p className="text-slate-600 space-y-3">
                  <span><strong>Business-Specific Codes:</strong> Generate codes for your physical locations to gather general feedback.</span><br /><br />
                  <span><strong>Product-Specific Codes:</strong> Attach QR codes to individual products for granular reviews and performance tracking.</span><br /><br />
                  <span><strong>Customizable:</strong> Add your branding for a seamless customer experience.</span>
                </p>
              </div>
              <div className={activeFeature === 'feature-dashboard' ? 'block' : 'hidden'}>
                <h3 className="text-2xl font-bold mb-4">Comprehensive Business Dashboard</h3>
                <p className="text-slate-600 space-y-3">
                  <span><strong>Centralized View:</strong> See all feedback in one secure place.</span><br /><br />
                  <span><strong>Automated Summaries:</strong> AI-powered reports highlight key themes, common complaints, and praises.</span><br /><br />
                  <span><strong>Frequency Prioritization:</strong> Automatically identify and flag the most frequent feedback points so you know what to tackle first.</span><br /><br />
                  <span><strong>Multimedia Reports:</strong> Generate audio/video summaries for quick, digestible weekly updates.</span>
                </p>
              </div>
              <div className={activeFeature === 'feature-loyalty' ? 'block' : 'hidden'}>
                <h3 className="text-2xl font-bold mb-4">Loyalty Program Integration</h3>
                <p className="text-slate-600 space-y-3">
                  <span><strong>Track Engagement:</strong> Monitor feedback submissions from registered users.</span><br /><br />
                  <span><strong>Incentivize Feedback:</strong> Create custom loyalty programs to reward your most engaged customers with bonuses and offers.</span><br /><br />
                  <span><strong>Build Community:</strong> Encourage repeat feedback and turn customers into loyal advocates for your brand.</span>
                </p>
              </div>
              <div className={activeFeature === 'feature-interface' ? 'block' : 'hidden'}>
                <h3 className="text-2xl font-bold mb-4">Intuitive User Feedback Interface</h3>
                <p className="text-slate-600 space-y-3">
                  <span><strong>Instant & App-less:</strong> A direct link to a mobile-optimized web page.</span><br /><br />
                  <span><strong>Multi-Format Feedback:</strong> Users can submit text, ratings, images, and even short videos.</span><br /><br />
                  <span><strong>Anonymity & Accounts:</strong> Users can choose to submit anonymously or create an account to participate in loyalty programs.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Demo Section */}
        <section id="dashboard-demo" className="mb-20 md:mb-32 bg-white p-6 md:p-10 rounded-lg shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Interactive Dashboard Demo</h2>
            <p className="max-w-3xl mx-auto mt-4 text-slate-600">
              This is a simulation of the core of the ScanRevuAI business dashboard. Here, you can see how feedback is categorized and quantified. Use the filters to see how insights can change over different time periods, demonstrating the power of identifying recurring trends.
            </p>
          </div>
          <div className="text-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                className={`px-4 py-2 text-sm font-medium ${chartPeriod === 'weekly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} border border-blue-700 rounded-l-lg hover:bg-blue-700 hover:text-blue-500`}
                onClick={() => handleChartFilterClick('weekly')}
              >
                Weekly
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${chartPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} border-t border-b border-blue-700 hover:bg-blue-50 hover:text-blue-500`}
                onClick={() => handleChartFilterClick('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${chartPeriod === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} border border-blue-700 rounded-r-md hover:bg-blue-50 hover:text-blue-500`}
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
        <section id="benefits" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">A Win-Win Platform</h2>
            <p className="max-w-2xl mx-auto mt-4 text-slate-600">
              ScanRevuAI is designed to create value for both sides of the counter — from businesses seeking to improve and for customers who want their voices heard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">For Businesses</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span><strong>Real-time Insights:</strong> Get immediate, unfiltered feedback at the point of experience.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span><strong>Data-Driven Decisions:</strong> Make informed choices based on summarized and prioritized data.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span><strong>Improved Satisfaction:</strong> Proactively address issues and enhance positive experiences.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span><strong>Increased Loyalty:</strong> Build a loyal following through recognition and incentives.</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">For Customers</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span><strong>Effortless Submission:</strong> A quick, convenient way to share opinions.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span><strong>Feel Heard:</strong> Know your feedback directly contributes to improvements.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span><strong>Anonymity Option:</strong> Comfort in providing honest feedback without revealing your identity.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <span><strong>Get Rewarded:</strong> Benefit from loyalty programs for active participation.</span>
                </li>
              </ul>
            </div>
          </div>
          <Link
          // href="https://forms.gle/EE2gVMah3ntVsXRG9"
          to="/businessAuth"
          // target="_blank"
          // rel="noopener noreferrer"
          className="max-w-fit p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100 hover:border-white-500 mx-auto hover:text-blue-500 transition-all flex items-center justify-center font-semibold mt-12"
        >
          Get Started For Free
        </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white">
        <div className="container mx-auto px-6 py-8 text-center text-slate-400">
          <p className="font-bold text-lg text-white mb-2">ScanRevuAI</p>
          <p>&copy; 2025 ScanRevuAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;