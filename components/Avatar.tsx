import React, { useRef, useEffect } from 'react';
import { AvatarConfig, AvatarState } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  state: AvatarState;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Avatar: React.FC<AvatarProps> = ({ config, state, size = 'md' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
    '2xl': 'w-80 h-80',
  };

  const getContainerClass = () => {
    let base = `relative rounded-full overflow-hidden border-4 transition-all duration-300 ${sizeClasses[size]} `;
    // Removed animate-bounce and animate-float. We want the avatar to be stable.
    
    if (state === AvatarState.SPEAKING) base += 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] ';
    else if (state === AvatarState.LISTENING) base += 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)] ';
    else if (state === AvatarState.THINKING) base += 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)] ';
    else if (state === AvatarState.HAPPY) base += 'border-green-400 ';
    else if (state === AvatarState.SAD) base += 'border-red-400 ';
    else base += 'border-white/20 ';
    
    return base;
  };

  // Autoplay video when state becomes SPEAKING
  useEffect(() => {
    if (config.type === 'CUSTOM' && config.customVideoUrl && videoRef.current) {
      if (state === AvatarState.SPEAKING) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [state, config.customVideoUrl]);

  const renderContent = () => {
    // Custom Photo / Video
    if (config.type === 'CUSTOM' && config.customImage) {
      const isSpeaking = state === AvatarState.SPEAKING;
      const hasVideo = !!config.customVideoUrl;

      return (
        <div className="w-full h-full relative bg-slate-800">
           {/* If we have a video and are speaking, show video on top */}
           {hasVideo && (
             <video 
               ref={videoRef}
               src={config.customVideoUrl}
               className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-200 ${
                 isSpeaking ? 'opacity-100' : 'opacity-0'
               }`}
               loop
               muted
               playsInline
             />
           )}

           <img 
            src={config.customImage} 
            alt="User Avatar" 
            className={`w-full h-full object-cover transition-transform duration-100 ${
                // If speaking and NO video, use the CSS animation
                isSpeaking && !hasVideo ? 'animate-talking-head' : ''
            }`}
          />
          
          {/* Subtle pulse for image when speaking if NO video is available yet */}
          {isSpeaking && !hasVideo && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
        </div>
      );
    }

    // SVG Presets
    const isFemale = config.type === 'PRESET_2';
    
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full bg-indigo-100" xmlns="http://www.w3.org/2000/svg">
         {/* Background / Skin */}
        <circle cx="100" cy="100" r="90" fill={isFemale ? "#FDB" : "#ECC"} />
        
        {/* Hair */}
        {isFemale ? (
             <path d="M20 100 C 20 20 180 20 180 100 L 180 180 L 160 180 L 160 120 C 160 120 40 120 40 120 L 40 180 L 20 180 Z" fill="#4A2C2A" />
        ) : (
             <path d="M30 80 C 30 20 170 20 170 80 C 170 100 160 90 160 70 L 40 70 C 40 90 30 100 30 80" fill="#333" />
        )}

        {/* Eyes */}
        <g className={state === AvatarState.LISTENING ? "animate-pulse" : ""}>
            <circle cx="70" cy="90" r="10" fill="#333" />
            <circle cx="130" cy="90" r="10" fill="#333" />
             {/* Blink eyelids */}
             {state === AvatarState.IDLE && (
                 <rect x="50" y="80" width="100" height="20" fill={isFemale ? "#FDB" : "#ECC"} className="opacity-0 animate-[pulse_4s_infinite]" />
             )}
        </g>

        {/* Eyebrows */}
        {state === AvatarState.THINKING ? (
            <g stroke="#333" strokeWidth="4" fill="none">
                 <path d="M60 75 Q 70 65 80 75" />
                 <path d="M120 65 Q 130 55 140 65" />
            </g>
        ) : (
            <g stroke="#333" strokeWidth="4" fill="none">
                 <path d="M60 70 Q 70 65 80 70" />
                 <path d="M120 70 Q 130 65 140 70" />
            </g>
        )}

        {/* Mouth */}
        <g transform="translate(100, 130)">
            {state === AvatarState.SPEAKING ? (
                 // Realistic mouth opening/closing animation for SVG
                 <path fill="#A44">
                    <animate attributeName="d" 
                      values="M-20 0 Q 0 0 20 0 Q 0 0 -20 0; M-20 0 Q 0 15 20 0 Q 0 20 -20 0; M-20 0 Q 0 0 20 0 Q 0 0 -20 0" 
                      dur="0.3s" 
                      repeatCount="indefinite" />
                 </path>
            ) : state === AvatarState.HAPPY ? (
                 <path d="M-20 -5 Q 0 15 20 -5" stroke="#333" strokeWidth="4" fill="none" />
            ) : state === AvatarState.SAD ? (
                 <path d="M-20 10 Q 0 -10 20 10" stroke="#333" strokeWidth="4" fill="none" />
            ) : (
                 <path d="M-15 0 L 15 0" stroke="#333" strokeWidth="4" />
            )}
        </g>

        {/* Accessories */}
        {state === AvatarState.LISTENING && (
            <path d="M180 80 C 200 80 200 120 180 120" fill="none" stroke="#EC4899" strokeWidth="4" className="animate-pulse" />
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={getContainerClass()}>
        {renderContent()}
      </div>
      
      {/* Status Badge */}
      <div className="mt-4 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur text-xs font-semibold tracking-wider text-indigo-200 uppercase transition-all duration-300">
        {state === AvatarState.THINKING ? "Generating Voice..." : state}
      </div>
    </div>
  );
};

export default Avatar;