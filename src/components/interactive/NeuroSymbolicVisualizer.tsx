import React, { useState } from 'react';
import { Network, CheckCircle2, ChevronRight, Sparkles, Cpu, RotateCcw } from 'lucide-react';

interface ProofStep {
  step: number;
  engine: 'symbolic' | 'neural';
  title: string;
  statement: string;
  mathDetail: string;
}

const SAMPLE_PROOF_STEPS: ProofStep[] = [
  {
    step: 1,
    engine: 'symbolic',
    title: 'Deductive Database (DD) Rule Inference',
    statement: 'Given: Triangle ABC with altitudes AD, BE intersecting at orthocenter H.',
    mathDetail: 'DD asserts: ∠ADC = 90°, ∠BEC = 90° → Points C, D, H, E form cyclic quadrilateral.',
  },
  {
    step: 2,
    engine: 'symbolic',
    title: 'Algebraic Reasoning (AR) Closure',
    statement: 'Propagate angle subtended chords on circumcircle.',
    mathDetail: 'Deduced: ∠DHE = 180° - ∠C. No further theorems reachable from current premises.',
  },
  {
    step: 3,
    engine: 'symbolic',
    title: 'Dead-End Detected (Impasse reached)',
    statement: 'Symbolic engine exhausted: cannot prove target collinearity without helper objects.',
    mathDetail: 'Proof search stalled. Triggering neural construction predictor...',
  },
  {
    step: 4,
    engine: 'neural',
    title: 'Neural Transformer Auxiliary Construction',
    statement: 'Transformer predicts creative geometric leap based on 100M synthetic proofs.',
    mathDetail: 'Neural proposal: "Construct midpoint M of segment BC and draw line HM."',
  },
  {
    step: 5,
    engine: 'symbolic',
    title: 'Symbolic Engine Resumes with New Construction',
    statement: 'Deductive Database absorbs auxiliary midpoint M into the geometric graph.',
    mathDetail: 'DD asserts: M is center of circle passing through B, C, D, E. Thus DM = EM.',
  },
  {
    step: 6,
    engine: 'symbolic',
    title: 'Q.E.D. Final Formal Verification',
    statement: 'Target theorem resolved with zero human guidance!',
    mathDetail: 'Verified sound by Deductive Database kernel. Formal Proof Closed! 🎉',
  },
];

export const NeuroSymbolicVisualizer: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const activeStep = SAMPLE_PROOF_STEPS[currentStepIdx];
  const isComplete = currentStepIdx === SAMPLE_PROOF_STEPS.length - 1;

  const handleNext = () => {
    if (currentStepIdx < SAMPLE_PROOF_STEPS.length - 1) {
      setCurrentStepIdx((s) => s + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
  };

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            AlphaGeometry Neuro-Symbolic Proof Loop
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Deductive Database (Rigorous Truth) &harr; Neural Transformer (Creative Intuition)
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleNext}
            disabled={isComplete}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors ${
              isComplete
                ? 'bg-[#181c26] text-[#64748b] cursor-not-allowed border border-[#232734]'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isComplete ? 'Proof Closed (Q.E.D.)' : 'Execute Next Deduction'}
            {!isComplete && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-[#181c26] border border-[#2e3446] hover:text-white text-[#94a3b8] rounded"
            title="Reset proof trace"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="my-4 flex items-center gap-1 overflow-x-auto pb-2">
        {SAMPLE_PROOF_STEPS.map((s, idx) => {
          const isPassed = idx <= currentStepIdx;
          const isCurrent = idx === currentStepIdx;
          const isNeural = s.engine === 'neural';

          return (
            <button
              key={s.step}
              onClick={() => setCurrentStepIdx(idx)}
              className={`flex-1 min-w-[120px] p-2 rounded border text-left font-mono text-xs transition-all ${
                isCurrent
                  ? isNeural
                    ? 'bg-purple-950/60 border-purple-400 text-purple-200 ring-1 ring-purple-400'
                    : 'bg-emerald-950/60 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                  : isPassed
                  ? 'bg-[#131722] border-[#2e3446] text-[#cbd5e1]'
                  : 'bg-[#0b0e14] border-[#1a1f2c] text-[#475569]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span>Step {s.step}</span>
                {isNeural ? (
                  <span className="text-purple-400 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Neural
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <Cpu className="w-2.5 h-2.5" /> Symbolic
                  </span>
                )}
              </div>
              <div className="truncate font-bold text-[11px]">{s.title.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep Dive Card */}
      <div className="my-4 p-4 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                activeStep.engine === 'neural'
                  ? 'bg-purple-950 text-purple-300 border border-purple-500'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              }`}
            >
              Engine: {activeStep.engine === 'neural' ? 'Neural Auxiliary Predictor' : 'Symbolic Deductive Database'}
            </span>
            <span className="text-white font-bold">{activeStep.title}</span>
          </div>
          <span className="text-[#94a3b8] text-[11px]">
            Step {activeStep.step} of {SAMPLE_PROOF_STEPS.length}
          </span>
        </div>

        <p className="text-[#cbd5e1] mb-2">{activeStep.statement}</p>

        <div className="p-3 bg-[#0a0d13] rounded border border-[#1e2330] text-emerald-300 text-[11px]">
          <span className="text-[#64748b] block mb-0.5 font-bold">Formal Trace:</span>
          {activeStep.mathDetail}
        </div>
      </div>

      {/* Neuro-symbolic Philosophy insight */}
      <div className="p-3 bg-[#111622] rounded border border-[#232734] text-xs font-mono text-[#94a3b8]">
        <strong>Why this matters:</strong> Pure LLMs hallucinate false mathematical steps in geometry. Pure symbolic
        solvers cannot invent new auxiliary constructions. AlphaGeometry combines both: the symbolic engine prevents
        100% of hallucinations, while the neural model provides human-like creative geometric intuition.
      </div>
    </div>
  );
};
