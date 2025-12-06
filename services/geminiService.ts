import { GoogleGenAI, Modality } from "@google/genai";

// TTS Service
export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    
    return base64Audio;

  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

// Edit Avatar Image (Image-to-Image)
export const editAvatarImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming standard upload
              data: base64Image
            }
          },
          {
            text: `Edit this face to match this description: ${prompt}. Keep the composition similar to a portrait.`
          },
        ],
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");

  } catch (error) {
    console.error("Edit Avatar Error:", error);
    throw error;
  }
};

// Veo Video Generation
export const generateVeoVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  // Ensure Key Selection for Veo
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
       await window.aistudio.openSelectKey();
    }
  }

  // Create a new instance to pick up the potentially selected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: aspectRatio
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("No video URI returned");

    // Fetch the actual video bytes using the key
    const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoRes.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Veo Error:", error);
    throw error;
  }
};

// Veo Image-to-Video
export const generateVeoVideoFromImage = async (imageBytes: string, prompt?: string): Promise<string> => {
    // Ensure Key Selection for Veo
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
           await window.aistudio.openSelectKey();
        }
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt || "Animate this image cinematically",
            image: {
                imageBytes: imageBytes,
                mimeType: 'image/png' // Assuming PNG/JPEG, API is flexible usually
            },
            config: {
                numberOfVideos: 1,
                resolution: '1080p',
                aspectRatio: '16:9'
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("No video URI returned");

        const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const videoBlob = await videoRes.blob();
        return URL.createObjectURL(videoBlob);
    } catch (error) {
        console.error("Veo Img2Vid Error", error);
        throw error;
    }
}

// Live API Helpers (Audio utils)
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const result = reader.result as string;
        // remove data url prefix
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const pcmToWav = (pcmData: Float32Array, sampleRate: number) => {
    // Basic WAV header construction for playback download if needed
    // Not implemented fully here to save space, browser AudioContext is preferred for playback
    return null; 
};