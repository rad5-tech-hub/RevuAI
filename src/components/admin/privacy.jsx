import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const Privacy = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    toast.success('Privacy Policy accepted!', {
      duration: 3000,
      position: 'top-right',
    });
    navigate('/');
  };

  return (
    <div className="font-inter bg-stone-50 text-black min-h-screen py-16 px-6">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">ScanRevuAI Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: 1st September 2025</p>
        <div className="text-gray-700 space-y-6">
          <p>
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
        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
          >
            Accept Policy
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

export default Privacy;