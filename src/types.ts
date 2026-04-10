export interface SafetyInputs {
  temperature: number;
  gasLevel: number;
  noiseLevel: number;
  workerDensity: number;
  workerSpeed: number;
}

export type RiskLevel = 'Safe' | 'Moderate Risk' | 'High Risk';

export interface AssessmentResult {
  riskLevel: RiskLevel;
  explanation: string;
  aiInsights?: string;
}
