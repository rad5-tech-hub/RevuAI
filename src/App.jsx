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
import UserAuth from './components/customer/pages/UserAuth.jsx';
import UserAcc from './components/customer/pages/UserAccount.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ProtectedRoute for business-side routes (unchanged)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/businessAuth" replace />;
};

// UserProtectedRoute for user-side routes
const UserProtectedRoute = ({ children, requireQrContext = false, requireFromFeedback = false }) => {
  const location = useLocation();
  const { businessId, qrcodeId } = useParams();

  // Check for authToken (for /userAccount)
  const isAuthenticated = !!localStorage.getItem('authToken') || !!sessionStorage.getItem('authToken');

  // Check for qrContext (for /feedbackForm)
  const storedQrContext = localStorage.getItem('qrContext');
  let qrContextValid = false;
  if (requireQrContext && storedQrContext) {
    try {
      const parsedQrContext = JSON.parse(storedQrContext);
      qrContextValid =
        parsedQrContext.businessId === businessId && parsedQrContext.qrcodeId === qrcodeId;
    } catch (error) {
      console.error('Error parsing qrContext:', error);
    }
  } else if (requireQrContext && location.state?.qrContext) {
    const parsedQrContext = location.state.qrContext;
    qrContextValid =
      parsedQrContext.businessId === businessId && parsedQrContext.qrcodeId === qrcodeId;
  }

  // Check for fromFeedback (for /thankYou)
  const fromFeedback = location.state?.fromFeedback;

  // Redirect logic
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