"use client";

import { createContext, useContext, useState } from "react";

const MedicalContext = createContext();

export function useMedical() {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error("useMedical must be used within a MedicalProvider");
  }
  return context;
}

export function MedicalProvider({ children }) {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Custom function to clear image and related data
  const clearImageAndResults = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <MedicalContext.Provider
      value={{
        analysisResult,
        setAnalysisResult,
        uploadedImage,
        setUploadedImage,
        symptoms,
        setSymptoms,
        isAnalyzing,
        setIsAnalyzing,
        clearImageAndResults,
      }}
    >
      {children}
    </MedicalContext.Provider>
  );
}