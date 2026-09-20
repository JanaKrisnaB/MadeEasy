import React, { useState } from 'react';
import { Cpu, TrendingUp, Info } from 'lucide-react';

export const ScalingLawsVisualizer: React.FC = () => {
  // Parameters N in Billions (e.g. 7B to 175B)
  const [paramsBillion, setParamsBillion] = useState<number>(70);
  // Training Tokens D in Billions (e.g. 300B to 3000B)
  const [tokensBillion, setTokensBillion] = useState<number>(1400);
  const [regime, setRegime] = useState<'chinchilla' | 'kaplan'>('chinchilla');

  // Compute C in FLOPs: C ≈ 6 * N * D
  const computeExaFLOPs = 6 * (paramsBillion * 1e9) * (tokensBillion * 1e9) / 1e18;

  // Chinchilla ratio: D / N optimal is ~20 tokens per parameter
  const currentRatio = tokensBillion / paramsBillion;
  const optimalChinchillaTokens = paramsBillion * 20;
  const isOverparam = currentRatio < 15;
  const isUnderparam = currentRatio > 35;
  const isOptimal = currentRatio >= 15 && currentRatio <= 35;

  // Estimated Cross-Entropy Test Loss
  // L(N, D) = E + (A / N^alpha) + (B / D^beta)
  // Approximate empirical parameters from Hoffmann et al. 2022:
  const alpha = 0.34;
  const beta = 0.28;
  const A = 406.4;
  const B = 410.7;
  const E = 1.69; // Irreducible entropy of natural text

  const termN = A / Math.pow(paramsBillion * 1e9, alpha);
  const termD = B / Math.pow(tokensBillion * 1e9, beta);
  const estimatedLoss = (E + termN + termD).toFixed(3);
  const perplexity = Math.exp(parseFloat(estimatedLoss)).toFixed(2);

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Empirical Compute Scaling Laws Calculator
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Formula: <code className="text-cyan-300 font-mono">C &approx; 6 &times; N &times; D</code> &nbsp;|&nbsp;
            Loss: <code className="text-cyan-300 font-mono">L(N, D) = E + A/N^&alpha; + B/D^&beta;</code>
          </p>
        </div>

        <div className="flex bg-[#181c26] border border-[#2e3446] rounded p-0.5 text-xs">
          <button
            onClick={() => setRegime('chinchilla')}
            className={`px-3 py-1 rounded transition-colors ${
              regime === 'chinchilla'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Chinchilla Law (1:20 Ratio)
          </button>
          <button
            onClick={() => setRegime('kaplan')}
            className={`px-3 py-1 rounded transition-colors ${
              regime === 'kaplan'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Kaplan 2020 Law (Over-Param)
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-4">
        {/* Parameter Slider */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734]">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-[#cbd5e1]">Model Parameters (N):</span>
            <span className="text-cyan-400 font-bold text-sm">{paramsBillion} Billion (B)</span>
          </div>
          <input
            type="range"
            min="1"
            max="180"
            step="1"
            value={paramsBillion}
            onChange={(e) => setParamsBillion(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] mt-1 font-mono">
            <span>1B (Edge)</span>
            <span>7B (Llama)</span>
            <span>70B (Frontier)</span>
            <span>175B (GPT-3)</span>
          </div>
        </div>

        {/* Tokens Slider */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734]">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-[#cbd5e1]">Training Tokens (D):</span>
            <span className="text-cyan-400 font-bold text-sm">
              {(tokensBillion / 1000).toFixed(2)} Trillion ({tokensBillion}B)
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="5000"
            step="50"
            value={tokensBillion}
            onChange={(e) => setTokensBillion(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] mt-1 font-mono">
            <span>300B (GPT-3)</span>
            <span>1.4T (Chinchilla)</span>
            <span>2.0T (Llama-2)</span>
            <span>5.0T (Llama-3)</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[11px] text-[#94a3b8] block font-mono">Total Training Compute</span>
          <span className="text-lg font-bold text-white font-mono">{computeExaFLOPs.toFixed(1)}</span>
          <span className="text-[10px] text-[#64748b] block font-mono">ExaFLOPs (10^18)</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[11px] text-[#94a3b8] block font-mono">Token-to-Param Ratio</span>
          <span className={`text-lg font-bold font-mono ${isOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
            {currentRatio.toFixed(1)} : 1
          </span>
          <span className="text-[10px] text-[#64748b] block font-mono">Ideal ~ 20.0 : 1</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[11px] text-[#94a3b8] block font-mono">Predicted Test Loss</span>
          <span className="text-lg font-bold text-cyan-400 font-mono">{estimatedLoss}</span>
          <span className="text-[10px] text-[#64748b] block font-mono">Cross-Entropy nats</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[11px] text-[#94a3b8] block font-mono">Estimated Perplexity</span>
          <span className="text-lg font-bold text-white font-mono">{perplexity}</span>
          <span className="text-[10px] text-[#64748b] block font-mono">exp(Cross-Entropy)</span>
        </div>
      </div>

      {/* Chinchilla Regime Diagnostic */}
      <div
        className={`p-3 rounded border text-xs font-mono flex items-start gap-2.5 ${
          isOptimal
            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
            : isOverparam
            ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
            : 'bg-indigo-950/40 border-indigo-500/60 text-indigo-300'
        }`}
      >
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>Status: </strong>
          {isOptimal && (
            <span>
              <strong>Chinchilla Optimal Allocation.</strong> You have balanced parameters and data in exact parity.
              Every FLOP spent yields maximal test loss reduction.
            </span>
          )}
          {isOverparam && (
            <span>
              <strong>Severely Under-Trained (Kaplan/GPT-3 Regime).</strong> You have too many parameters for only{' '}
              {tokensBillion}B tokens. According to Chinchilla scaling, for a {paramsBillion}B model you should train on at
              least <strong>{optimalChinchillaTokens}B tokens</strong>. The model is starving for data.
            </span>
          )}
          {isUnderparam && (
            <span>
              <strong>Inference-Optimal Over-Trained (Llama-3 Regime).</strong> You are training a smaller {paramsBillion}B
              model far past Chinchilla optimality ({currentRatio.toFixed(0)} tokens/param). While training FLOPs are higher
              than minimal, your model is significantly cheaper and faster during production inference.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
