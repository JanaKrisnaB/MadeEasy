import React, { useState } from 'react';
import { Target, HardDrive, RefreshCw, CheckCircle } from 'lucide-react';

export const LatentEquilibriumVisualizer: React.FC = () => {
  const [solverTolerance, setSolverTolerance] = useState<number>(0.001);
  const [solverMethod, setSolverMethod] = useState<'forward_iteration' | 'anderson_acceleration'>('anderson_acceleration');

  // Simulate fixed-point convergence
  // z_{k+1} = tanh(W * z_k + x)
  const steps: { iteration: number; zValue: number; residual: number }[] = [];
  let z = 0.1;
  const targetEquilibrium = 0.8415; // Fixed point of the contracted mapping

  const convergenceRate = solverMethod === 'anderson_acceleration' ? 0.35 : 0.72;

  for (let i = 1; i <= 24; i++) {
    const error = (targetEquilibrium - z) * convergenceRate;
    z = z + error;
    const residual = Math.abs(targetEquilibrium - z);
    steps.push({ iteration: i, zValue: z, residual });
    if (residual < solverTolerance) break;
  }

  const numIterations = steps.length;
  const memoryStandardMb = numIterations * 48; // O(L) activation memory in feedforward net
  const memoryDeqMb = 48; // O(1) constant activation memory via Implicit Function Theorem

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Deep Equilibrium (DEQ) Fixed-Point Convergence Simulator
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Fixed-Point Equation: <code className="text-emerald-300 font-mono">z^* = f_&theta;(z^*, x)</code> &nbsp;|&nbsp;
            Backward Pass: <code className="text-emerald-300 font-mono">O(1) Memory via Implicit Function Theorem</code>
          </p>
        </div>

        <div className="flex bg-[#181c26] border border-[#2e3446] rounded p-0.5 text-xs font-mono">
          <button
            onClick={() => setSolverMethod('anderson_acceleration')}
            className={`px-2.5 py-1 rounded transition-colors ${
              solverMethod === 'anderson_acceleration'
                ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Anderson Acceleration
          </button>
          <button
            onClick={() => setSolverMethod('forward_iteration')}
            className={`px-2.5 py-1 rounded transition-colors ${
              solverMethod === 'forward_iteration'
                ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Fixed-Point Iteration
          </button>
        </div>
      </div>

      {/* Solver Tolerance Slider */}
      <div className="my-4 p-3 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[#cbd5e1]">Solver Stopping Residual Tolerance (&epsilon;):</span>
          <span className="text-emerald-400 font-bold">&epsilon; = {solverTolerance}</span>
        </div>
        <input
          type="range"
          min="0.0001"
          max="0.05"
          step="0.0005"
          value={solverTolerance}
          onChange={(e) => setSolverTolerance(parseFloat(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
          <span>&epsilon; = 0.0001 (High Precision)</span>
          <span>&epsilon; = 0.005 (Fast Approximate)</span>
          <span>&epsilon; = 0.05 (Coarse)</span>
        </div>
      </div>

      {/* Convergence Trajectory Chart */}
      <div className="my-4 p-4 bg-[#131722] rounded border border-[#232734]">
        <div className="flex justify-between items-center text-xs font-mono mb-3">
          <span className="text-white font-bold">Latent Vector Trajectory: Convergence to z*</span>
          <span className="text-emerald-400 text-xs">
            Halted at Step #{numIterations} (Residual: {steps[steps.length - 1]?.residual.toFixed(5)})
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {steps.map((s) => {
            const barWidth = (s.zValue / targetEquilibrium) * 100;
            return (
              <div key={s.iteration} className="flex items-center gap-2">
                <span className="w-16 text-[#94a3b8] text-[11px]">Step {s.iteration}:</span>
                <div className="flex-1 h-4 bg-[#181c26] rounded overflow-hidden border border-[#232734] relative">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${Math.min(100, barWidth)}%` }}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-[10px] text-[#cbd5e1]">
                    &Delta; = {s.residual.toFixed(5)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Efficiency Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 font-mono text-xs">
        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">DEQ Memory Footprint</span>
          <span className="text-lg font-bold text-emerald-400">{memoryDeqMb} MB (O(1))</span>
          <span className="text-[10px] text-[#64748b] block">Exact constant backward memory</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Standard Network Memory</span>
          <span className="text-lg font-bold text-amber-400">{memoryStandardMb} MB (O(L))</span>
          <span className="text-[10px] text-[#64748b] block">Must store all {numIterations} layer activations</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Gradient Backprop Engine</span>
          <span className="text-lg font-bold text-white">Implicit Function Theorem</span>
          <span className="text-[10px] text-emerald-400 block flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> No unrolling through iterations
          </span>
        </div>
      </div>
    </div>
  );
};
