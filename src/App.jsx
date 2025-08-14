import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import QRCodeGenerator from './components/business/pages/QrGenerator.jsx';
import ScanReviewLanding from '../src/components/business/pages/BusinessAuth.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<QRCodeGenerator />} />
        <Route path="/businessAuth" element={<ScanReviewLanding />} />
        {/* <Route path="/signin" element={<SignInPage />} /> */}
        {/* <Route path="/review" element={<ReviewPage />} /> */}
        {/* <Route path="/thank-you" element={<ThankYouPage />} /> */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        {/* <Route path="/business-dashboard" element={<BusinessDashboardPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;