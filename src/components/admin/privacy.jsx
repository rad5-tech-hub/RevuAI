import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";
import { useState } from 'react';

const Privacy = () => {
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
            ScanRevuAI Privacy Policy. 
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-6">
            Last Updated: 1st September 2025
          </p>
        </div>
      </section>

      <div className=' py-16 px-6'>
        <div className="container mx-auto max-w-3xl">
          <div className="text-black space-y-6">
            <p className='text-xl'>
              We respect your privacy. This Privacy Policy explains how we collect, use, and protect personal information.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">1. Information We Collect</h2>
            <p>
              <strong>From Businesses:</strong><br />
              - Account details (name, email, phone, payment info).<br />
              - Business details (name, address, industry).<br />
              <strong>From Users (Signed-in or Anonymous):</strong><br />
              - Feedback text, ratings, or survey responses.<br />
              - Device/browser info (to improve service).<br />
              - Location data (only if voluntarily shared).<br />
              We do not require personal identification for anonymous feedback.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">2. How We Use Information</h2>
            <p>
              - To provide businesses with insights and recommendations.<br />
              - To improve ScanRevuAI’s technology and services.<br />
              - To contact businesses about updates, offers, and support.<br />
              - To ensure compliance with legal obligations.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">3. Sharing of Information</h2>
            <p>
              We do not sell personal data. We may share data only with:<br />
              - Businesses (user feedback relevant to them).<br />
              - Service providers (e.g., cloud hosting, payment processors).<br />
              - Regulators if required by law.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">4. Data Retention</h2>
            <p>
              - Business account data is retained as long as the account is active.<br />
              - User feedback is retained to generate insights, but anonymized whenever possible.<br />
              - You may request deletion of your feedback by contacting us.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">5. Cookies & Tracking</h2>
            <p>
              We may use cookies for analytics and platform performance. Users can disable cookies in their browser settings.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">6. Data Security</h2>
            <p>
              We use industry-standard encryption and access controls to protect your data. However, no system is 100% secure, and users share information at their own risk.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">7. Children’s Privacy</h2>
            <p>
              ScanRevuAI is not directed at children under 13. We do not knowingly collect data from children.
            </p>
            <h2 className="text-xl font-semibold text-blue-700">8. Your Rights</h2>
            <p>
              <strong>Businesses:</strong> Access, update, or delete account information.<br />
              <strong>Users:</strong> Request deletion of feedback or correction of personal data.<br />
              Contact us at: hello@scanrevuai.com
            </p>
            <h2 className="text-xl font-semibold text-blue-700">9. Changes to Policy</h2>
            <p>
              We may update this Policy from time to time. Continued use means acceptance of updates.
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
                <a href="https://www.facebook.com/profile.php?id=61582786711070" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
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

export default Privacy;