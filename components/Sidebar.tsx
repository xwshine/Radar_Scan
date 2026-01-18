
import React from 'react';
import { Target } from '../types';
import { Trash2, AlertTriangle, Shield, Plane, Radio } from 'lucide-react';

interface SidebarProps {
  targets: Target[];
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
  onRemoveTarget: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ targets, selectedTargetId, onSelectTarget, onRemoveTarget }) => {
  return (
    <div className="w-80 flex flex-col bg-black overflow-hidden border-r border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Target Manifest</h2>
        <span className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold">
          {targets.length} ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {targets.map(target => (
          <div 
            key={target.id}
            onClick={() => onSelectTarget(target.id)}
            className={`p-3 rounded-xl border transition-all cursor-pointer group ${
              selectedTargetId === target.id 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white/5 border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {target.type === 'Military' && <Shield size={14} className="text-orange-500" />}
                {target.type === 'Civilian' && <Plane size={14} className="text-emerald-500" />}
                {target.type === 'UAV' && <Radio size={14} className="text-purple-500" />}
                {target.type === 'Unknown' && <AlertTriangle size={14} className="text-red-500" />}
                <span className="text-xs font-bold mono">#{target.id}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTarget(target.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/40 rounded p-1.5">
                 <p className="text-[8px] text-gray-500 uppercase font-bold">Alt</p>
                 <p className="text-[10px] text-white mono">{target.altitude.toLocaleString()}m</p>
              </div>
              <div className="bg-black/40 rounded p-1.5">
                 <p className="text-[8px] text-gray-500 uppercase font-bold">Spd</p>
                 <p className="text-[10px] text-white mono">{target.speed} km/h</p>
              </div>
            </div>

            {selectedTargetId === target.id && (
              <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">Threat Level:</span>
                  <span className={`font-bold ${
                    target.threatLevel === 'High' ? 'text-red-500' : 
                    target.threatLevel === 'Medium' ? 'text-orange-500' : 'text-emerald-500'
                  }`}>{target.threatLevel}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">Bearing:</span>
                  <span className="text-white">{(target.angle * 180 / Math.PI).toFixed(1)}°</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {targets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 opacity-20 text-center">
            <Radio size={48} className="mb-2" />
            <p className="text-xs uppercase tracking-tighter">No active signals</p>
          </div>
        )}
      </div>
    </div>
  );
};
