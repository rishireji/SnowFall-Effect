export interface SnowConfig {
  particleCount: number;
  baseSpeed: number;
  windSensitivity: number;
  sizeMultiplier: number;
  opacity: number;
}

export enum PresetType {
  CALM = 'CALM',
  BLIZZARD = 'BLIZZARD',
  HEAVY = 'HEAVY',
  CUSTOM = 'CUSTOM'
}

export interface GeneratedContent {
  headline: string;
  body: string;
  tags: string[];
}
