import React, { useState } from 'react';
import SnowOverlay from './components/SnowOverlay';
import ControlPanel from './components/ControlPanel';
import DemoContent from './components/DemoContent';
import InstallModal from './components/InstallModal';
import { PRESETS } from './constants';
import { PresetType, SnowConfig } from './types';
import { Snowflake, Download } from 'lucide-react';

const App: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<PresetType>(PresetType.CALM);
  const [config, setConfig] = useState<SnowConfig>(PRESETS[PresetType.CALM]);

  const toggleEngine = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* The "Target" Website Content */}
      <DemoContent />

      {/* The Magic Layer */}
      <SnowOverlay active={isActive} config={config} />

      {/* Header / Install Button (Absolute positioned to sit on top of demo content) */}
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="flex items-center gap-2 bg-white/80 backdrop-blur text-gray-800 px-4 py-2 rounded-full shadow-lg border border-white/50 text-sm font-semibold hover:bg-white transition-all transform hover:scale-105"
        >
          <Download size={16} className="text-blue-600" />
          Install on Browser
        </button>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 items-end">
        
        {/* Toggle Panel Button */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={`h-12 w-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
             isPanelOpen 
               ? 'bg-gray-800 text-white rotate-90' 
               : 'bg-white text-gray-800 hover:bg-gray-50'
          }`}
          title="Configure Engine"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </button>

        {/* Main Activation Button */}
        <button
          onClick={toggleEngine}
          className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
            isActive 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/50' 
              : 'bg-gray-200 text-gray-400 grayscale'
          }`}
          title={isActive ? "Stop Snow" : "Start Snow"}
        >
          <Snowflake 
            size={24} 
            className={`transition-transform duration-700 ${isActive ? 'animate-[spin_3s_linear_infinite]' : ''}`} 
          />
        </button>
      </div>

      {/* Configuration Panel */}
      <ControlPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)}
        config={config} 
        setConfig={setConfig}
        currentPreset={currentPreset}
        setPreset={setCurrentPreset}
      />
      
      {/* Install Modal */}
      <InstallModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
      />
      
    </div>
  );
};

export default App;
