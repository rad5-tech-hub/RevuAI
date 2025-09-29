import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { FaXTwitter } from "react-icons/fa6";

const Terms = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="font-inter bg-stone-50 text-black min-h-screen">

      <header className="bg-white/60 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl lg:text-2xl font-bold text-blue-700">ScanRevuAI</Link>
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

      <section className="bg text-white text-center py-16 md:py-24 px-6 h-[90vh] flex items-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl max-w-5xl mx-auto font-bold tracking-tight mb-4">
            ScanRevuAI Terms of Service. 
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-6">
            Last Updated: 1st September 2025
          </p>
        </div>
      </section>

      <div className='py-16 px-6'>
        <div className="container mx-auto max-w-3xl">
          <div className="text-gray-700 space-y-6">
            <p className='text-lg lg:text-xl'>
              Welcome to ScanRevuAI (“we,” “our,” or “us”). By accessing or using our platform (the “Service”), whether as a business partner (hotel, restaurant, mall, or similar) or as a customer/user (signed-in or anonymous), you agree to these Terms of Service (“Terms”). Please read them carefully.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">1. Acceptance of Terms</h2>
            <p>
              By using ScanRevuAI, you agree to follow these Terms. If you do not agree, you may not use the Service. Businesses may enter into a separate written agreement with us.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">2. Who We Serve</h2>
            <p>
              <strong>Businesses:</strong> Hotels, restaurants, malls, and other hospitality-related businesses using ScanRevuAI to collect, analyze, and act on customer feedback.<br />
              <strong>Users:</strong> Customers who submit feedback (with or without an account) using QR codes, links, or any ScanRevuAI tool.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">3. Use of Service</h2>
            <p>
              Businesses agree to use ScanRevuAI only for lawful purposes and customer experience improvement.<br />
              Users agree to provide honest feedback and not misuse the platform (e.g., spamming, offensive content, fake feedback).<br />
              We may remove or block abusive, harmful, or misleading use of the Service.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">4. Feedback Rights</h2>
            <p>
              When a user submits feedback, the business gets access to it for improvement purposes.<br />
              ScanRevuAI may analyze, anonymize, and use feedback data to generate insights, recommendations, and reports.<br />
              We do not sell individual user feedback to third parties.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">5. Data Accuracy</h2>
            <p>
              Businesses are responsible for ensuring the accuracy of their account information.<br />
              Users are responsible for ensuring the accuracy of their submitted feedback.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">6. AI-Generated Insights</h2>
            <p>
              Our platform uses artificial intelligence to analyze customer feedback and generate recommendations.<br />
              These insights are suggestions only and not guarantees of business outcomes.<br />
              Businesses remain fully responsible for their decisions.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">7. Payments</h2>
            <p>
              If you subscribe to a paid plan, you agree to pay the applicable fees. All fees are non-refundable except as required by law.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">8. Intellectual Property</h2>
            <p>
              All rights to the ScanRevuAI platform, brand, and technology belong to us. Businesses and users may not copy, resell, or distribute our platform or data without permission.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">9. Limitation of Liability</h2>
            <p>
              ScanRevuAI is not responsible for:<br />
              - The truthfulness or accuracy of feedback submitted by users.<br />
              - Business outcomes resulting from AI-generated recommendations.<br />
              - Any indirect, incidental, or consequential damages arising from platform use.<br />
              Our total liability will not exceed the amount paid by the business in the last 12 months.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">10. Termination</h2>
            <p>
              We may suspend or terminate any account for violating these Terms. Businesses may terminate their account by written request.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">11. Governing Law</h2>
            <p>
              These Terms will be governed by the laws of Nigeria.
            </p>
          </div>
        </div>
      </div>

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

export default Terms;