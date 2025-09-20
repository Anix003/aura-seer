"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Brain, Scan, AlertCircle } from "lucide-react";
import { useMedical } from "@/contexts/MedicalContext";
import { useAnalyzeImage } from "@/hooks/useMedicalQueries";
import { MEDICAL_CONSTANTS, MOCK_DATA } from "@/lib/constants";
import { generateProgressionData } from "@/lib/medicalUtils";
import UploadImage from "@/components/UploadImage";
import ResultCard from "@/components/ResultCard";
import ProgressionChart from "@/components/ProgressionChart";
import TelemedicineButton from "@/components/TelemedicineButton";
import AnalysisHistory from "@/components/AnalysisHistory";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

export default function Home() {
  const { 
    uploadedImage, 
    symptoms, 
    analysisResult, 
    setAnalysisResult 
  } = useMedical();
  
  const [error, setError] = useState(null);

  // Use the modularized React Query hook
  const analysisMutation = useAnalyzeImage();

  const handleAnalyze = async () => {
    if (!uploadedImage?.file) {
      setError(MEDICAL_CONSTANTS.MESSAGES.NO_IMAGE);
      toast.error(MEDICAL_CONSTANTS.MESSAGES.NO_IMAGE);
      return;
    }

    setError(null);
    analysisMutation.mutate(
      {
        imageFile: uploadedImage.file,
        symptoms: symptoms.trim(),
      },
      {
        onSuccess: (data) => {
          setAnalysisResult(data);
          setError(null);
          toast.success(MEDICAL_CONSTANTS.MESSAGES.ANALYSIS_SUCCESS);
        },
        onError: (error) => {
          console.error("Analysis error:", error);
          const errorMessage = error.message || MEDICAL_CONSTANTS.MESSAGES.ANALYSIS_ERROR;
          setError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };

  const canAnalyze = uploadedImage && !analysisMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AURA Seer</h1>
                <p className="text-sm text-gray-500">AI-Powered Medical Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                System Online
              </span> */}
              <button className="flex items-center bg-blue-100 hover:bg-blue-400 hover:text-white py-2 px-4 rounded-full transition-all duration-200 ease-in-out">Log In</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Medical Image Analysis Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Upload medical images for AI-powered analysis and receive detailed insights, 
              disease progression tracking, and telemedicine consultation options.
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Upload Component */}
              <UploadImage />

              {/* Analyze Button */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 ${
                    canAnalyze
                      ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  aria-label="Analyze medical image"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  {analysisMutation.isPending ? "Analyzing..." : "Analyze Image"}
                </button>
                
                {uploadedImage && (
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Ready to analyze: {uploadedImage.name}
                  </p>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <Error 
                  message={error} 
                  onClose={() => setError(null)} 
                />
              )}

              {/* Loading State */}
              {analysisMutation.isPending && (
                <Loading message="Analyzing your medical image with AI..." />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Results */}
              {analysisResult ? (
                <ResultCard result={analysisResult} />
              ) : (
                <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
                  <Scan className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-gray-600">
                    {MEDICAL_CONSTANTS.MESSAGES.UPLOAD_PROMPT}
                  </p>
                </div>
              )}

              {/* Telemedicine */}
              <TelemedicineButton />
            </div>
          </div>

          {/* Analysis History Section */}
          <AnalysisHistory history={MOCK_DATA.ANALYSIS_RESULTS} />

          {/* Full Width Charts Section */}
          {analysisResult && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <ProgressionChart 
                title="Disease Risk Progression"
                data={generateProgressionData(analysisResult, MOCK_DATA.PROGRESSION_DATA)}
              />
              
              <ProgressionChart 
                title="Treatment Response"
                data={MOCK_DATA.TREATMENT_RESPONSE}
              />
            </div>
          )}

          {/* Footer Information */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Important Medical Disclaimer</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  AURA Seer is an AI-powered medical analysis tool designed to assist healthcare 
                  professionals and provide preliminary insights. This platform should not be used 
                  as a substitute for professional medical diagnosis, treatment, or advice. Always 
                  consult with qualified healthcare providers for proper medical evaluation and care. 
                  The AI analysis results are for informational and educational purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
