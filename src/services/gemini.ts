import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysisResult } from "../types/analysis";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "DEMO_KEY" });

export async function analyzeSkin(base64Image: string, mimeType: string): Promise<SkinAnalysisResult> {
  // If no API key is provided, return a high-quality simulated assessment
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
    console.warn("No GEMINI_API_KEY detected. Entering Simulation Mode.");
    
    // Artificial latency to simulate neural processing
    await new Promise(resolve => setTimeout(resolve, 3500));

    return {
      overall_score: 82,
      skin_type: "Combination (Oily T-Zone)",
      skin_tone: "Type II (Fair/Light)",
      hydration: "64% - Moderate",
      summary: "Simulation Result: Your skin displays healthy barrier function with minor localized congestion in the forehead region and subtle dehydration lines near the ocular area.",
      concerns: ["T-Zone Congestion", "Subtle Sun Damage (UV-1)", "Dehydration Lines"],
      ingredients: [
        { name: "Niacinamide (5%)", reason: "Regulates sebum production in the T-zone while strengthening the moisture barrier." },
        { name: "Hyaluronic Acid", reason: "Provides deep hydration to address localized dryness without clogging pores." },
        { name: "Broad Spectrum SPF 50", reason: "Essential for protecting the light skin tone from further UV-induced oxidative stress." }
      ],
      morning_routine: [
        "Gentle pH-balanced Cleanser",
        "Vitamin C Serum (L-Ascorbic Acid)",
        "Oil-free Moisturizer with Sunscreen"
      ],
      night_routine: [
        "Double Cleanse (Oil then Water base)",
        "Niacinamide Treatment",
        "Lightweight Barrier Restoration Cream"
      ],
      lifestyle_tips: [
        "Increase water intake (approx. 2.5L/day) to improve systemic hydration.",
        "Ensure 7-9 hours of restorative sleep to facilitate epidermal repair.",
        "Limit direct sun exposure between 10 AM and 4 PM."
      ]
    };
  }

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
