import { useMutation, useQuery } from "@tanstack/react-query";
import { medicalApi } from "@/services/medicalApi";

/**
 * React Query hook for medical image analysis
 * @returns {Object} Mutation object with mutate, isPending, error, data
 */
export function useAnalyzeImage() {
  return useMutation({
    mutationFn: medicalApi.analyzeImage,
    onError: (error) => {
      console.error("Image analysis failed:", error);
    },
  });
}

/**
 * React Query hook for fetching patient history
 * @param {string} patientId - Patient identifier
 * @param {Object} options - Query options
 * @returns {Object} Query object with data, isLoading, error
 */
export function usePatientHistory(patientId, options = {}) {
  return useQuery({
    queryKey: ["patientHistory", patientId],
    queryFn: () => medicalApi.getPatientHistory(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * React Query hook for saving analysis results
 * @returns {Object} Mutation object for saving analysis
 */
export function useSaveAnalysis() {
  return useMutation({
    mutationFn: medicalApi.saveAnalysis,
    onSuccess: (data) => {
      console.log("Analysis saved successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to save analysis:", error);
    },
  });
}