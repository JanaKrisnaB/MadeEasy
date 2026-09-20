import React, { useState } from 'react';
import { Cpu, Zap, Activity, HardDrive, ShieldCheck } from 'lucide-react';

export const RecurrentDepthVisualizer: React.FC = () => {
  const [ponderDepth, setPonderDepth] = useState<number>(16); // 1 to 48 virtual depth iterations
  const [taskComplexity, setTaskComplexity] = useState<'casual_chat' | 'complex_bug' | 'frontier_proof'>('complex_bug');

  // Calibrate convergence based on task complexity
  let requiredConvergenceDepth = 4;
  let taskDescription = 'Simple conversational query: fast convergence in 4 ponder iterations.';

  if (taskComplexity === 'complex_bug') {
    requiredConvergenceDepth = 18;
    taskDescription = 'Multi-file code refactor: requires ~18 ponder iterations to stabilize latent state.';
  } else if (taskComplexity === 'frontier_proof') {
    requiredConvergenceDepth = 32;
    taskDescription = 'Scientific theorem proof: requires deep recurrent iterations (&gt;30) to resolve invariants.';
  }

  // Latent entropy stabilization metric
  // Lower is more stable
  const entropy = Math.max(0.02, 1.2 * Math.exp(-ponderDepth / (requiredConvergenceDepth * 0.5))).toFixed(4);
  const isConverged = ponderDepth >= requiredConvergenceDepth;

  // Comparison metrics:
  // Recurrent Depth: KV cache stays constant O(1)
  const recurrentKvMemoryMb = 256; // 256 MB constant
  // Standard text-token chain of thought: consumes ~100 tokens per depth iteration
  const textTokenCount = ponderDepth * 150;
  const standardKvMemoryMb = (256 + (textTokenCount * 2 * 32 * 128 * 2) / (1024 * 1024)).toFixed(0);

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Recurrent Depth Ponder Core & Adaptive Thinking
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Recurrence: <code className="text-cyan-300 font-mono">h^(k+1) = Block_&theta;(h^(k)) + h^(k)</code> &nbsp;|&nbsp;
            Memory: <code className="text-cyan-300 font-mono">O(1) Constant KV-Cache VRAM</code>
          </p>
        </div>

        <div className="flex bg-[#181c26] border border-[#2e3446] rounded p-0.5 text-xs font-mono">
          <button
            onClick={() => setTaskComplexity('casual_chat')}
            className={`px-2.5 py-1 rounded transition-colors ${
              taskComplexity === 'casual_chat'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Instant Chat
          </button>
          <button
            onClick={() => setTaskComplexity('complex_bug')}
            className={`px-2.5 py-1 rounded transition-colors ${
              taskComplexity === 'complex_bug'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            SWE Bug
          </button>
          <button
            onClick={() => setTaskComplexity('frontier_proof')}
            className={`px-2.5 py-1 rounded transition-colors ${
              taskComplexity === 'frontier_proof'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Frontier Math
          </button>
        </div>
      </div>

      <p className="text-xs text-[#94a3b8] italic my-3 bg-[#131722] px-3 py-2 rounded border border-[#232734]">
        {taskDescription}
      </p>

      {/* Recurrent Depth Slider */}
      <div className="my-4 p-3 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[#cbd5e1]">Virtual Recurrent Depth (k):</span>
          <span className="text-cyan-400 font-bold text-sm">k = {ponderDepth} ponder steps</span>
        </div>
        <input
          type="range"
          min="1"
          max="48"
          step="1"
          value={ponderDepth}
          onChange={(e) => setPonderDepth(parseInt(e.target.value))}
          className="w-full accent-cyan-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
          <span>k=1 (Instant Pass-Through)</span>
          <span>k=16 (Balanced Deliberation)</span>
          <span>k=48 (Deep Scientific Pondering)</span>
        </div>
      </div>

      {/* Dynamic Halting & Stability Diagnostics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 font-mono text-xs">
        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Latent Entropy H(h)</span>
          <span className={`text-xl font-bold ${isConverged ? 'text-emerald-400' : 'text-amber-400'}`}>
            {entropy}
          </span>
          <span className="text-[10px] text-[#64748b] block">{isConverged ? 'Stabilized' : 'Fluctuating'}</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Halting Gate Status</span>
          <span className={`text-base font-bold ${isConverged ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isConverged ? 'READY TO EMIT' : 'PONDERING...'}
          </span>
          <span className="text-[10px] text-[#64748b] block">Target depth: {requiredConvergenceDepth}</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Astra O(1) Memory</span>
          <span className="text-lg font-bold text-emerald-400">{recurrentKvMemoryMb} MB</span>
          <span className="text-[10px] text-[#64748b] block">Flat & constant VRAM</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Token-CoT Memory</span>
          <span className="text-lg font-bold text-amber-400">{standardKvMemoryMb} MB</span>
          <span className="text-[10px] text-[#64748b] block">{textTokenCount} scratchpad tokens</span>
        </div>
      </div>

      <div className="p-3 bg-[#111622] rounded border border-[#232734] text-xs font-mono text-[#94a3b8]">
        <strong>Architecture Insight:</strong> By thinking across <em>recurrent depth</em> inside the weights rather than
        generating text words sequentially, the model consumes zero extra context window tokens and maintains a constant
        O(1) KV-cache footprint while computing deep logical invariants.
      </div>
    </div>
  );
};
