import { readFileSync } from "fs";
import fetch from "node-fetch"; // For Node <18

async function askMedGemma({ systemPrompt, prompt, history, imagePath }) {
  let images = [];

  if (imagePath) {
    const imageBase64 = readFileSync(imagePath, { encoding: "base64" });
    images = [imageBase64];
  }

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "hf.co/unsloth/medgemma-4b-it-GGUF:Q4_K_M",
      stream: false,
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nMake sure the response is ONLY valid JSON with no extra text.`
        },
        {
          role: "user",
          content: `History: ${history}\n\nQuestion: ${prompt}`
        }
      ],
      images: images[0]
    })
  });

  const result = await response.json();

  // Directly use the parsed result
  if (!result.message || !result.message.content) {
    console.error("❌ Invalid response format from AI:");
    console.error(result);
    return null;
  }

  console.log("✅ Parsed AI Response:", result.message.content);
  return result.message.content;
}

// Example usage
const system_prompt = `
You are a trained medical professional providing early advice to patients.
You must ALWAYS analyze the provided image if an image is present.
- If the image is unreadable or irrelevant, set "flag" to "no" and explain why in "Answer".
- If the image is analyzed, set "flag" to "yes" and include findings in "Answer".

The output must strictly follow this JSON format:
{
  "flag": "yes" or "no",
  "Answer": [Analysis of the situation, including details from the image if flag=yes],
  "Steps": [list of actionable steps to be followed],
  "Recommendations": [list of recommendations for the patient],
  "DRP": [[percentage, month]],
  "Urgency": one of ["Low", "Medium", "High"],
  "Recommended_specialist": one of ["Eye_Specialist", "General_Physician"]
}

Ensure the response is ONLY valid JSON with no extra text or explanations.
`;


const prompt = "Does my eye show sign of cataract  ?";
const history = "";

askMedGemma({
  systemPrompt: system_prompt,
  prompt,
  history,
  imagePath: "src/eye_scan.jpg" // 👈 replace with your image path
});
