import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
// import QRCodeGenerator from './components/business/pages/QrGenerator.jsx';
import BusinessAuth from '../src/components/business/pages/BusinessAuth.jsx';
import BusinessDashboard from '../src/components/business/pages/BusinessDashboard.jsx'; 
import Qr from '../src/components/business/pages/QrGenerator.jsx';
import Feedback from '../src/components/business/pages/FeedbackExplorer.jsx';
import Report from '../src/components/business/pages/ReportSection.jsx';
import FeedbackForm from '../src/components/customer/pages/FeedbackForm.jsx'
import ThankYou from '../src/components/customer/pages/ThankYouPage.jsx'
import UserAuth from '../src/components/customer/pages/UserAuth.jsx'
import UserAcc from '../src/components/customer/pages/UserAccount.jsx'
// import BusinessAuth from './components/business/pages/BusinessDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/businessAuth" element={<BusinessAuth />} />
        <Route path="/businessQrpage" element={<Qr />} />
        <Route path="/businessReports" element={<Report />} />
        <Route path="/businessFeedback" element={<Feedback />} />
        <Route path="/businessDashboard" element={<BusinessDashboard />} />
        <Route path="/feedbackForm" element={<FeedbackForm />} />
        <Route path="/thankYou" element={<ThankYou />} />
        <Route path="/userAuth" element={<UserAuth />} />
        <Route path="/userAccount" element={<UserAcc />} />
      </Routes>
    </Router>
  );
};

export default App;