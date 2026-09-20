import React, { useState } from 'react';
import { Database, Zap, HardDrive, CheckCircle } from 'lucide-react';

export const LoraRankVisualizer: React.FC = () => {
  const [dModel, setDModel] = useState<number>(4096);
  const [rank, setRank] = useState<number>(8);
  const [alpha, setAlpha] = useState<number>(16);
  const [numLayers, setNumLayers] = useState<number>(32);

  // Full fine-tuning params for 1 matrix W_0 in R^{d x d}
  // If applied to Q, K, V, O projections: 4 * d * d per layer
  const fullWeightParams = 4 * dModel * dModel * numLayers;
  // LoRA params: for each projection, B in R^{d x r} and A in R^{r x d} -> 2 * d * r
  const loraParams = 4 * (2 * dModel * rank) * numLayers;

  const reductionFactor = (fullWeightParams / loraParams).toFixed(1);
  const percentTrainable = ((loraParams / fullWeightParams) * 100).toFixed(3);

  // VRAM in MegaBytes (assuming FP16 = 2 bytes/param)
  const fullVramGB = (fullWeightParams * 2) / (1024 * 1024 * 1024);
  const loraVramMB = (loraParams * 2) / (1024 * 1024);

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            LoRA Low-Rank Decomposition & Parameter Reducer
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Formula: <code className="text-amber-300 font-mono">h = W_0 &times; x + (&alpha; / r) &times; (B &times; A) &times; x</code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#181c26] px-2.5 py-1 rounded border border-[#2e3446]">
          <span className="text-[#94a3b8]">Scaling Factor:</span>
          <span className="text-amber-400 font-bold">&alpha;/r = {(alpha / rank).toFixed(2)}x</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        {/* Hidden Dim */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734]">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#cbd5e1]">Hidden Dimension (d):</span>
            <span className="text-amber-400 font-bold">{dModel}</span>
          </div>
          <div className="flex gap-1.5">
            {[2048, 4096, 8192].map((dim) => (
              <button
                key={dim}
                onClick={() => setDModel(dim)}
                className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                  dModel === dim
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold'
                    : 'bg-[#181c26] border-[#2e3446] text-[#94a3b8]'
                }`}
              >
                {dim === 2048 ? '7B' : dim === 4096 ? '13B/70B' : '405B'}
              </button>
            ))}
          </div>
        </div>

        {/* LoRA Rank */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734]">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#cbd5e1]">LoRA Rank (r):</span>
            <span className="text-amber-400 font-bold">r = {rank}</span>
          </div>
          <input
            type="range"
            min="2"
            max="64"
            step="2"
            value={rank}
            onChange={(e) => setRank(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] font-mono mt-1">
            <span>r=2</span>
            <span>r=8 (Standard)</span>
            <span>r=16</span>
            <span>r=64 (Dense)</span>
          </div>
        </div>

        {/* LoRA Alpha */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734]">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#cbd5e1]">LoRA Alpha (&alpha;):</span>
            <span className="text-amber-400 font-bold">&alpha; = {alpha}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            step="4"
            value={alpha}
            onChange={(e) => setAlpha(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] font-mono mt-1">
            <span>&alpha;=8</span>
            <span>&alpha;=16</span>
            <span>&alpha;=32</span>
            <span>&alpha;=64</span>
          </div>
        </div>
      </div>

      {/* Visual Factorization Matrix Scheme */}
      <div className="my-4 p-4 bg-[#131722] rounded border border-[#232734]">
        <div className="text-xs font-mono text-[#94a3b8] mb-3">Matrix Factorization Geometry:</div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          {/* Frozen W0 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#1e2330] border-2 border-dashed border-[#475569] rounded flex flex-col items-center justify-center text-center p-1">
              <span className="text-white font-bold">W₀</span>
              <span className="text-[10px] text-[#64748b]">{dModel} &times; {dModel}</span>
              <span className="text-[9px] text-cyan-400 uppercase font-bold mt-1">FROZEN</span>
            </div>
            <span className="text-[10px] text-[#94a3b8] mt-1">Base Weights</span>
          </div>

          <span className="text-xl font-bold text-[#64748b]">+</span>

          {/* Scale */}
          <span className="text-amber-400 font-bold">({alpha}/{rank}) &times; [</span>

          {/* Matrix B */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-20 bg-amber-950/40 border-2 border-amber-500 rounded flex flex-col items-center justify-center text-center p-1">
              <span className="text-amber-300 font-bold">B</span>
              <span className="text-[9px] text-amber-200">{dModel} &times; {rank}</span>
            </div>
            <span className="text-[10px] text-[#94a3b8] mt-1">Init 0</span>
          </div>

          <span className="text-base font-bold text-amber-400">&times;</span>

          {/* Matrix A */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-10 bg-amber-950/40 border-2 border-amber-500 rounded flex flex-col items-center justify-center text-center p-1">
              <span className="text-amber-300 font-bold">A</span>
              <span className="text-[9px] text-amber-200">{rank} &times; {dModel}</span>
            </div>
            <span className="text-[10px] text-[#94a3b8] mt-1">Gaussian Init</span>
          </div>

          <span className="text-amber-400 font-bold">]</span>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 bg-[#131722] border border-[#232734] rounded font-mono">
          <span className="text-[11px] text-[#94a3b8] block">Trainable Params</span>
          <span className="text-lg font-bold text-amber-400">
            {(loraParams / 1e6).toFixed(2)} M
          </span>
          <span className="text-[10px] text-[#64748b] block">vs {(fullWeightParams / 1e6).toFixed(0)}M full</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded font-mono">
          <span className="text-[11px] text-[#94a3b8] block">Param Reduction</span>
          <span className="text-lg font-bold text-emerald-400">
            {reductionFactor}&times; Fewer
          </span>
          <span className="text-[10px] text-[#64748b] block">Only {percentTrainable}% trained</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded font-mono">
          <span className="text-[11px] text-[#94a3b8] block">Full Model Checkpoint</span>
          <span className="text-lg font-bold text-white">
            {fullVramGB.toFixed(2)} GB
          </span>
          <span className="text-[10px] text-[#64748b] block">Full weights disk footprint</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded font-mono">
          <span className="text-[11px] text-[#94a3b8] block">LoRA Adapter File</span>
          <span className="text-lg font-bold text-amber-400">
            {loraVramMB.toFixed(1)} MB
          </span>
          <span className="text-[10px] text-emerald-400 block flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Easy hot-swap
          </span>
        </div>
      </div>
    </div>
  );
};
