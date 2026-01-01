
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, ChatMessage, Language } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeCropImage = async (base64Image: string, lang: Language = 'en'): Promise<AnalysisResult> => {
  const ai = getAI();

  const systemInstruction = `
    You are an expert agronomist and plant pathologist. 
    Analyze the provided image of a crop or plant.
    1. Identify the crop type.
    2. Determine its health status (Healthy or Diseased).
    3. If diseased, identify the disease and symptoms.
    4. Provide specific, actionable recommendations for treatment and preventative measures.
    
    IMPORTANT: You must respond in the following language: ${lang}.
    Always return your analysis in a structured JSON format matching the schema provided.
  `;

  const prompt = "Analyze this crop image and provide a detailed health report.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          healthStatus: { type: Type.STRING, enum: ['Healthy', 'Diseased', 'Unknown'] },
          confidence: { type: Type.NUMBER },
          diseaseName: { type: Type.STRING },
          symptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cause: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          preventativeMeasures: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['cropName', 'healthStatus', 'confidence', 'recommendations', 'preventativeMeasures'],
      },
    },
  });

  // Extract text directly from the response object's .text property
  const text = response.text;
  if (!text) {
    throw new Error("No analysis data received from the AI.");
  }

  return JSON.parse(text.trim()) as AnalysisResult;
};

export const chatWithGemini = async (messages: ChatMessage[], lang: Language = 'en'): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: messages.map(m => ({
      role: m.role,
      parts: m.parts
    })),
    config: {
      systemInstruction: `You are AgroVision AI Assistant. You help with agriculture and plant health. 
      Respond in ${lang}. Be concise and professional.`
    }
  });
  // Extract text directly from the response object's .text property
  return response.text || "I couldn't process that request.";
};
