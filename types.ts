
export enum AppScreen {
  HOME = 'HOME',
  TTS = 'TTS',
  STT = 'STT',
  WORD = 'WORD',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export interface HistoryItem {
  id: string;
  type: 'TTS' | 'STT' | 'WORD';
  text: string; // The prompt, transcription, or summary
  timestamp: number;
  mediaUrl?: string; // For generated video or audio
}

export interface AvatarConfig {
  id: string;
  type: 'PRESET_1' | 'PRESET_2' | 'CUSTOM';
  voiceName?: string; // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede'
  customImage?: string; // Base64 or URL
  customVideoUrl?: string; // URL to the Veo generated speaking loop
}

export enum AvatarState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  THINKING = 'THINKING',
  HAPPY = 'HAPPY',
  SAD = 'SAD'
}

// Declaration for Web Speech API and AIStudio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    aistudio?: AIStudio;
  }
}
