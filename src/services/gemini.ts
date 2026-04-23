import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysisResult } from "../types/analysis";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeSkin(base64Image: string, mimeType: string): Promise<SkinAnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `You are a professional AI dermatology assistant. Analyze this skin/face image and return a detailed assessment. 
Be compassionate, professional, and accurate. 
Disclaimer: Always include a medical disclaimer that this is not a substitute for professional advice.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skin_type: { type: Type.STRING, description: "Oily/Dry/Combination/Normal/Sensitive" },
          skin_tone: { type: Type.STRING, description: "Fair/Light/Medium/Olive/Tan/Deep" },
          hydration: { type: Type.STRING, description: "Dehydrated/Normal/Well-hydrated" },
          overall_score: { type: Type.NUMBER, description: "0-100 for overall skin health" },
          summary: { type: Type.STRING, description: "2-3 sentence summary" },
          concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["name", "reason"]
            }
          },
          morning_routine: { type: Type.ARRAY, items: { type: Type.STRING } },
          night_routine: { type: Type.ARRAY, items: { type: Type.STRING } },
          lifestyle_tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: [
          "skin_type", "skin_tone", "hydration", "overall_score", 
          "summary", "concerns", "ingredients", 
          "morning_routine", "night_routine", "lifestyle_tips"
        ]
      }
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate analysis result.");
  }

  return JSON.parse(text) as SkinAnalysisResult;
}
