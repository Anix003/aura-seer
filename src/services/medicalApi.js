export const medicalApi = {
  analyzeImage: async ({ imageFile, symptoms }) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    if (symptoms) {
      formData.append("symptoms", symptoms);
    }

    const response = await fetch("/api/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  },

  getPatientHistory: async (patientId) => {
    const response = await fetch(`/api/patients/${patientId}/history`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch patient history: ${response.statusText}`);
    }
    
    return response.json();
  },

  saveAnalysis: async (analysisData) => {
    const response = await fetch("/api/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analysisData),
    });

    if (!response.ok) {
      throw new Error(`Failed to save analysis: ${response.statusText}`);
    }

    return response.json();
  },
};