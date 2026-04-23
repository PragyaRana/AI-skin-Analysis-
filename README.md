# GlowAI — AI Skin Analysis

GlowAI is a professional-grade skin analysis application powered by Google's Gemini 1.5 Flash. It provides users with instant, detailed insights into their skin health, including skin type, tone, hydration levels, and specific concerns, followed by a personalized morning and night skincare routine.

## ✨ Features

- **Instant Image Analysis**: Upload a clear selfie or a close-up of a skin area for analysis.
- **Detailed Metrics**: Get an overall skin health score (0-100) and scannable metrics.
- **Concern Detection**: Scientifically-grounded identification of common skin issues.
- **Custom Routines**: Morning and night skincare steps designed specifically for your results.
- **Privacy First**: Analysis is performed on-device via API; no images are stored permanently.

## 🚀 Getting Started

### Prerequisites

- A **Google Gemini API Key**. You can get one for free at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

### Installation

1. **Set up the API Key**:
   - In AI Studio, look for the **Secrets** or **Environment Variables** panel.
   - Add a new secret with the name `GEMINI_API_KEY` and paste your key.
   - Restart the development server if prompted.

2. **Run the App**:
   - The app runs automatically in the preview window.
   - To run locally (if exported):
     ```bash
     npm install
     npm run dev
     ```

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **AI**: Google Gemini 1.5 Flash (@google/genai)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (`motion/react`)
- **Icons**: Lucide React

## ⚕️ Disclaimer

GlowAI is for informational purposes only. It is not a substitute for professional dermatological advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
