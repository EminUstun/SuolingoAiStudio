
import React, { useState, useEffect, useRef } from 'react';
import { AppScreen, AvatarConfig, AvatarState, HistoryItem } from './types';
import Navigation from './components/Navigation';
import Avatar from './components/Avatar';
import { generateSpeech, generateVeoVideoFromImage, blobToBase64, editAvatarImage } from './services/geminiService';
import { Mic, Play, Square, Upload, Loader2, Sparkles, Speaker, Wand2, Film, Check, Music, Volume2, BookOpen, MoveRight, MoveLeft } from 'lucide-react';

// --- Data: Word List ---
const WORD_LIST = [
  { word: "Serendipity", meaning: "The occurrence of events by chance in a happy or beneficial way.", turkish: "Şans eseri güzel bir şey bulma" },
  { word: "Ephemeral", meaning: "Lasting for a very short time.", turkish: "Kısa ömürlü, geçici" },
  { word: "Resilience", meaning: "The capacity to recover quickly from difficulties.", turkish: "Direnç, esneklik" },
  { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing.", turkish: "Güzel konuşan, hitabeti güçlü" },
  { word: "Inevitable", meaning: "Certain to happen; unavoidable.", turkish: "Kaçınılmaz" },
  { word: "Melancholy", meaning: "A feeling of pensive sadness, typically with no obvious cause.", turkish: "Melankoli, hüzün" },
  { word: "Nostalgia", meaning: "A sentimental longing for the past.", turkish: "Geçmişe özlem" },
  { word: "Paradox", meaning: "A situation, person, or thing that combines contradictory features.", turkish: "Paradoks, çelişki" },
  { word: "Pragmatic", meaning: "Dealing with things sensibly and realistically.", turkish: "Pratik, faydacı" },
  { word: "Quintessential", meaning: "Representing the most perfect or typical example of a quality or class.", turkish: "Mükemmel örnek, öz" },
  { word: "Ubiquitous", meaning: "Present, appearing, or found everywhere.", turkish: "Her yerde bulunan" },
  { word: "Vivid", meaning: "Producing powerful feelings or strong, clear images in the mind.", turkish: "Canlı, parlak" },
  { word: "Whimsical", meaning: "Playfully quaint or fanciful, especially in an appealing and amusing way.", turkish: "Garip ama hoş, kaprisli" },
  { word: "Zealous", meaning: "Having or showing zeal; passionate.", turkish: "Gayretli, şevkli" },
  { word: "Benevolent", meaning: "Well meaning and kindly.", turkish: "İyiliksever" },
  { word: "Cacophony", meaning: "A harsh, discordant mixture of sounds.", turkish: "Ses kirliliği, kakofoni" },
  { word: "Debate", meaning: "A formal discussion on a particular topic.", turkish: "Tartışma" },
  { word: "Eclipse", meaning: "An obscuring of the light from one celestial body by the passage of another.", turkish: "Tutulma" },
  { word: "Fabricate", meaning: "Invent or concoct (something), typically with deceitful intent.", turkish: "Uydurmak, üretmek" },
  { word: "Galaxy", meaning: "A system of millions or billions of stars.", turkish: "Galaksi" },
  { word: "Harmony", meaning: "The combination of simultaneously sounded musical notes to produce chords and chord progressions.", turkish: "Uyum, harmoni" },
  { word: "Iconic", meaning: "Relating to or of the nature of an icon.", turkish: "Simgeleşmiş" },
  { word: "Jubilant", meaning: "Feeling or expressing great happiness and triumph.", turkish: "Coşkulu, sevinçli" },
  { word: "Kinetic", meaning: "Relating to or resulting from motion.", turkish: "Hareketli" },
  { word: "Labyrinth", meaning: "A complicated irregular network of passages or paths.", turkish: "Labirent" },
  { word: "Magnificent", meaning: "Impressively beautiful, elaborate, or extravagant.", turkish: "Muhteşem" },
  { word: "Nebula", meaning: "A cloud of gas and dust in outer space.", turkish: "Bulutsu" },
  { word: "Oasis", meaning: "A fertile spot in a desert where water is found.", turkish: "Vaha" },
  { word: "Pannier", meaning: "A basket, bag, or box carried by a beast of burden.", turkish: "Küfe, sepet" },
  { word: "Quantum", meaning: "A discrete quantity of energy.", turkish: "Kuantum" },
  { word: "Radiant", meaning: "Sending out light; shining or glowing.", turkish: "Parlayan, ışık saçan" },
  { word: "Sabotage", meaning: "Deliberately destroy, damage, or obstruct.", turkish: "Sabotaj" },
  { word: "Tactile", meaning: "Connected with the sense of touch.", turkish: "Dokunsal" },
  { word: "Ultimate", meaning: "Being or happening at the end of a process; final.", turkish: "Nihai, son" },
  { word: "Vacant", meaning: "Having no fixtures, furniture, or inhabitants; empty.", turkish: "Boş" },
  { word: "Wanderlust", meaning: "A strong desire to travel.", turkish: "Gezme tutkusu" },
  { word: "Xenophobia", meaning: "Dislike of or prejudice against people from other countries.", turkish: "Yabancı düşmanlığı" },
  { word: "Yearn", meaning: "Have an intense feeling of longing for something.", turkish: "Hasret çekmek" },
  { word: "Zenith", meaning: "The time at which something is most powerful or successful.", turkish: "Zirve" },
  { word: "Ambition", meaning: "A strong desire to do or to achieve something.", turkish: "Hırs" },
  { word: "Bravery", meaning: "Courageous behavior or character.", turkish: "Cesaret" },
  { word: "Curiosity", meaning: "A strong desire to know or learn something.", turkish: "Merak" },
  { word: "Determination", meaning: "Firmness of purpose.", turkish: "Kararlılık" },
  { word: "Empathy", meaning: "The ability to understand and share the feelings of another.", turkish: "Empati" },
  { word: "Freedom", meaning: "The power or right to act, speak, or think as one wants.", turkish: "Özgürlük" },
  { word: "Gratitude", meaning: "The quality of being thankful.", turkish: "Minnet" },
  { word: "Honesty", meaning: "The quality of being honest.", turkish: "Dürüstlük" },
  { word: "Integrity", meaning: "The quality of being honest and having strong moral principles.", turkish: "Bütünlük, dürüstlük" },
  { word: "Justice", meaning: "Just behavior or treatment.", turkish: "Adalet" }
];

// --- Helper for Audio Context (Browser Native) ---
const playAudio = async (base64Audio: string, audioCtx: AudioContext) => {
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for(let i=0; i<int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
    }
    
    const buffer = audioCtx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
    return new Promise((resolve) => {
        source.onended = resolve;
    });
};

const App: React.FC = () => {
  // Global State
  const [screen, setScreen] = useState<AppScreen>(AppScreen.HOME);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ 
      id: '1', 
      type: 'PRESET_1',
      voiceName: 'Puck' // Default voice
  });
  const [avatarState, setAvatarState] = useState<AvatarState>(AvatarState.IDLE);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Feature State
  const [textInput, setTextInput] = useState('');
  const [sttResult, setSttResult] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);

  // Word Feature State
  const [wordHistory, setWordHistory] = useState<number[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Avatar Studio State
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isAnimatingAvatar, setIsAnimatingAvatar] = useState(false);
  
  // History Playback State
  const [playingHistoryId, setPlayingHistoryId] = useState<string | null>(null);

  // Refs
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Init Audio Context on first interaction if possible, or lazy load
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }
    
    // Set random initial word for Word Screen
    const initialIndex = Math.floor(Math.random() * WORD_LIST.length);
    setWordHistory([initialIndex]);
    setCurrentHistoryIndex(0);
  }, []);

  const addToHistory = (type: HistoryItem['type'], text: string, mediaUrl?: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: Date.now(),
      mediaUrl
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const playTTS = async (text: string) => {
    setIsLoading(true);
    setAvatarState(AvatarState.THINKING);

    try {
      const base64Audio = await generateSpeech(text, avatarConfig.voiceName);
      setAvatarState(AvatarState.SPEAKING);
      
      if (audioContextRef.current) {
          if(audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
          await playAudio(base64Audio, audioContextRef.current);
      }
      
      setAvatarState(AvatarState.HAPPY);
      setTimeout(() => setAvatarState(AvatarState.IDLE), 1000);
    } catch (err) {
      console.error(err);
      setAvatarState(AvatarState.SAD);
    } finally {
      setIsLoading(false);
    }
  };

  // --- TTS Handler ---
  const handleTTS = async () => {
    if (!textInput.trim()) return;
    await playTTS(textInput);
    addToHistory('TTS', textInput);
  };

  // --- STT Handler ---
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setAvatarState(AvatarState.IDLE);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Browser doesn't support Speech Recognition");
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US'; 
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setAvatarState(AvatarState.LISTENING);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setSttResult(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setAvatarState(AvatarState.HAPPY);
        if (sttResult) addToHistory('STT', sttResult);
        setTimeout(() => setAvatarState(AvatarState.IDLE), 2000);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // --- Word Handler ---
  const handleNextWord = () => {
      // If we are looking at history, just move forward
      if (currentHistoryIndex < wordHistory.length - 1) {
          setCurrentHistoryIndex(prev => prev + 1);
          return;
      }

      // Otherwise pick a new random word
      let newIndex = Math.floor(Math.random() * WORD_LIST.length);
      const currentIndex = wordHistory[currentHistoryIndex];
      // Try to avoid immediate duplicate
      while(newIndex === currentIndex && WORD_LIST.length > 1) {
          newIndex = Math.floor(Math.random() * WORD_LIST.length);
      }
      
      setWordHistory(prev => [...prev, newIndex]);
      setCurrentHistoryIndex(prev => prev + 1);
  };

  const handlePrevWord = () => {
      if (currentHistoryIndex > 0) {
          setCurrentHistoryIndex(prev => prev - 1);
      }
  };


  // --- Avatar Studio Handlers ---
  const handleAvatarEdit = async () => {
      if (!avatarConfig.customImage || !editPrompt) return;
      setIsEditingAvatar(true);
      
      try {
          // Extract base64 part
          const base64 = avatarConfig.customImage.split(',')[1];
          const newImage = await editAvatarImage(base64, editPrompt);
          setAvatarConfig(prev => ({
              ...prev,
              customImage: newImage,
              customVideoUrl: undefined // Reset video if image changes
          }));
          setEditPrompt('');
      } catch (err) {
          console.error(err);
          alert("Failed to edit avatar");
      } finally {
          setIsEditingAvatar(false);
      }
  };

  const handleGenerateSpeakingAvatar = async () => {
      if (!avatarConfig.customImage) return;
      setIsAnimatingAvatar(true);

      try {
           const base64 = avatarConfig.customImage.split(',')[1];
           // Preset prompt for speaking loop
           const videoUrl = await generateVeoVideoFromImage(
               base64, 
               "Close up portrait of this character speaking naturally, mouth moving, looking at camera, blinking, high quality"
           );
           
           setAvatarConfig(prev => ({
               ...prev,
               customVideoUrl: videoUrl
           }));
      } catch (err) {
          console.error(err);
          alert("Failed to generate avatar video. Ensure paid API key.");
      } finally {
          setIsAnimatingAvatar(false);
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setCustomImageFile(file);
          // Set as avatar config
          const reader = new FileReader();
          reader.onload = (ev) => {
             setAvatarConfig(prev => ({ 
                 ...prev,
                 id: 'custom', 
                 type: 'CUSTOM', 
                 customImage: ev.target?.result as string,
                 customVideoUrl: undefined // Reset previous video
             }));
          };
          reader.readAsDataURL(file);
      }
  }

  // --- History Player Handler ---
  const handlePlayHistory = async (item: HistoryItem) => {
    if (playingHistoryId) return;
    setPlayingHistoryId(item.id);

    try {
        await playTTS(item.text);
    } catch (e) {
        console.error("History Playback Error", e);
    } finally {
        setPlayingHistoryId(null);
    }
  };

  // --- Renderers ---

  const renderHome = () => (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <div className="text-center space-y-2 mt-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 tracking-tight">
          SUOLINGO
        </h1>
        <p className="text-slate-400">Master language with AI</p>
      </div>

      <div className="my-6">
        <Avatar config={avatarConfig} state={avatarState} size="xl" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => setScreen(AppScreen.TTS)} className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-110 transition">
              <Speaker size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Text to Speech</h3>
              <p className="text-xs text-slate-400">Listen to natural pronunciation</p>
            </div>
          </div>
        </button>

        <button onClick={() => setScreen(AppScreen.STT)} className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400 group-hover:scale-110 transition">
              <Mic size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Speech to Text</h3>
              <p className="text-xs text-slate-400">Practice your speaking</p>
            </div>
          </div>
        </button>

         <button onClick={() => setScreen(AppScreen.WORD)} className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400 group-hover:scale-110 transition">
              <BookOpen size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Daily Words</h3>
              <p className="text-xs text-slate-400">Learn new vocabulary</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderTTS = () => (
    <div className="p-6 flex flex-col items-center gap-8 h-full">
      <h2 className="text-2xl font-bold text-indigo-300">Text to Speech</h2>
      <Avatar config={avatarConfig} state={avatarState} size="2xl" />
      
      <div className="w-full glass-panel rounded-2xl p-4">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type something to hear it..."
          className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none h-32 text-white placeholder-slate-500"
          maxLength={500}
        />
        <div className="flex justify-between items-center text-xs text-slate-400 mt-2 border-t border-white/10 pt-2">
          <span>{textInput.length}/500</span>
          <button 
            onClick={handleTTS}
            disabled={isLoading || !textInput}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
            {isLoading ? "Generating..." : "Speak"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSTT = () => (
    <div className="p-6 flex flex-col items-center gap-8 h-full">
      <h2 className="text-2xl font-bold text-pink-300">Speech to Text</h2>
      <Avatar config={avatarConfig} state={avatarState} size="2xl" />
      
      <div className="relative">
        <button
          onClick={toggleRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50' : 'bg-pink-600 hover:bg-pink-500'
          }`}
        >
          {isRecording ? <Square size={32} fill="white" /> : <Mic size={32} />}
        </button>
      </div>
      
      <div className="w-full glass-panel min-h-[150px] rounded-2xl p-6 text-center">
        {sttResult ? (
          <p className="text-lg leading-relaxed">{sttResult}</p>
        ) : (
          <p className="text-slate-500 italic">Tap microphone and start speaking...</p>
        )}
      </div>
    </div>
  );

  const renderWord = () => {
      // Safety check
      if (wordHistory.length === 0) return null;
      
      const currentIndex = wordHistory[currentHistoryIndex];
      const item = WORD_LIST[currentIndex];
      
      return (
        <div className="p-6 flex flex-col items-center justify-start h-full gap-8 pt-12 pb-32">
             <h2 className="text-2xl font-bold text-green-300">Word Cards</h2>
             
             <div className="w-full glass-panel p-8 rounded-3xl text-center space-y-6 relative overflow-hidden group min-h-[350px] flex flex-col justify-center shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-green-500" />
                 
                 <div className="mt-4">
                     <h3 className="text-5xl font-black text-white tracking-wide mb-4">{item.word}</h3>
                     <p className="text-indigo-200 text-xl font-medium">{item.turkish}</p>
                 </div>
                 
                 <div className="border-t border-white/10 pt-6">
                     <p className="text-slate-300 italic text-lg leading-relaxed">"{item.meaning}"</p>
                 </div>
             </div>

             <div className="flex gap-4 w-full mt-auto">
                <button 
                    onClick={handlePrevWord}
                    disabled={currentHistoryIndex === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 px-6 py-4 rounded-xl font-bold transition-all"
                >
                    <MoveLeft size={20} /> Back
                </button>
                
                <button 
                    onClick={handleNextWord}
                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 rounded-xl font-bold shadow-lg shadow-green-900/50 hover:scale-105 transition-transform"
                >
                    Next Word <MoveRight size={20} />
                </button>
             </div>
        </div>
      );
  }

  const renderHistory = () => (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">History</h2>
        <button onClick={() => setHistory([])} className="text-xs text-red-400 hover:text-red-300">Clear All</button>
      </div>
      
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No history yet.</div>
        ) : (
          history.map(item => (
            <div key={item.id} className="glass-panel p-4 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                  item.type === 'TTS' ? 'bg-indigo-500/20 text-indigo-300' : 
                  item.type === 'STT' ? 'bg-pink-500/20 text-pink-300' : 
                  'bg-green-500/20 text-green-300'
                }`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
              
              <div className="flex justify-between items-center gap-3">
                  <p className="text-sm text-slate-200 flex-1">{item.text}</p>
                  
                  {(item.type === 'TTS' || item.type === 'STT') && (
                      <button 
                          onClick={() => handlePlayHistory(item)}
                          disabled={!!playingHistoryId}
                          className={`p-2 rounded-full transition-all shrink-0 ${
                              playingHistoryId === item.id 
                              ? 'bg-indigo-500 text-white' 
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                          {playingHistoryId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                      </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-6 pb-24 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-center">Avatar Studio</h2>
      
      {/* Current Avatar Preview */}
      <div className="relative group">
          <Avatar config={avatarConfig} state={AvatarState.IDLE} size="lg" />
          {avatarConfig.type === 'CUSTOM' && (
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-2 border border-white/20">
                <Wand2 size={16} />
            </div>
          )}
      </div>

      {/* Voice Selection */}
      <div className="w-full glass-panel p-4 rounded-xl space-y-3">
          <h3 className="font-semibold text-sm text-slate-300 flex items-center gap-2">
              <Music size={16} /> Voice Selection
          </h3>
          <div className="grid grid-cols-2 gap-2">
             {['Puck', 'Fenrir', 'Kore', 'Aoede'].map((voice) => (
                 <button
                    key={voice}
                    onClick={() => setAvatarConfig(prev => ({...prev, voiceName: voice}))}
                    className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all ${
                        avatarConfig.voiceName === voice 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                 >
                     <span>{voice}</span>
                     {avatarConfig.voiceName === voice && <Check size={14} />}
                 </button>
             ))}
          </div>
          <p className="text-[10px] text-slate-500">Puck/Fenrir (Male), Kore/Aoede (Female)</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <button 
          onClick={() => setAvatarConfig(prev => ({ ...prev, id: '1', type: 'PRESET_1' }))}
          className={`glass-panel p-3 rounded-xl flex flex-col items-center gap-2 ${avatarConfig.type === 'PRESET_1' ? 'border-indigo-500 bg-indigo-500/10' : ''}`}
        >
           <span className="text-sm">Male Preset</span>
        </button>

        <button 
          onClick={() => setAvatarConfig(prev => ({ ...prev, id: '2', type: 'PRESET_2' }))}
          className={`glass-panel p-3 rounded-xl flex flex-col items-center gap-2 ${avatarConfig.type === 'PRESET_2' ? 'border-pink-500 bg-pink-500/10' : ''}`}
        >
          <span className="text-sm">Female Preset</span>
        </button>
      </div>

      {/* AI Studio Controls */}
      <div className="w-full glass-panel p-4 rounded-xl space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={18} /> 
            Custom Avatar
          </h3>

          {/* 1. Upload */}
          <label className="cursor-pointer flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
             <Upload size={20} className="text-indigo-400" />
             <span className="text-sm">Upload Photo</span>
             <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>

          {avatarConfig.type === 'CUSTOM' && (
              <>
                  <div className="h-px bg-white/10 my-2" />
                  
                  {/* 2. Edit Image */}
                  <div className="space-y-2">
                      <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">AI Edit</label>
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="e.g. Make him a cyborg" 
                            className="flex-1 bg-black/20 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button 
                            onClick={handleAvatarEdit}
                            disabled={isEditingAvatar || !editPrompt}
                            className="bg-indigo-600 p-2 rounded-lg disabled:opacity-50"
                          >
                             {isEditingAvatar ? <Loader2 size={18} className="animate-spin"/> : <Wand2 size={18} />}
                          </button>
                      </div>
                  </div>

                  <div className="h-px bg-white/10 my-2" />

                  {/* 3. Generate Video Loop */}
                  <div className="space-y-2">
                      <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Animation</label>
                      <button 
                        onClick={handleGenerateSpeakingAvatar}
                        disabled={isAnimatingAvatar}
                        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                            avatarConfig.customVideoUrl 
                            ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                            : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90'
                        }`}
                      >
                         {isAnimatingAvatar ? (
                             <>
                                <Loader2 size={16} className="animate-spin"/> Generating Video (Veo)...
                             </>
                         ) : avatarConfig.customVideoUrl ? (
                             <>
                                <Film size={16} /> Speaking Loop Active
                             </>
                         ) : (
                             <>
                                <Check size={16} /> Generate Speaking Loop
                             </>
                         )}
                      </button>
                      <p className="text-[10px] text-slate-500 text-center">
                          Uses Veo model. Takes ~1 min.
                      </p>
                  </div>
              </>
          )}
      </div>
    </div>
  );

  const renderScreen = () => {
    switch(screen) {
      case AppScreen.HOME: return renderHome();
      case AppScreen.TTS: return renderTTS();
      case AppScreen.STT: return renderSTT();
      case AppScreen.WORD: return renderWord();
      case AppScreen.HISTORY: return renderHistory();
      case AppScreen.SETTINGS: return renderSettings();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-inter overflow-hidden relative selection:bg-indigo-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-lg mx-auto min-h-screen bg-black/20 shadow-2xl relative overflow-y-auto">
        {renderScreen()}
      </main>

      <Navigation currentScreen={screen} onNavigate={setScreen} />
    </div>
  );
};

export default App;
