import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Define the schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A concise 2-3 sentence summary of the call." },
    transcript: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, description: "Identify as 'Salesperson' or 'Prospect'" },
          text: { type: Type.STRING },
          timestamp: { type: Type.STRING, description: "Time format MM:SS" },
        },
        required: ["speaker", "text", "timestamp"],
      },
    },
    sentimentGraph: {
      type: Type.ARRAY,
      description: "10-15 data points representing engagement throughout the call",
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: "Label for the x-axis, e.g., 'Start', 'Discovery', 'Closing' or MM:SS" },
          engagement: { type: Type.INTEGER, description: "0-100 score of engagement/sentiment" },
        },
        required: ["time", "engagement"],
      },
    },
    coaching: {
      type: Type.OBJECT,
      properties: {
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 specific things the salesperson did well",
        },
        missedOpportunities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 specific areas for improvement",
        },
      },
      required: ["strengths", "missedOpportunities"],
    },
  },
  required: ["summary", "transcript", "sentimentGraph", "coaching"],
};

export const analyzeAudio = async (base64Audio: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not set in the environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `Analyze this sales call audio recording. 
            
            Perform the following tasks:
            1. Generate a diarized transcript distinguishing between the 'Salesperson' and the 'Prospect'.
            2. Analyze the sentiment and engagement levels throughout the call to generate data for a line graph.
            3. Create a coaching card with 3 key strengths and 3 missed opportunities for the salesperson.
            4. Write a brief summary of the call.
            
            Return the result in valid JSON format matching the provided schema.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Lower temperature for more factual transcription
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI service.");
    }

    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};