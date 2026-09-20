import React, { useState } from 'react';
import { Compass, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export const TestTimeBudgetVisualizer: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [budgetN, setBudgetN] = useState<number>(32); // Number of test-time rollouts
  const [verifierQuality, setVerifierQuality] = useState<number>(90); // 70% to 98%

  // Simulation calculations
  // Difficulty parameters:
  // Easy (GSM8K): base 85%, optimal N=8, sharp degradation if N>128
  // Medium (MATH 500): base 40%, optimal N=64, mild degradation if N>512
  // Hard (AIME / Olympiad): base 10%, monotonic gain up to N=1024, little degradation
  let baseAcc = 0.4;
  let optimalN = 64;
  let overthinkingPenaltyRate = 0.08;

  if (difficulty === 'easy') {
    baseAcc = 0.88;
    optimalN = 16;
    overthinkingPenaltyRate = 0.18;
  } else if (difficulty === 'hard') {
    baseAcc = 0.14;
    optimalN = 256;
    overthinkingPenaltyRate = 0.03;
  }

  // Scaling gain from search: log(N) gain modulated by verifier quality
  const verifierFactor = verifierQuality / 100;
  const searchGain = Math.log2(budgetN) * 0.12 * verifierFactor;

  // Overthinking penalty when N >> optimalN
  let overthinkingLoss = 0;
  if (budgetN > optimalN) {
    const excess = Math.log2(budgetN / optimalN);
    overthinkingLoss = excess * overthinkingPenaltyRate * (1.1 - verifierFactor);
  }

  const rawAccuracy = Math.min(0.98, Math.max(0.05, baseAcc + searchGain - overthinkingLoss));
  const accuracyPct = (rawAccuracy * 100).toFixed(1);

  // Compute cost
  const computeTokens = budgetN * 2048; // average 2k thinking tokens per rollout
  const computeCostUSD = ((computeTokens / 1_000_000) * 4.0).toFixed(3); // $4 / 1M reasoning tokens

  const isOverthinking = budgetN > optimalN * 2 && overthinkingLoss > 0.04;

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            Test-Time Compute Search & Inverted U-Curve Simulator
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Test-Time Scaling: <code className="text-indigo-300 font-mono">Accuracy &sim; log(N) &minus; &lambda; &times; (VerifierHacking + Overthinking)</code>
          </p>
        </div>

        <div className="flex bg-[#181c26] border border-[#2e3446] rounded p-0.5 text-xs font-mono">
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-2.5 py-1 rounded transition-colors uppercase ${
                difficulty === diff
                  ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-500'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {diff === 'easy' ? 'Grade School' : diff === 'medium' ? 'High School' : 'Olympiad'}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Search Rollout Budget N */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[#cbd5e1]">Rollout Budget (N):</span>
            <span className="text-indigo-400 font-bold text-sm">N = {budgetN} trajectories</span>
          </div>
          <input
            type="range"
            min="1"
            max="512"
            step="1"
            value={budgetN}
            onChange={(e) => setBudgetN(parseInt(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
            <span>N=1 (Zero-Shot)</span>
            <span>N=16 (Quick Vote)</span>
            <span>N=64 (Standard MCTS)</span>
            <span>N=512 (Exhaustive)</span>
          </div>
        </div>

        {/* Process Reward Model Quality */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[#cbd5e1]">Process Verifier (PRM) Reliability:</span>
            <span className="text-cyan-400 font-bold">{verifierQuality}% Accuracy</span>
          </div>
          <input
            type="range"
            min="70"
            max="98"
            step="1"
            value={verifierQuality}
            onChange={(e) => setVerifierQuality(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
            <span>70% (Prone to Hacking)</span>
            <span>85% (Solid)</span>
            <span>98% (Near Perfect)</span>
          </div>
        </div>
      </div>

      {/* Accuracy & Cost Metric Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 font-mono text-xs">
        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Pass@1 Success Rate</span>
          <span className={`text-xl font-bold ${isOverthinking ? 'text-amber-400' : 'text-emerald-400'}`}>
            {accuracyPct}%
          </span>
          <span className="text-[10px] text-[#64748b] block">Base was {(baseAcc * 100).toFixed(0)}%</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Thinking Tokens</span>
          <span className="text-lg font-bold text-white">{(computeTokens / 1000).toFixed(0)}k</span>
          <span className="text-[10px] text-[#64748b] block">{budgetN} rollouts &times; 2k</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Inference Cost / Query</span>
          <span className="text-lg font-bold text-indigo-400">${computeCostUSD}</span>
          <span className="text-[10px] text-[#64748b] block">At standard cloud rates</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Optimal Search Peak</span>
          <span className="text-lg font-bold text-cyan-400">N* &approx; {optimalN}</span>
          <span className="text-[10px] text-[#64748b] block">Peak compute efficiency</span>
        </div>
      </div>

      {/* Diagnostics */}
      <div
        className={`p-3 rounded border text-xs font-mono flex items-start gap-2.5 ${
          isOverthinking
            ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
            : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
        }`}
      >
        {isOverthinking ? (
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        ) : (
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
        )}

        <div>
          {isOverthinking ? (
            <span>
              <strong>Overthinking Degradation & Reward Hacking Active:</strong> You allocated N={budgetN} rollouts on a{' '}
              {difficulty} problem where peak accuracy occurred at N={optimalN}. The model is second-guessing correct solutions
              and finding false-positive paths that fool the {verifierQuality}% verifier. Accuracy has dropped by{' '}
              {(overthinkingLoss * 100).toFixed(1)}%!
            </span>
          ) : (
            <span>
              <strong>Efficient Search Allocation:</strong> Test-time search is providing productive exploration. Candidate
              proofs are being verified without exceeding the threshold where verifier exploitation degrades output quality.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
