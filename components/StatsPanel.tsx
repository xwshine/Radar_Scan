
import React, { useMemo } from 'react';
import { Target } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StatsPanelProps {
  targets: Target[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ targets }) => {
  const chartData = useMemo(() => {
    return targets.map(t => ({
      id: t.id,
      speed: t.speed,
      altitude: t.altitude
    }));
  }, [targets]);

  return (
    <div className="flex h-full space-x-6">
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4 flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
          Velocity Matrix
        </h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="id" hide />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(v) => `${v}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '10px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Bar dataKey="speed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4 flex items-center">
           <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
           Altitude Profile
        </h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="id" hide />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '10px' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area type="monotone" dataKey="altitude" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAlt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
