import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import LandingPage from './LandingPage.jsx';
import BusinessAuth from './components/business/pages/BusinessAuth.jsx';
import BusinessDashboard from './components/business/pages/BusinessDashboard.jsx';
import Qr from './components/business/pages/QrGenerator.jsx';
import Feedback from './components/business/pages/FeedbackExplorer.jsx';
import Report from './components/business/pages/ReportSection.jsx';
import FeedbackForm from './components/customer/pages/feedbackform.jsx';
import ThankYou from './components/customer/pages/ThankYouPage.jsx';
import ForgotPassword from './components/customer/pages/ForgotPassword.jsx';
import UserAuth from './components/customer/pages/UserAuth.jsx';
import UserAcc from './components/customer/pages/UserAccount.jsx';
import BusinessProfile from './components/business/pages/BusinessProfile.jsx';
import EditBusinessProfile from './components/business/pages/EditBusinessProfile.jsx';
import ResetPassword from './components/business/components/ResetPassword.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ProtectedRoute for business-side routes (unchanged)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/businessAuth" replace />;
};

// UserProtectedRoute for user-side routes (unchanged)
const UserProtectedRoute = ({ children, requireQrContext = false, requireFromFeedback = false }) => {
  const location = useLocation();
  const { businessId, qrcodeId } = useParams();

  const isAuthenticated = !!localStorage.getItem('authToken') || !!sessionStorage.getItem('authToken');

  let qrContextValid = false;
  if (requireQrContext) {
    const storedQrContext = localStorage.getItem('qrContext');
    if (storedQrContext) {
      try {
        const parsedQrContext = JSON.parse(storedQrContext);
        qrContextValid =
          parsedQrContext.businessId === businessId && parsedQrContext.qrcodeId === qrcodeId;
      } catch (error) {
        console.error('Error parsing qrContext:', error);
      }
    } else if (location.state?.qrContext) {
      const parsedQrContext = location.state.qrContext;
      qrContextValid =
        parsedQrContext.businessId === businessId && parsedQrContext.qrcodeId === qrcodeId;
    }
  }

  const fromFeedback = location.state?.fromFeedback;

  if (requireQrContext && !qrContextValid) {
    console.warn('UserProtectedRoute: Invalid or missing qrContext', { businessId, qrcodeId });
    return <Navigate to="/" replace />;
  }
  if (requireFromFeedback && !fromFeedback) {
    console.warn('UserProtectedRoute: Missing fromFeedback state for /thankYou');
    return <Navigate to="/" replace />;
  }
  if (children.type === UserAcc && !isAuthenticated) {
    console.warn('UserProtectedRoute: No authToken for /userAccount');
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <div>
      <ToastContainer />
      <Router basename="/">
        <Routes>
          {/* Public routes */}
          <Route path="/qr/:businessId/:qrcodeId" element={<LandingPage />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/userAuth" element={<UserAuth />} />
          <Route path="/businessAuth" element={<BusinessAuth />} />
          <Route path="/changePassword" element={<ForgotPassword />} /> {/* Updated route */}

          {/* Business-side protected routes */}
          <Route
            path="/businessDashboard"
            element={
              <ProtectedRoute>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/businessProfile"
            element={
              <ProtectedRoute>
                <BusinessProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/businessProfile/edit"
            element={
              <ProtectedRoute>
                <EditBusinessProfile />
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

          {/* User-side protected routes */}
          <Route
            path="/feedbackForm/:businessId/:qrcodeId"
            element={
              <UserProtectedRoute requireQrContext={true}>
                <FeedbackForm />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/thankYou"
            element={
              <UserProtectedRoute requireFromFeedback={true}>
                <ThankYou />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/userAccount"
            element={
              <UserProtectedRoute>
                <UserAcc />
              </UserProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;