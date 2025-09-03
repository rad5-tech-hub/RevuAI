import { Link, useNavigate, useParams } from 'react-router-dom';
import { QrCode, Tag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import QRCode from 'qrcode';

function LandingPage() {
  const navigate = useNavigate();
  const { businessId, qrcodeId } = useParams();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const qrRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchQrDetails = async () => {
      if (!businessId || !qrcodeId) {
        setError('Invalid URL parameters. Please scan a valid QR code.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/qrcode/qrcode/${qrcodeId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('authToken') && {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }),
          },
        });

        const qr = response.data.qr || response.data;
        console.log('QR API Response:', JSON.stringify(qr, null, 2));
        if (!qr.is_active) {
          throw new Error('This QR code is inactive.');
        }

        // Parse qrcode_tags to an array, preserving original case
        let normalizedTags = [];
        if (qr.qrcode_tags) {
          if (Array.isArray(qr.qrcode_tags)) {
            normalizedTags = qr.qrcode_tags.map(tag => tag.trim());
          } else if (typeof qr.qrcode_tags === 'string') {
            try {
              normalizedTags = JSON.parse(qr.qrcode_tags).map(tag => tag.trim());
              if (!Array.isArray(normalizedTags)) {
                throw new Error('Parsed qrcode_tags is not an array');
              }
            } catch (e) {
              normalizedTags = qr.qrcode_tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
          } else {
            console.warn('Unexpected qrcode_tags format:', qr.qrcode_tags);
          }
        }
        console.log('Normalized qrcode_tags:', normalizedTags);

        const qrContext = {
          businessId,
          qrcodeId,
          businessName: qr.business?.business_name || qr.label || 'Unknown Business',
          qrcodeTags: normalizedTags,
        };
        setQrData({
          ...qr,
          scan_url: qr.scan_url,
          qrcode_tags: normalizedTags,
        });
        // Store in localStorage
        localStorage.setItem('qrContext', JSON.stringify(qrContext));
        console.log('Stored qrContext in localStorage:', qrContext);
      } catch (err) {
        console.error('Error fetching QR details:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load business details';
        setError(errorMessage);
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
        });
        // Store fallback data
        const qrContext = {
          businessId,
          qrcodeId,
          businessName: 'Unknown Business',
          qrcodeTags: [],
        };
        localStorage.setItem('qrContext', JSON.stringify(qrContext));
        console.log('Stored fallback qrContext in localStorage:', qrContext);
      } finally {
        setLoading(false);
      }
    };

    fetchQrDetails();
  }, [businessId, qrcodeId, BASE_URL]);

  useEffect(() => {
    if (qrData?.scan_url && qrRef.current && !qrData.qrcode_url) {
      qrRef.current.innerHTML = '';
      QRCode.toCanvas(qrRef.current, qrData.scan_url, {
        width: 120,
        height: 120,
        color: {
          dark: '#0E5FD8',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      }, (error) => {
        if (error) {
          console.error('QRCode generation error:', error);
          toast.error('Failed to generate QR code preview.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      });
    }
  }, [qrData]);

  const handleSignIn = () => {
    console.log('LandingPage handleSignIn - businessId:', businessId, 'qrcodeId:', qrcodeId);
    navigate('/userAuth', { state: { businessId, qrcodeId } });
  };

  const handleContinueAnonymously = () => {
    console.log('LandingPage handleContinueAnonymously - businessId:', businessId, 'qrcodeId:', qrcodeId);
    if (businessId && qrcodeId) {
      navigate(`/feedbackForm/${businessId}/${qrcodeId}`);
    } else {
      const storedQrContext = JSON.parse(localStorage.getItem('qrContext') || '{}');
      if (storedQrContext.businessId && storedQrContext.qrcodeId) {
        navigate(`/feedbackForm/${storedQrContext.businessId}/${storedQrContext.qrcodeId}`);
      } else {
        navigate('/feedbackForm');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !qrData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Business</h2>
          <p className="text-gray-600 mb-4">{error || 'No data available. Please scan a valid QR code.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <ToastContainer />
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
          <QrCode />
        </div>
        <h1 className="text-2xl font-bold text-black mb-2 text-center">RevuAI</h1>
        <p className="text-black text-sm mb-8 text-center">Share your experience</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-black text-base mb-2 text-center">Welcome to</h2>
          <h3 className="text-2xl font-bold text-blue-500 mb-4 text-center">{qrData.business.business_name}</h3>
          <p className="text-black text-sm leading-relaxed text-center">
            Provide feedback for our <span className="font-bold text-blue-500">{qrData.label}</span> to help us improve our {qrData.type.toLowerCase()}.
          </p>
          <div className="mt-4 flex justify-center">
            {qrData.qrcode_url ? (
              <img
                src={qrData.qrcode_url}
                alt="QR Code"
                className="rounded-lg border border-gray-200"
                style={{ width: 120, height: 120 }}
              />
            ) : (
              <canvas
                ref={qrRef}
                className="rounded-lg border border-gray-200 bg-white p-2"
                style={{ width: 120, height: 120 }}
              />
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About {qrData.business.business_name}</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Category:</span> {qrData.category.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Contact:</span> {qrData.business.email || 'N/A'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback For: {qrData.label}</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {qrData.type.charAt(0).toUpperCase() + qrData.type.slice(1)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Description:</span> {qrData.description || 'No description provided'}
            </p>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tags:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {qrData.qrcode_tags.length > 0 ? (
                  qrData.qrcode_tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">No tags available</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleSignIn}
          className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 mb-4"
        >
          Sign In
        </button>
        <button
          onClick={handleContinueAnonymously}
          className="w-full cursor-pointer bg-white hover:bg-blue-200 text-black hover:text-blue-700 font-medium py-4 px-6 rounded-xl border hover:border-blue-700 transition-colors duration-200 mb-6"
        >
          Continue Anonymously
        </button>
        <div className="text-center">
          <Link
            to="/businessAuth"
            className="text-black text-sm underline hover:text-blue-500 transition-colors"
          >
            Business Owner? Access Portal
          </Link>
        </div>
      </div>
      <p className="text-center text-gray-600 text-sm pb-4">Powered by RevuAI . Privacy Protected</p>
    </div>
  );
}

export default LandingPage;