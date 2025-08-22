import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import QRCodeGenerator from './components/business/pages/QrGenerator.jsx';
import ScanReviewLanding from '../src/components/business/pages/BusinessAuth.jsx';
import BusinessDashboard from '../src/components/business/pages/BusinessDashboard.jsx'; 
import Qr from '../src/components/business/pages/QrGenerator.jsx';
import Feedback from '../src/components/business/pages/FeedbackExplorer.jsx';
import Report from '../src/components/business/pages/ReportSection.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/businessAuth" element={<ScanReviewLanding />} />
        <Route path="/businessQrpage" element={<Qr />} />
        <Route path="/businessReports" element={<Report />} />
        <Route path="/businessFeedback" element={<Feedback />} />
        <Route path="/businessDashboard" element={<BusinessDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;