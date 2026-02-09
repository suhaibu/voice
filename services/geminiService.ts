
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { Emotion, VoiceSettings } from "../types";
import { decode, decodeAudioData } from "./audioUtils";

const API_KEY = process.env.API_KEY || "";

export const generateSpeech = async (
  text: string,
  voiceName: string,
  settings: VoiceSettings
): Promise<AudioBuffer> => {
  if (!API_KEY) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Enrich the prompt with emotion and instructions for Arabic
  const intensityMap: Record<number, string> = {
    0: "quietly",
    25: "softly",
    50: "",
    75: "distinctly",
    100: "very strongly"
  };

  const level = settings.emotionLevel;
  const intensityAdverb = intensityMap[Math.floor(level / 25) * 25] || "";
  
  // Construct a prompt that guides the model on tone
  const prompt = `Act as a professional Arabic voice artist. 
    Tone: ${settings.emotion} ${intensityAdverb}. 
    Style: Speak clearly, respect Arabic diacritics (Tashkeel) if present, and maintain appropriate pauses.
    Text to speak: ${text}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName as any },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned from API");
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000
    });
    
    const audioData = decode(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
    
    return audioBuffer;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};
