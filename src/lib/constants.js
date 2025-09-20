// Constants for medical analysis
export const MEDICAL_CONSTANTS = {
  // File upload constraints
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/jpg", "image/png"],
  
  // Confidence thresholds
  CONFIDENCE_LEVELS: {
    HIGH: 0.8,
    MEDIUM: 0.6,
    LOW: 0.4,
  },
  
  // Chart data defaults
  DEFAULT_PROGRESSION_MONTHS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  DEFAULT_TREATMENT_WEEKS: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
  
  // UI Messages
  MESSAGES: {
    NO_IMAGE: "Please upload a medical image first.",
    ANALYSIS_SUCCESS: "Analysis completed successfully!",
    ANALYSIS_ERROR: "Failed to analyze image. Please try again.",
    FILE_TOO_LARGE: "File size must be less than 5MB.",
    INVALID_FILE_TYPE: "Please upload a JPEG or PNG image file.",
    UPLOAD_PROMPT: "Upload a medical image and click 'Analyze' to see AI-powered diagnosis and recommendations.",
  },
  
  // Query keys for React Query
  QUERY_KEYS: {
    PATIENT_HISTORY: "patientHistory",
    ANALYSIS_RESULTS: "analysisResults",
    USER_PROFILE: "userProfile",
  },
};

// Mock data for development and testing
export const MOCK_DATA = {
  PROGRESSION_DATA: [
    { month: "Jan", risk: 15, severity: 10 },
    { month: "Feb", risk: 18, severity: 12 },
    { month: "Mar", risk: 22, severity: 15 },
    { month: "Apr", risk: 28, severity: 20 },
    { month: "May", risk: 35, severity: 25 },
    { month: "Jun", risk: 42, severity: 30 },
  ],
  
  TREATMENT_RESPONSE: [
    { month: "Week 1", risk: 60, severity: 70 },
    { month: "Week 2", risk: 55, severity: 65 },
    { month: "Week 3", risk: 48, severity: 58 },
    { month: "Week 4", risk: 42, severity: 50 },
    { month: "Week 5", risk: 38, severity: 45 },
    { month: "Week 6", risk: 35, severity: 40 },
  ],
  
  ANALYSIS_RESULTS: [
    {
      diagnosis: "Pneumonia detected in right lung",
      confidence: 0.87,
      recommendation: "Immediate medical attention recommended. Consider antibiotic treatment and follow-up chest X-ray in 48-72 hours.",
      additionalInfo: "Consolidation visible in right lower lobe. Pattern consistent with bacterial pneumonia."
    },
    {
      diagnosis: "Bone fracture in radius", 
      confidence: 0.92,
      recommendation: "Orthopedic consultation recommended. Immobilization required with cast or splint.",
      additionalInfo: "Complete fracture of distal radius with minimal displacement."
    },
    {
      diagnosis: "Normal chest X-ray",
      confidence: 0.95,
      recommendation: "No immediate medical intervention required. Continue routine health monitoring.",
      additionalInfo: "Clear lung fields, normal heart size and contour."
    }
  ],
};