import { readFileSync } from "fs";
import fetch from "node-fetch"; // For Node <18

async function askOllama(prompt, imagePath) {
  // Read image as base64
  const imageBase64 = readFileSync(imagePath, { encoding: "base64" });

  // Send request to Ollama
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "hf.co/unsloth/medgemma-4b-it-GGUF:Q4_K_M",
      prompt: prompt,
      images: [imageBase64], // 👈 add image(s) here
      stream: false          // set to true if you want token-by-token streaming
    })
  });

  const result = await response.json();
  console.log("AI Response:", result.response);
}

// Example usage
askOllama(
  "Describe this image in detail.",
  "src/eye_scan.jpg" // path to your local image
);
