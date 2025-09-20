// Mock API endpoint for testing
// In a real implementation, this would connect to your MedGemma backend
import { createPrompt } from "@/services/createPrompt";
import { parseResponse } from "@/services/parseResponse";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const symptoms = formData.get("symptoms");

    let imageBase64 = null;
    if (image) {
      const imageBuffer = await image.arrayBuffer();
      imageBase64 = Buffer.from(imageBuffer).toString("base64");
    }

    const prompt = createPrompt(imageBase64, symptoms);
    console.log("Generated Prompt:", prompt);

    const response = await fetch("http://localhost:11434/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "medgemma", // adjust model name as needed
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    const medGemmaResult = await response.json();

    if (!response.ok) {
      throw new Error(`MedGemma API error: ${response.status}`);
    }
    
    console.log("MedGemma Response:", medGemmaResult);
    const structuredOutput = parseResponse(medGemmaResult);
    console.log("Structured Output:", structuredOutput);

    return Response.json(structuredOutput, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Internal server error during image analysis" },
      { status: 500 }
    );
  }
}
