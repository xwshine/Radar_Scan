
import React from 'react';
import { Play, Pause, Plus, Radar, Settings } from 'lucide-react';

interface HeaderProps {
  isScanning: boolean;
  setIsScanning: (s: boolean) => void;
  onAddTarget: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isScanning, setIsScanning, onAddTarget }) => {
  return (
    <header className="h-16 px-6 bg-black border-b border-white/10 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Radar className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase">Aegis-7</h1>
          <p className="text-[10px] text-emerald-500/50 uppercase tracking-widest font-bold">Orbital Surveillance System</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setIsScanning(!isScanning)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${
            isScanning ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
          }`}
        >
          {isScanning ? <><Pause size={14} /> <span>Stop Scan</span></> : <><Play size={14} /> <span>Start Scan</span></>}
        </button>

        <button 
          onClick={onAddTarget}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 font-bold text-xs uppercase border border-white/10 transition-all"
        >
          <Plus size={14} />
          <span>New Target</span>
        </button>
        
        <button className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
