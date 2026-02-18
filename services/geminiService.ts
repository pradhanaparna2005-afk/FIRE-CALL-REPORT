import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateFireReportAids(keywords: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these keywords, generate a professional fire incident description and a probable cause for an official report: "${keywords}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: {
            type: Type.STRING,
            description: "A formal 2-3 sentence description of the incident."
          },
          cause: {
            type: Type.STRING,
            description: "A formal 1-2 sentence probable cause based on the keywords."
          }
        },
        required: ["description", "cause"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("AI response was empty.");
  }
  return JSON.parse(text);
}