import React from 'react';
import { SnowConfig, PresetType } from '../types';
import { PRESETS } from '../constants';
import { Settings2, X, Wind, Snowflake, ThermometerSnowflake } from 'lucide-react';

interface ControlPanelProps {
  config: SnowConfig;
  setConfig: (config: SnowConfig) => void;
  isOpen: boolean;
  onClose: () => void;
  currentPreset: PresetType;
  setPreset: (p: PresetType) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  config, 
  setConfig, 
  isOpen, 
  onClose,
  currentPreset,
  setPreset
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof SnowConfig, value: number) => {
    setConfig({ ...config, [key]: value });
    setPreset(PresetType.CUSTOM);
  };

  return (
    <div className="fixed top-4 right-4 z-[60] w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white overflow-hidden animate-fade-in-down">
      <div className="p-4 bg-white/5 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-blue-200" />
          <h2 className="font-semibold text-sm tracking-wide">Engine Configuration</h2>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Presets */}
        <div className="grid grid-cols-3 gap-2">
          {[PresetType.CALM, PresetType.HEAVY, PresetType.BLIZZARD].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setPreset(preset);
                setConfig(PRESETS[preset]);
              }}
              className={`text-xs py-2 px-3 rounded-lg border transition-all ${
                currentPreset === preset
                  ? 'bg-blue-500/30 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {preset.charAt(0) + preset.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1"><Snowflake size={12}/> Intensity</span>
              <span>{config.particleCount}</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={config.particleCount}
              onChange={(e) => handleChange('particleCount', parseInt(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1"><Wind size={12}/> Wind Sensitivity</span>
              <span>{(config.windSensitivity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={config.windSensitivity}
              onChange={(e) => handleChange('windSensitivity', parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1"><ThermometerSnowflake size={12}/> Speed</span>
              <span>{config.baseSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={config.baseSpeed}
              onChange={(e) => handleChange('baseSpeed', parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300"
            />
          </div>

           <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1">Size</span>
              <span>{config.sizeMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={config.sizeMultiplier}
              onChange={(e) => handleChange('sizeMultiplier', parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300"
            />
          </div>

        </div>

        <div className="text-[10px] text-gray-400 text-center pt-2 border-t border-white/10">
          Move your mouse horizontally to influence wind direction.
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
