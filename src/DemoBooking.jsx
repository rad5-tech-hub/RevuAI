import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DemoBooking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    yourName: '',
    phone: '',
    email: '',
    businessType: 'Hotel',
    location: '',
    reviewCount: 'Less than 50',
    biggestChallenge: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.businessName) tempErrors.businessName = 'Business Name is required';
    if (!formData.yourName) tempErrors.yourName = 'Your Name is required';
    if (!formData.phone) tempErrors.phone = 'Phone/WhatsApp is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.location) tempErrors.location = 'Location is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate form submission (replace with API call in production)
      console.log('Form submitted:', formData);
      setSubmitted(true);
      // Redirect to a thank you page or dashboard after submission
      setTimeout(() => navigate('/thank-you'), 2000);
    }
  };

  return (
    <div className="font-inter bg-stone-50 text-slate-800 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Book Your FREE Demo</h1>
        <p className="text-center text-slate-600 mb-8">See RevuAI in Action</p>
        {submitted ? (
          <div className="text-center text-green-600">Thank you! Your demo request has been submitted. Redirecting...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Your Name</label>
              <input
                type="text"
                name="yourName"
                value={formData.yourName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.yourName && <p className="text-red-500 text-sm">{errors.yourName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone/WhatsApp</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="Hotel">Hotel</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">How many reviews do you get monthly?</label>
              <select
                name="reviewCount"
                value={formData.reviewCount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="Less than 50">Less than 50</option>
                <option value="50-200">50-200</option>
                <option value="200-500">200-500</option>
                <option value="500+">500+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">What's your biggest review challenge?</label>
              <textarea
                name="biggestChallenge"
                value={formData.biggestChallenge}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Request
            </button>
          </form>
        )}
        <p className="text-center text-slate-600 mt-4">
          What you'll get in your 15-minute demo:
          <ul className="text-left mt-2 space-y-2">
            <li>✔ See how the QR code feedback system works</li>
            <li>✔ Watch AI analyze customer feedback in real-time</li>
            <li>✔ Get sample insights and recommendations for your business type</li>
            <li>✔ Learn how to set up your feedback collection system</li>
            <li>✔ Discover how to turn feedback into improved customer satisfaction</li>
          </ul>
        </p>
      </div>
    </div>
  );
};

export default DemoBooking;