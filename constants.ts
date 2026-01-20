import { PresetType, SnowConfig } from './types';

export const PRESETS: Record<PresetType, SnowConfig> = {
  [PresetType.CALM]: {
    particleCount: 150,
    baseSpeed: 1.5,
    windSensitivity: 0.5,
    sizeMultiplier: 1.0,
    opacity: 0.8,
  },
  [PresetType.HEAVY]: {
    particleCount: 500,
    baseSpeed: 3.0,
    windSensitivity: 1.0,
    sizeMultiplier: 1.2,
    opacity: 0.9,
  },
  [PresetType.BLIZZARD]: {
    particleCount: 1200,
    baseSpeed: 6.0,
    windSensitivity: 2.5,
    sizeMultiplier: 0.8,
    opacity: 0.7,
  },
  [PresetType.CUSTOM]: {
    particleCount: 300,
    baseSpeed: 2.0,
    windSensitivity: 1.0,
    sizeMultiplier: 1.0,
    opacity: 0.8,
  },
};
