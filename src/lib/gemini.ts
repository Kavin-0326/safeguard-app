import { GoogleGenAI } from "@google/genai";
import { SafetyInputs, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAIInsights(inputs: SafetyInputs, riskLevel: RiskLevel, ruleExplanation: string) {
  if (!process.env.GEMINI_API_KEY) {
    return "AI insights are currently unavailable (API key missing).";
  }

  const prompt = `
    You are a professional industrial safety expert AI. 
    A safety risk assessment was performed with the following data:
    - Temperature: ${inputs.temperature}°C
    - Gas Level: ${inputs.gasLevel} ppm
    - Noise Level: ${inputs.noiseLevel} dB
    - Worker Density: ${inputs.workerDensity}
    - Worker Speed: ${inputs.workerSpeed} m/s

    The rule-based system determined the risk level as: ${riskLevel}.
    Rule-based explanation: ${ruleExplanation}

    Please provide a professional and concise AI safety insight. 
    - If the risk is High, provide urgent and clear safety steps.
    - If Moderate, provide cautious recommendations.
    - If Safe, provide a brief positive confirmation and safety reminder.
    
    Keep the response professional, technical, and suitable for an industrial dashboard.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Failed to generate AI insights. Please check safety protocols manually.";
  }
}
