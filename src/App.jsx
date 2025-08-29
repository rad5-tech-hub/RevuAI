import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import BusinessAuth from '../src/components/business/pages/BusinessAuth.jsx';
import BusinessDashboard from '../src/components/business/pages/BusinessDashboard.jsx';
import Qr from '../src/components/business/pages/QrGenerator.jsx';
import Feedback from '../src/components/business/pages/FeedbackExplorer.jsx';
import Report from '../src/components/business/pages/ReportSection.jsx';
import FeedbackForm from '../src/components/customer/pages/feedbackform.jsx';
import ThankYou from '../src/components/customer/pages/ThankYouPage.jsx';
import UserAuth from '../src/components/customer/pages/UserAuth.jsx';
import UserAcc from '../src/components/customer/pages/UserAccount.jsx';
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
      <Router basename="/RevuAI">
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
          <Route path="/feedbackForm" element={<FeedbackForm />} />
          <Route path="/thankYou" element={<ThankYou />} />
          <Route path="/userAuth" element={<UserAuth />} />
          <Route path="/userAccount" element={<UserAcc />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;