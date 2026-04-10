import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Thermometer, Wind, Volume2, Users, FastForward, ShieldCheck, ShieldAlert, ShieldQuestion, Loader2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SafetyInputs, AssessmentResult, RiskLevel } from '../types';
import { getAIInsights } from '../lib/gemini';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [inputs, setInputs] = useState<SafetyInputs>({
    temperature: 25,
    gasLevel: 50,
    noiseLevel: 60,
    workerDensity: 20,
    workerSpeed: 1.2,
  });

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateRisk = async () => {
    setLoading(true);
    const { temperature, gasLevel, noiseLevel, workerDensity } = inputs;

    let riskLevel: RiskLevel = 'Safe';
    let explanation = 'All parameters are within normal operating ranges.';

    if (gasLevel > 300 || temperature > 50 || noiseLevel > 90) {
      riskLevel = 'High Risk';
      explanation = `Critical threshold exceeded: ${
        gasLevel > 300 ? 'Gas Level (>300ppm) ' : ''
      }${temperature > 50 ? 'Temperature (>50°C) ' : ''}${
        noiseLevel > 90 ? 'Noise Level (>90dB) ' : ''
      }`;
    } else if (workerDensity > 50 || (temperature >= 40 && temperature <= 50)) {
      riskLevel = 'Moderate Risk';
      explanation = `Warning threshold reached: ${
        workerDensity > 50 ? 'High Worker Density (>50) ' : ''
      }${temperature >= 40 ? 'Elevated Temperature (40-50°C) ' : ''}`;
    }

    const aiInsights = await getAIInsights(inputs, riskLevel, explanation);

    setResult({
      riskLevel,
      explanation,
      aiInsights,
    });
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'High Risk': return 'bg-red-500 text-white';
      case 'Moderate Risk': return 'bg-amber-500 text-white';
      case 'Safe': return 'bg-emerald-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'High Risk': return <ShieldAlert className="w-6 h-6" />;
      case 'Moderate Risk': return <ShieldQuestion className="w-6 h-6" />;
      case 'Safe': return <ShieldCheck className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans">
      {/* Header */}
      <header className="border-b-2 border-[#141414] p-4 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tighter uppercase">SafeGuard AI Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono uppercase opacity-60">Operator: {user}</span>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-xs uppercase font-bold tracking-widest hover:bg-[#141414] hover:text-white rounded-none border border-[#141414]">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <section className="lg:col-span-4 space-y-6">
          <Card className="border-2 border-[#141414] rounded-none shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <CardHeader className="border-b-2 border-[#141414] bg-[#141414]/5">
              <CardTitle className="text-sm uppercase tracking-widest font-bold">Environmental Inputs</CardTitle>
              <CardDescription className="italic text-xs font-serif">Enter real-time sensor data below</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="temperature" className="text-xs font-bold uppercase flex items-center gap-2">
                    <Thermometer className="w-4 h-4" /> Temperature (°C)
                  </Label>
                  <span className="text-xs font-mono font-bold">{inputs.temperature}°C</span>
                </div>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  value={inputs.temperature}
                  onChange={handleInputChange}
                  className="border-2 border-[#141414] rounded-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="gasLevel" className="text-xs font-bold uppercase flex items-center gap-2">
                    <Wind className="w-4 h-4" /> Gas Level (ppm)
                  </Label>
                  <span className="text-xs font-mono font-bold">{inputs.gasLevel} ppm</span>
                </div>
                <Input
                  id="gasLevel"
                  name="gasLevel"
                  type="number"
                  value={inputs.gasLevel}
                  onChange={handleInputChange}
                  className="border-2 border-[#141414] rounded-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="noiseLevel" className="text-xs font-bold uppercase flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Noise Level (dB)
                  </Label>
                  <span className="text-xs font-mono font-bold">{inputs.noiseLevel} dB</span>
                </div>
                <Input
                  id="noiseLevel"
                  name="noiseLevel"
                  type="number"
                  value={inputs.noiseLevel}
                  onChange={handleInputChange}
                  className="border-2 border-[#141414] rounded-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="workerDensity" className="text-xs font-bold uppercase flex items-center gap-2">
                    <Users className="w-4 h-4" /> Worker Density
                  </Label>
                  <span className="text-xs font-mono font-bold">{inputs.workerDensity}</span>
                </div>
                <Input
                  id="workerDensity"
                  name="workerDensity"
                  type="number"
                  value={inputs.workerDensity}
                  onChange={handleInputChange}
                  className="border-2 border-[#141414] rounded-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="workerSpeed" className="text-xs font-bold uppercase flex items-center gap-2">
                    <FastForward className="w-4 h-4" /> Worker Speed (m/s)
                  </Label>
                  <span className="text-xs font-mono font-bold">{inputs.workerSpeed} m/s</span>
                </div>
                <Input
                  id="workerSpeed"
                  name="workerSpeed"
                  type="number"
                  step="0.1"
                  value={inputs.workerSpeed}
                  onChange={handleInputChange}
                  className="border-2 border-[#141414] rounded-none"
                />
              </div>

              <Button 
                onClick={calculateRisk} 
                disabled={loading}
                className="w-full bg-[#141414] text-white hover:bg-[#141414]/90 rounded-none h-12 font-bold uppercase tracking-widest mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Assessment'}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Results Panel */}
        <section className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[#141414]/20 p-12 text-center"
              >
                <ShieldQuestion className="w-16 h-16 text-[#141414]/20 mb-4" />
                <h2 className="text-xl font-bold uppercase tracking-tighter opacity-40">Awaiting Assessment</h2>
                <p className="text-sm italic font-serif opacity-40">Configure environmental parameters and run the assessment.</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Risk Level Card */}
                <Card className="border-2 border-[#141414] rounded-none shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] overflow-hidden">
                  <div className={`p-4 flex items-center justify-between ${getRiskColor(result.riskLevel)}`}>
                    <div className="flex items-center gap-3">
                      {getRiskIcon(result.riskLevel)}
                      <h2 className="text-2xl font-black uppercase tracking-tighter">
                        Risk Level: {result.riskLevel}
                      </h2>
                    </div>
                    <Badge variant="outline" className="bg-white/20 border-white text-white font-mono">
                      {new Date().toLocaleTimeString()}
                    </Badge>
                  </div>
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60">System Explanation</h3>
                        <p className="text-lg font-medium leading-tight">{result.explanation}</p>
                      </div>
                      
                      <div className="border-t-2 border-[#141414]/10 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">AI Safety Insights</h3>
                        </div>
                        <div className="bg-[#141414]/5 p-4 border-l-4 border-[#141414] italic font-serif text-lg leading-relaxed">
                          {result.aiInsights}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Grid Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Temp', value: `${inputs.temperature}°C`, icon: <Thermometer className="w-4 h-4" /> },
                    { label: 'Gas', value: `${inputs.gasLevel} ppm`, icon: <Wind className="w-4 h-4" /> },
                    { label: 'Noise', value: `${inputs.noiseLevel} dB`, icon: <Volume2 className="w-4 h-4" /> },
                    { label: 'Density', value: inputs.workerDensity, icon: <Users className="w-4 h-4" /> },
                    { label: 'Speed', value: `${inputs.workerSpeed} m/s`, icon: <FastForward className="w-4 h-4" /> },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border-2 border-[#141414] p-3 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-1">
                        {stat.icon} {stat.label}
                      </span>
                      <span className="text-xl font-mono font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Safety Protocol Alert */}
                {result.riskLevel !== 'Safe' && (
                  <Alert variant={result.riskLevel === 'High Risk' ? 'destructive' : 'default'} className="border-2 border-[#141414] rounded-none bg-white">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle className="font-bold uppercase tracking-widest">Safety Protocol Activated</AlertTitle>
                    <AlertDescription className="italic font-serif">
                      Please follow standard operating procedure SOP-402 for {result.riskLevel.toLowerCase()} scenarios. 
                      Notify floor supervisors immediately.
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="mt-12 border-t-2 border-[#141414] p-8 bg-white text-center">
        <p className="text-xs font-mono uppercase tracking-widest opacity-40">
          SafeGuard Industrial AI System v2.4.0 | Real-time Monitoring Active
        </p>
      </footer>
    </div>
  );
}
