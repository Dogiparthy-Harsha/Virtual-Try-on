import { GoogleGenAI } from "@google/genai";
import { UploadedImage } from "../types";

// Helper to clean base64 string for the API (removes the data URL prefix)
const cleanBase64 = (base64: string): string => {
  return base64.split(',')[1];
};

export const generateTryOnImage = async (
  modelImage: UploadedImage,
  garmentImage: UploadedImage
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Using gemini-2.5-flash-image for general image editing tasks as per guidelines
  // Note: For production quality try-on, specific fine-tuned models are often preferred,
  // but we are maximizing the capability of the available general purpose multimodal model.
  const model = "gemini-2.5-flash-image";

  const prompt = `
    You are an expert Virtual Try-On AI and fashion stylist.
    
    INPUTS:
    1. The first image provided is "The Model" (a person).
    2. The second image provided is "The Garment" (clothing).

    TASK:
    Generate a photorealistic image of "The Model" wearing "The Garment".

    REQUIREMENTS:
    - PRESERVE IDENTITY: The person's face, hair, body shape, and skin tone must remain exactly the same.
    - PRESERVE POSE: The person's pose and camera angle must not change.
    - PRESERVE BACKGROUND: Keep the original background from "The Model" image.
    - REALISTIC FIT: The clothing must drape naturally over the body, respecting gravity, folds, and the person's posture.
    - LIGHTING MATCH: The lighting on the clothing must match the lighting in the original photo of the person.
    
    Output ONLY the generated image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: modelImage.mimeType,
              data: cleanBase64(modelImage.base64)
            }
          },
          {
            inlineData: {
              mimeType: garmentImage.mimeType,
              data: cleanBase64(garmentImage.base64)
            }
          }
        ]
      }
    });

    // Check for image candidates
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image was generated. The model might have refused the request due to safety policies or failed to interpret the images.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate try-on image.");
  }
};