
import React, { useRef, useEffect } from 'react';
import { Target } from '../types';

interface RadarDisplayProps {
  targets: Target[];
  sweepAngle: number;
  range: number;
  selectedTargetId: string | null;
}

export const RadarDisplay: React.FC<RadarDisplayProps> = ({ targets, sweepAngle, range, selectedTargetId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);
    const center = size / 2;
    const radius = center * 0.9;

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid rings
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(center, center, (radius / 4) * i, 0, Math.PI * 2);
      ctx.stroke();
      
      // Distance labels
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`${Math.round((range / 4) * i)}km`, center + 5, center - (radius / 4) * i - 5);
    }

    // Draw crosshair axes
    ctx.beginPath();
    ctx.moveTo(center - radius, center);
    ctx.lineTo(center + radius, center);
    ctx.moveTo(center, center - radius);
    ctx.lineTo(center, center + radius);
    ctx.stroke();

    // Draw degree markings
    for (let i = 0; i < 360; i += 30) {
      const rad = (i * Math.PI) / 180;
      const x1 = center + Math.cos(rad) * radius;
      const y1 = center + Math.sin(rad) * radius;
      const x2 = center + Math.cos(rad) * (radius + 5);
      const y2 = center + Math.sin(rad) * (radius + 5);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      ctx.fillText(`${i}°`, x2 + (Math.cos(rad) * 10) - 10, y2 + (Math.sin(rad) * 10) + 5);
    }

    // Draw sweep line
    const sweepX = center + Math.cos(sweepAngle) * radius;
    const sweepY = center + Math.sin(sweepAngle) * radius;
    
    // Sweep gradient tail
    const gradient = ctx.createConicGradient(sweepAngle, center, center);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    gradient.addColorStop(0.1, 'rgba(16, 185, 129, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, sweepAngle - 0.5, sweepAngle);
    ctx.fill();

    // Main sweep line
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(sweepX, sweepY);
    ctx.stroke();

    // Draw targets
    targets.forEach(target => {
      const tx = center + target.x * radius;
      const ty = center + target.y * radius;
      
      // Calculate angular distance to sweep for fading effect
      const targetAngle = Math.atan2(target.y, target.x);
      const normalizedTargetAngle = targetAngle < 0 ? targetAngle + Math.PI * 2 : targetAngle;
      let angleDiff = sweepAngle - normalizedTargetAngle;
      if (angleDiff < 0) angleDiff += Math.PI * 2;
      
      // Target brightness based on how recently the sweep hit it
      const intensity = Math.max(0, 1 - angleDiff / (Math.PI * 0.5));
      if (intensity <= 0) return;

      const isSelected = target.id === selectedTargetId;

      // Draw trail
      ctx.beginPath();
      ctx.strokeStyle = target.threatLevel === 'High' ? `rgba(239, 68, 68, ${intensity * 0.3})` : `rgba(16, 185, 129, ${intensity * 0.3})`;
      ctx.lineWidth = 1;
      target.history.forEach((pos, idx) => {
          const hx = center + pos.x * radius;
          const hy = center + pos.y * radius;
          if (idx === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
      });
      ctx.stroke();

      // Target point
      ctx.fillStyle = target.threatLevel === 'High' ? `rgba(239, 68, 68, ${intensity})` : `rgba(16, 185, 129, ${intensity})`;
      ctx.beginPath();
      ctx.arc(tx, ty, isSelected ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(tx, ty, 10, 0, Math.PI * 2);
        ctx.stroke();
        
        // Target ID tag
        ctx.fillStyle = '#fff';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`ID: ${target.id}`, tx + 12, ty - 12);
        ctx.fillText(`${Math.round(target.speed)}km/h`, tx + 12, ty);
      }
    });

  }, [targets, sweepAngle, range, selectedTargetId]);

  return (
    <div className="relative aspect-square w-full max-w-[600px] bg-black rounded-full shadow-[0_0_50px_rgba(16,185,129,0.1)] border border-white/10 p-2">
      <canvas 
        ref={canvasRef} 
        width={1200} 
        height={1200} 
        className="w-full h-full rounded-full"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
    </div>
  );
};
