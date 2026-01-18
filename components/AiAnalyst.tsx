
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Target } from '../types';
import { Cpu, Loader2 } from 'lucide-react';

interface AiAnalystProps {
  targets: Target[];
}

export const AiAnalyst: React.FC<AiAnalystProps> = ({ targets }) => {
  const [analysis, setAnalysis] = useState<string>('Initializing AI analysis module...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSignals = async () => {
    if (targets.length === 0) {
      setAnalysis('No signals detected to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const targetSummary = targets.map(t => 
        `ID: ${t.id}, Type: ${t.type}, Speed: ${t.speed}km/h, Alt: ${t.altitude}m, Threat: ${t.threatLevel}`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following radar signals and provide a brief strategic assessment (max 3 sentences). 
        Determine if there is a pattern suggesting a coordinated attack or civilian transit error.
        
        DATA:
        ${targetSummary}`,
        config: {
          systemInstruction: "You are an elite ELINT (Electronic Intelligence) officer. Be concise, technical, and alert.",
          temperature: 0.7,
        }
      });

      setAnalysis(response.text || 'Analysis failed to generate.');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAnalysis('Critical error in analysis subsystem.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeSignals();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets.length]);

  return (
    <div className="rounded-xl bg-white/5 p-4 border border-white/10 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center">
          <Cpu size={14} className="mr-2" />
          AI Analyst Core
        </h3>
        <button 
          onClick={analyzeSignals}
          disabled={isAnalyzing}
          className="text-[10px] uppercase font-bold text-gray-400 hover:text-white disabled:opacity-50"
        >
          {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : 'Re-Analyze'}
        </button>
      </div>

      <div className="bg-black/40 rounded-lg p-3 border border-white/5 min-h-[100px]">
        {isAnalyzing && analysis === 'Initializing AI analysis module...' ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="text-emerald-500 animate-spin" />
          </div>
        ) : (
          <p className="text-[11px] leading-relaxed text-gray-300 mono italic">
            "{analysis}"
          </p>
        )}
      </div>
      
      <div className="flex space-x-2">
         <div className="flex-1 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '30%'}} />
         </div>
      </div>
    </div>
  );
};
