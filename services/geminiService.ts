import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateWinterContent = async (): Promise<GeneratedContent> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a short, engaging news article snippet or blog post about a mysterious winter phenomenon or a cozy winter cabin retreat. Keep it under 200 words. Include a catchy headline.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING } 
            }
          },
          required: ["headline", "body", "tags"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return {
      headline: "Winter Wonderland Awaits",
      body: "Experience the magic of the season with our immersive snowfall engine. As the digital flakes descend, imagine yourself in a cozy cabin, safe from the biting cold, watching the serene dance of nature through a frosted pane. This simulation brings the chill of the arctic directly to your browser without the frostbite.",
      tags: ["#Winter", "#Tech", "#Snow"]
    };
  }
};
