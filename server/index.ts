import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Connect to MongoDB if URI is provided
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Skin Analysis API
  app.post("/api/analyze-skin", async (req, res) => {
    try {
      const { image } = req.body; // base64 image
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      // Remove prefix if present
      const base64Data = image.split(',')[1] || image;

      const prompt = `
        Analyze this face image for skin conditions. Be professional and supportive.
        Provide a JSON response with the following structure:
        {
          "overallScore": number (1-100),
          "acneScore": number (1-100),
          "glowScore": number (1-100),
          "hydrationScore": number (1-100),
          "youthScore": number (1-100),
          "skinAge": number,
          "issuesDetected": string[],
          "remedies": string[],
          "routine": string[],
          "diet": string[],
          "lifestyle": string[],
          "products": string[],
          "summary": string
        }
        The analysis should cover: Acne, Dark circles, Pigmentation, Dryness/Oiliness, Redness, Wrinkles/Fine lines, and Pores.
        Return ONLY the JSON object.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg",
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from text (sometimes Gemini wraps it in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
         throw new Error("Failed to parse AI response");
      }
      
      const analysisData = JSON.parse(jsonMatch[0]);
      res.json(analysisData);
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze skin" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      root: path.join(process.cwd(), 'client'),
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'client/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
