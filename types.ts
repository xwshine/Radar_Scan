
export type TargetType = 'Civilian' | 'Military' | 'UAV' | 'Unknown';

export interface Target {
  id: string;
  x: number; // -1 to 1 (normalized coordinates)
  y: number; // -1 to 1 (normalized coordinates)
  velocity: number; // units per frame
  angle: number; // movement direction in radians
  altitude: number; // in meters
  speed: number; // in km/h (visual representation)
  type: TargetType;
  history: { x: number; y: number }[];
  detected: boolean;
  threatLevel: 'Low' | 'Medium' | 'High';
}

export interface RadarState {
  sweepAngle: number;
  targets: Target[];
  isScanning: boolean;
  scanSpeed: number;
  range: number; // in km
}

export interface AiAnalysis {
  summary: string;
  threatScore: number;
  recommendations: string[];
}
