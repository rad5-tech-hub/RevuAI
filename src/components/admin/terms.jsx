import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const Terms = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    toast.success('Terms of Service accepted!', {
      duration: 3000,
      position: 'top-right',
    });
    navigate('/');
  };

  return (
    <div className="font-inter bg-stone-50 text-black min-h-screen py-16 px-6">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">ScanRevuAI Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: 1st September 2025</p>
        <div className="text-gray-700 space-y-6">
          <p>
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
        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
          >
            Accept Terms
          </button>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;