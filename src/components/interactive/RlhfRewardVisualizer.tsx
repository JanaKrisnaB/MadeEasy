import React, { useState } from 'react';
import { Award, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export const RlhfRewardVisualizer: React.FC = () => {
  const [betaKl, setBetaKl] = useState<number>(0.1); // KL coefficient (0.01 to 0.5)
  const [policyDrift, setPolicyDrift] = useState<number>(5.0); // KL distance D_KL (0 to 15)

  // Simulated reward model score r(y) increases as policy explores new output styles,
  // but eventually plateaus or hacks the reward model
  const rawReward = Math.min(10, 3 + Math.sqrt(policyDrift) * 2.2);

  // KL divergence penalty = beta * D_KL
  const klPenalty = betaKl * policyDrift;

  // Total PPO Objective J(phi) = r(y) - beta * D_KL
  const totalObjective = (rawReward - klPenalty).toFixed(2);

  // Diagnostic states
  const isRewardHacking = betaKl < 0.04 && policyDrift > 8.0;
  const isTooRigid = betaKl > 0.35 && policyDrift < 2.0;
  const isWellAligned = !isRewardHacking && !isTooRigid;

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            RLHF PPO Objective & KL Divergence Anchor
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Formula: <code className="text-emerald-300 font-mono">J(&phi;) = &Eopf; [ r_&theta;(x, y) - &beta; &times; D_KL(&pi;_&phi; &parallel; &pi;_ref) ]</code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#181c26] px-2.5 py-1 rounded border border-[#2e3446]">
          <span className="text-[#94a3b8]">Net Objective:</span>
          <span className="text-emerald-400 font-bold text-sm">J = {totalObjective}</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Beta KL Slider */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[#cbd5e1]">KL Divergence Penalty (&beta;):</span>
            <span className="text-emerald-400 font-bold">&beta; = {betaKl.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={betaKl}
            onChange={(e) => setBetaKl(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
            <span>&beta; = 0.01 (Weak Anchor)</span>
            <span>&beta; = 0.10 (Standard)</span>
            <span>&beta; = 0.50 (Overly Rigid)</span>
          </div>
        </div>

        {/* Policy Drift D_KL Slider */}
        <div className="p-3 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[#cbd5e1]">Policy Divergence D_KL(&pi; &parallel; &pi;_ref):</span>
            <span className="text-cyan-400 font-bold">{policyDrift.toFixed(1)} nats</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15.0"
            step="0.5"
            value={policyDrift}
            onChange={(e) => setPolicyDrift(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
            <span>Near Base Model (&sim;0 nats)</span>
            <span>Medium Exploration</span>
            <span>Far from Base (&gt;10 nats)</span>
          </div>
        </div>
      </div>

      {/* Visual Balance Bar */}
      <div className="my-4 p-4 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
        <div className="text-[#94a3b8] mb-2">PPO Optimization Balance:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-2.5 bg-[#181c26] rounded border border-[#2e3446]">
            <span className="text-[11px] text-[#94a3b8] block">Reward Model Score r(y)</span>
            <span className="text-base font-bold text-emerald-400">+{rawReward.toFixed(2)}</span>
            <span className="text-[10px] text-[#64748b] block">Helpfulness & Style</span>
          </div>

          <div className="p-2.5 bg-[#181c26] rounded border border-[#2e3446]">
            <span className="text-[11px] text-[#94a3b8] block">KL Penalty (&minus;&beta; &times; D_KL)</span>
            <span className="text-base font-bold text-amber-400">&minus;{klPenalty.toFixed(2)}</span>
            <span className="text-[10px] text-[#64748b] block">Base Prior Regularization</span>
          </div>

          <div className="p-2.5 bg-[#181c26] rounded border border-[#2e3446]">
            <span className="text-[11px] text-[#94a3b8] block">Net Optimization J(&phi;)</span>
            <span className="text-base font-bold text-white">{totalObjective}</span>
            <span className="text-[10px] text-[#64748b] block">Surrogate Training Signal</span>
          </div>
        </div>
      </div>

      {/* Safety & Regime Feedback */}
      <div
        className={`p-3 rounded border text-xs font-mono flex items-start gap-2.5 ${
          isWellAligned
            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
            : isRewardHacking
            ? 'bg-red-950/40 border-red-500/60 text-red-300'
            : 'bg-amber-950/40 border-amber-500/60 text-amber-300'
        }`}
      >
        {isWellAligned && <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
        {isRewardHacking && <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />}
        {isTooRigid && <HelpCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />}

        <div>
          {isWellAligned && (
            <span>
              <strong>Healthy Alignment Regime.</strong> The policy is learning helpful conversational styles while the KL
              divergence penalty prevents policy collapse or ungrammatical text gibberish.
            </span>
          )}
          {isRewardHacking && (
            <span>
              <strong>Goodhart's Law / Reward Hacking Alert!</strong> The KL penalty &beta; is too low ({betaKl.toFixed(2)}).
              The policy has drifted far from the reference model (D_KL = {policyDrift.toFixed(1)} nats) and is exploiting
              unintended loopholes in the reward model (e.g. repetitive praise or gibberish with high reward score).
            </span>
          )}
          {isTooRigid && (
            <span>
              <strong>Over-Regularized (Stubborn Base Behavior).</strong> The KL penalty &beta; is excessively high. The model
              refuses to adapt to human instructions and remains identical to the raw unaligned base model.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
