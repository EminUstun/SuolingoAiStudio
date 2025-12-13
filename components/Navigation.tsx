
import React from 'react';
import { AppScreen } from '../types';
import { Home, Mic, Speaker, BookOpen, History, Settings, FileText } from 'lucide-react';

interface NavigationProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: AppScreen.HOME, icon: Home, label: 'Home' },
    { id: AppScreen.TTS, icon: Speaker, label: 'TTS' },
    { id: AppScreen.STT, icon: Mic, label: 'STT' },
    { id: AppScreen.WORD, icon: BookOpen, label: 'Words' },
    { id: AppScreen.NOTEBOOK, icon: FileText, label: 'Notebook' },
    { id: AppScreen.HISTORY, icon: History, label: 'History' },
    { id: AppScreen.SETTINGS, icon: Settings, label: 'Avatar' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 pb-6 pt-3 px-4 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'text-pink-400 bg-white/10 scale-110' : 'text-slate-400 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;
