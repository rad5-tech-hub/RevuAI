import { User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, 
  // useEffect 
} from "react";

const AdminAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  // const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  // const [forgotEmail, setForgotEmail] = useState("");
  // const [forgotLoading, setForgotLoading] = useState(false);
  // const [forgotError, setForgotError] = useState("");
  // const [forgotSuccess, setForgotSuccess] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // Fixed role for admin sign-up
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Auto-login check
  // useEffect(() => {
  //   const adminAuthToken = localStorage.getItem("adminAuthToken");
  //   if (adminAuthToken) {
  //     const validateToken = async () => {
  //       try {
  //         const response = await fetch(`${BASE_URL}/api/v1/admins/validate-token`, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${adminAuthToken}`,
  //           },
  //         });

  //         const data = await response.json();

  //         if (response.ok && data.valid) {
  //           let adminData = localStorage.getItem("adminData");
  //           if (!adminData) {
  //             adminData = JSON.stringify({
  //               adminId: data.admin?.id || data.admin?.adminId || "",
  //               name: data.admin?.name || "Admin",
  //               email: data.admin?.email || "",
  //             });
  //             localStorage.setItem("adminData", adminData);
  //           }
  //           navigate("/adminDashboard");
  //         } else {
  //           localStorage.removeItem("adminAuthToken");
  //           localStorage.removeItem("adminData");
  //           setError("Session expired. Please sign in again.");
  //         }
  //       } catch (error) {
  //         localStorage.removeItem("adminAuthToken");
  //         localStorage.removeItem("adminData");
  //         setError("Failed to validate session. Please sign in again.");
  //       }
  //     };
  //     validateToken();
  //   }
  // }, [navigate]);

  const handleToggle = () => {
    setIsSignUp((prev) => !prev);
    setError("");
    setSuccess("");
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });
  };

  const handleInputChange = (field, value) => {
    setError("");
    setSuccess("");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (isSignUp && !formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = isSignUp
        ? `${BASE_URL}/api/v1/admins/admin`
        : `${BASE_URL}/api/v1/admins/login-admin`;

      const payload = isSignUp
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `${isSignUp ? "Registration" : "Login"} failed`
        );
      }

      if (!isSignUp) {
        let token = data.token || data.accessToken || data.access_token || data.authToken || data.jwt;
        if (!token) {
          setError("Login failed: No authentication token received.");
          return;
        }

        localStorage.setItem("adminAuthToken", token);
        const adminData = {
          adminId: data.admin?.id || data.admin?.adminId || data.id || data.adminId || "",
          name: data.name || data.admin?.name || formData.email,
          email: data.email || data.admin?.email || formData.email,
        };
        localStorage.setItem("adminData", JSON.stringify(adminData));
        setSuccess("Login successful!");

        setTimeout(() => {
          navigate("/adminDashboard");
        }, 1500);
      } else {
        setSuccess("Registration successful.");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "admin",
        });
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // const handleForgotPassword = async () => {
  //   if (!forgotEmail.trim()) {
  //     setForgotError("Email is required");
  //     return;
  //   }
  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
  //     setForgotError("Please enter a valid email address");
  //     return;
  //   }

  //   setForgotLoading(true);
  //   setForgotError("");
  //   setForgotSuccess("");

  //   try {
  //     const response = await fetch(`${BASE_URL}/api/v1/admins/forgot-password`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email: forgotEmail }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to send password reset email");
  //     }

  //     setForgotSuccess(data.message || "Password reset email sent!");
  //     setTimeout(() => {
  //       setIsForgotPasswordOpen(false);
  //       setForgotEmail("");
  //     }, 1500);
  //   } catch (error) {
  //     setForgotError(error.message || "An unexpected error occurred");
  //   } finally {
  //     setForgotLoading(false);
  //   }
  // };

  // const handleCloseModal = () => {
  //   setIsForgotPasswordOpen(false);
  //   setForgotEmail("");
  //   setForgotError("");
  //   setForgotSuccess("");
  // };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-blue-600 text-xl font-medium mb-2">
            {isSignUp ? "Admin Registration" : "Admin Login"}
          </h1>
          <p className="text-gray-600 text-sm">
            {isSignUp
              ? "Create an admin account to manage feedback"
              : "Sign in to access admin features"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                placeholder={isSignUp ? "Create password" : "Password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* {!isSignUp && (
              <div className="text-right">
                <button
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-blue-600 text-xs hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )} */}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm cursor-pointer font-medium transition-colors mt-6 flex items-center justify-center ${
              isSignUp
                ? "bg-yellow-400 hover:bg-yellow-500 text-gray-800"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : isSignUp ? (
              "Register"
            ) : (
              "Sign In"
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={handleToggle}
              className="text-blue-600 text-sm hover:underline cursor-pointer"
            >
              {isSignUp
                ? "Sign In as Admin"
                : "Register as Admin"}
            </button>
          </div>
        </div>

        {/* {isForgotPasswordOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Reset Password</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {forgotSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <p className="text-green-600 text-sm">{forgotSuccess}</p>
                </div>
              )}

              {forgotError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  <p className="text-red-600 text-sm">{forgotError}</p>
                </div>
              )}

              <div className="relative mb-4">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotError("");
                    setForgotSuccess("");
                    setForgotEmail(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <button
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className={`w-full py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center justify-center ${
                  forgotLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {forgotLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </div>
        )} */}
        
      </div>
    </div>
  );
};
export default AdminAuth;
