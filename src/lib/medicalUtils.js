import { MEDICAL_CONSTANTS } from "./constants";

/**
 * Validates uploaded medical image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateMedicalImage(file) {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  // Check file type
  if (!MEDICAL_CONSTANTS.ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: MEDICAL_CONSTANTS.MESSAGES.INVALID_FILE_TYPE 
    };
  }

  // Check file size
  if (file.size > MEDICAL_CONSTANTS.MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: MEDICAL_CONSTANTS.MESSAGES.FILE_TOO_LARGE 
    };
  }

  return { isValid: true, error: null };
}

/**
 * Gets confidence level category based on confidence score
 * @param {number} confidence - Confidence score (0-1)
 * @returns {string} Confidence level category
 */
export function getConfidenceLevel(confidence) {
  if (confidence >= MEDICAL_CONSTANTS.CONFIDENCE_LEVELS.HIGH) return "high";
  if (confidence >= MEDICAL_CONSTANTS.CONFIDENCE_LEVELS.MEDIUM) return "medium";
  return "low";
}

/**
 * Gets appropriate color for confidence score
 * @param {number} confidence - Confidence score (0-1)
 * @returns {string} CSS color class
 */
export function getConfidenceColor(confidence) {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case "high": return "text-green-600";
    case "medium": return "text-yellow-600";
    default: return "text-red-600";
  }
}

/**
 * Formats file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generates chart data with current analysis result
 * @param {Object} analysisResult - Current analysis result
 * @param {Array} baseData - Base progression data
 * @returns {Array} Updated chart data
 */
export function generateProgressionData(analysisResult, baseData) {
  if (!analysisResult) return baseData;
  
  const updatedData = [...baseData];
  const lastEntry = updatedData[updatedData.length - 1];
  
  // Update last entry with current analysis confidence
  lastEntry.risk = Math.round(analysisResult.confidence * 100);
  lastEntry.severity = Math.round(analysisResult.confidence * 80);
  
  return updatedData;
}

/**
 * Debounce function for input handling
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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