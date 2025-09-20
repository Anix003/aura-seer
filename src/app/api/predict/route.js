// Mock API endpoint for testing
// In a real implementation, this would connect to your MedGemma backend

import { MOCK_DATA } from "@/lib/constants";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const symptoms = formData.get("symptoms");

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use mock results from constants
    const result = MOCK_DATA.ANALYSIS_RESULTS[
      Math.floor(Math.random() * MOCK_DATA.ANALYSIS_RESULTS.length)
    ];

    return Response.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Internal server error during image analysis" },
      { status: 500 }
    );
  }
}