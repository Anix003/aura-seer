import { MEDICAL_CONSTANTS } from "./constants";

export function validateMedicalImage(file) {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (!MEDICAL_CONSTANTS.ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: MEDICAL_CONSTANTS.MESSAGES.INVALID_FILE_TYPE 
    };
  }

  if (file.size > MEDICAL_CONSTANTS.MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: MEDICAL_CONSTANTS.MESSAGES.FILE_TOO_LARGE 
    };
  }

  return { isValid: true, error: null };
}

export function getConfidenceLevel(confidence) {
  if (confidence >= MEDICAL_CONSTANTS.CONFIDENCE_LEVELS.HIGH) return "high";
  if (confidence >= MEDICAL_CONSTANTS.CONFIDENCE_LEVELS.MEDIUM) return "medium";
  return "low";
}

export function getConfidenceColor(confidence) {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case "high": return "text-green-600";
    case "medium": return "text-yellow-600";
    default: return "text-red-600";
  }
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function generateProgressionData(analysisResult, baseData) {
  if (!analysisResult) return baseData;
  
  const updatedData = baseData.map(entry => ({ ...entry }));
  const lastEntry = updatedData[updatedData.length - 1];
  
  lastEntry.risk = Math.round(analysisResult.confidence * 100);
  lastEntry.severity = Math.round(analysisResult.confidence * 80);
  
  return updatedData;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}