import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Eye,
  Download,
  Share2,
} from "lucide-react";
import axios from "axios";

const StrengthsProblemsSection = ({ businessId, authToken, baseUrl }) => {
  const [strengthsData, setStrengthsData] = useState([]);
  const [problemsData, setProblemsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllProblems, setShowAllProblems] = useState(false);

  useEffect(() => {
    fetchStrengthsAndProblems();
  }, [businessId, authToken]);

  const fetchStrengthsAndProblems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/v1/business/analytics/${businessId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const { aiAnalysis } = response.data;
      
      // Transform positive highlights into strengths format
      const strengths = (aiAnalysis.positiveHighlights || []).map((highlight, index) => ({
        id: index + 1,
        title: highlight.highlight,
        mentions: highlight.count,
        type: 'strength'
      }));

      // Transform top issues into problems format
      const problems = (aiAnalysis.topIssues || []).map((issue, index) => ({
        id: index + 1,
        title: issue.issue,
        mentions: issue.count,
        type: 'problem'
      }));

      setStrengthsData(strengths);
      setProblemsData(problems);
      setError("");
    } catch (err) {
      setError("Failed to load strengths and problems data.");
      console.error("Strengths/Problems fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadData = (data, filename) => {
    if (data.length === 0) return;
    const csv = "Rank,Item,Mentions\n" + 
                data.map((item) => `${item.id},"${item.title}",${item.mentions}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareContent = async (type) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Business ${type} Analysis`,
          text: `Check out the latest ${type.toLowerCase()} analysis!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-300 border-t-blue-600"></div>
  );

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-900">Performance Analysis</h2>
        <p className="text-base text-gray-500">What customers love and what needs improvement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">What people really love</h3>
                  <p className="text-sm text-gray-500">
                    {strengthsData.length > 0 
                      ? `${strengthsData.reduce((sum, item) => sum + item.mentions, 0)} Mentions`
                      : "No data available"
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => downloadData(strengthsData, "strengths_analysis.csv")}
                  title="Download strengths data"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => shareContent('Strengths')}
                  title="Share strengths"
                >
                  <Share2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {strengthsData.length > 0 ? (
              <div className="space-y-3">
                {(showAllStrengths ? strengthsData : strengthsData.slice(0, 5)).map((strength) => (
                  <div key={strength.id} className="flex items-start justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {strength.id.toString().padStart(2, '0')}
                      </span>
                      <p className="text-sm text-gray-900 font-medium">{strength.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">{strength.mentions}</span>
                    </div>
                  </div>
                ))}
                
                {strengthsData.length > 5 && (
                  <button
                    onClick={() => setShowAllStrengths(!showAllStrengths)}
                    className="w-full mt-4 py-2 px-4 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showAllStrengths ? 'Show Less' : `View All ${strengthsData.length} Strengths`}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No strengths data available yet</p>
                <p className="text-xs text-gray-400 mt-1">Strengths will appear as you receive more positive feedback</p>
              </div>
            )}
          </div>
        </div>

        {/* Problems Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">What needs to be improved</h3>
                  <p className="text-sm text-gray-500">
                    {problemsData.length > 0 
                      ? `${problemsData.reduce((sum, item) => sum + item.mentions, 0)} Mentions`
                      : "No data available"
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => downloadData(problemsData, "problems_analysis.csv")}
                  title="Download problems data"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => shareContent('Problems')}
                  title="Share problems"
                >
                  <Share2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {problemsData.length > 0 ? (
              <div className="space-y-3">
                {(showAllProblems ? problemsData : problemsData.slice(0, 5)).map((problem) => (
                  <div key={problem.id} className="flex items-start justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {problem.id.toString().padStart(2, '0')}
                      </span>
                      <p className="text-sm text-gray-900 font-medium">{problem.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">{problem.mentions}</span>
                    </div>
                  </div>
                ))}
                
                {problemsData.length > 5 && (
                  <button
                    onClick={() => setShowAllProblems(!showAllProblems)}
                    className="w-full mt-4 py-2 px-4 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showAllProblems ? 'Show Less' : `View All ${problemsData.length} Issues`}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No issues identified yet</p>
                <p className="text-xs text-gray-400 mt-1">Issues will be highlighted as feedback patterns emerge</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrengthsProblemsSection;