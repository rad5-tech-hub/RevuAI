import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import LandingPage from './LandingPage.jsx';
import BusinessAuth from './components/business/pages/BusinessAuth.jsx';
import BusinessDashboard from './components/business/pages/BusinessDashboard.jsx';
import Qr from './components/business/pages/QrGenerator.jsx';
import Feedback from './components/business/pages/FeedbackExplorer.jsx';
import Report from './components/business/pages/ReportSection.jsx';
import FeedbackForm from './components/customer/pages/feedbackform.jsx'; // Consistent case
import ThankYou from './components/customer/pages/ThankYouPage.jsx';
import UserAuth from './components/customer/pages/UserAuth.jsx';
import UserAcc from './components/customer/pages/UserAccount.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ProtectedRoute component to check for auth token
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/businessAuth" replace />;
};

function App() {
  return (
    <div>
      <ToastContainer />
      <Router basename="/">
        <Routes>
          {/* Dynamic landing page route with businessId and qrcodeId */}
          <Route path="/qr/:businessId/:qrcodeId" element={<LandingPage />} />
          {/* Fallback for root route if no QR code is scanned */}
          <Route path="/" element={<Homepage />} />
          <Route path="/businessAuth" element={<BusinessAuth />} />
          <Route
            path="/businessDashboard"
            element={
              <ProtectedRoute>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/businessQrpage"
            element={
              <ProtectedRoute>
                <Qr />
              </ProtectedRoute>
            }
          />
          <Route
            path="/businessReports"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/businessFeedback"
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            }
          />
          {/* Feedback form route with optional parameters */}
          <Route path="/feedbackForm/:businessId?/:qrcodeId?" element={<FeedbackForm />} />
          <Route path="/thankYou" element={<ThankYou />} />
          <Route path="/userAuth" element={<UserAuth />} />
          <Route path="/userAccount" element={<UserAcc />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;