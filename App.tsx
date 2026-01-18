
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RadarDisplay } from './components/RadarDisplay';
import { Sidebar } from './components/Sidebar';
import { StatsPanel } from './components/StatsPanel';
import { Header } from './components/Header';
import { AiAnalyst } from './components/AiAnalyst';
import { Target, TargetType } from './types';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_TARGET_COUNT = 5;

const App: React.FC = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [scanSpeed, setScanSpeed] = useState(0.02);
  const [range, setRange] = useState(200);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  // Initialize targets
  useEffect(() => {
    const initialTargets: Target[] = Array.from({ length: INITIAL_TARGET_COUNT }).map(() => generateRandomTarget());
    setTargets(initialTargets);
  }, []);

  const generateRandomTarget = (id?: string): Target => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 0.2 + Math.random() * 0.7;
    const types: TargetType[] = ['Civilian', 'Military', 'UAV', 'Unknown'];
    return {
      id: id || uuidv4().slice(0, 8),
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      velocity: 0.0005 + Math.random() * 0.0015,
      angle: Math.random() * Math.PI * 2,
      altitude: Math.floor(2000 + Math.random() * 10000),
      speed: Math.floor(300 + Math.random() * 1200),
      type: types[Math.floor(Math.random() * types.length)],
      history: [],
      detected: false,
      threatLevel: Math.random() > 0.8 ? 'High' : (Math.random() > 0.5 ? 'Medium' : 'Low'),
    };
  };

  // Animation Loop
  useEffect(() => {
    let frameId: number;
    
    const update = () => {
      if (isScanning) {
        setSweepAngle(prev => (prev + scanSpeed) % (Math.PI * 2));

        setTargets(prevTargets => prevTargets.map(target => {
          // Update position based on velocity and angle
          let nextX = target.x + Math.cos(target.angle) * target.velocity;
          let nextY = target.y + Math.sin(target.angle) * target.velocity;

          // Bounce off boundaries (simplified)
          if (nextX * nextX + nextY * nextY > 0.95) {
            target.angle += Math.PI * 0.5 + Math.random();
            nextX = target.x;
            nextY = target.y;
          }

          // Update history for trails
          const newHistory = [{ x: target.x, y: target.y }, ...target.history].slice(0, 20);

          // Detection logic based on sweep angle
          const targetAngle = Math.atan2(nextY, nextX);
          const normalizedTargetAngle = targetAngle < 0 ? targetAngle + Math.PI * 2 : targetAngle;
          const diff = Math.abs(normalizedTargetAngle - sweepAngle);
          const detected = diff < 0.1 || diff > Math.PI * 2 - 0.1;

          return {
            ...target,
            x: nextX,
            y: nextY,
            history: newHistory,
            detected: detected ? true : target.detected // Stay detected for a short while? Simplified: detection happens in RadarDisplay component for visual persistence
          };
        }));
      }
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isScanning, scanSpeed, sweepAngle]);

  const handleAddTarget = () => {
    setTargets(prev => [...prev, generateRandomTarget()]);
  };

  const handleRemoveTarget = (id: string) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    if (selectedTargetId === id) setSelectedTargetId(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-gray-200">
      <Header 
        isScanning={isScanning} 
        setIsScanning={setIsScanning} 
        onAddTarget={handleAddTarget} 
      />
      
      <main className="flex flex-1 overflow-hidden">
        <Sidebar 
          targets={targets} 
          selectedTargetId={selectedTargetId}
          onSelectTarget={setSelectedTargetId}
          onRemoveTarget={handleRemoveTarget}
        />
        
        <div className="flex-1 flex flex-col relative bg-[#0a0a0a] border-x border-white/5">
          <div className="flex-1 flex items-center justify-center p-4">
             <RadarDisplay 
                targets={targets} 
                sweepAngle={sweepAngle} 
                range={range}
                selectedTargetId={selectedTargetId}
             />
          </div>
          
          <div className="h-64 p-4 border-t border-white/5 overflow-y-auto">
             <StatsPanel targets={targets} />
          </div>
        </div>

        <div className="w-80 flex flex-col p-4 space-y-4">
           <AiAnalyst targets={targets} />
           <div className="flex-1 rounded-xl bg-white/5 p-4 border border-white/10 flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4">System Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1 uppercase">Scan Speed</label>
                  <input 
                    type="range" min="0.005" max="0.05" step="0.001" 
                    value={scanSpeed} 
                    onChange={(e) => setScanSpeed(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1 uppercase">Range Scale ({range}km)</label>
                  <input 
                    type="range" min="50" max="500" step="10" 
                    value={range} 
                    onChange={(e) => setRange(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
           </div>
        </div>
      </main>
      
      <footer className="h-8 border-t border-white/5 flex items-center px-4 bg-black">
        <div className="flex items-center space-x-4 text-[10px] mono text-emerald-500/50">
           <span>SYSTEM: OPERATIONAL</span>
           <span>LAT: 34.0522° N</span>
           <span>LNG: 118.2437° W</span>
           <span className="animate-pulse">● SIGNAL STRENGTH: 98%</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
