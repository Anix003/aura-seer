import { useMutation, useQuery } from "@tanstack/react-query";
import { medicalApi } from "@/services/medicalApi";

export function useAnalyzeImage() {
  return useMutation({
    mutationFn: medicalApi.analyzeImage,
    onError: (error) => {
      console.error("Image analysis failed:", error);
    },
  });
}

export function usePatientHistory(patientId, options = {}) {
  return useQuery({
    queryKey: ["patientHistory", patientId],
    queryFn: () => medicalApi.getPatientHistory(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

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