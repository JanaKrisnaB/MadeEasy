import React, { useState } from 'react';
import { Layers, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ExpertState {
  id: number;
  name: string;
  domain: string;
  assignedTokens: string[];
}

const SAMPLE_TOKENS = [
  { text: '∫(x²dx)', domain: 'Math / Calculus' },
  { text: 'def quicksort(a):', domain: 'Code / Python' },
  { text: 'Le ciel est bleu', domain: 'Language / French' },
  { text: 'np.matmul(A, B)', domain: 'Tensor / Algebra' },
  { text: 'Epistemology of mind', domain: 'Philosophy' },
  { text: 'async function fetch()', domain: 'Web Dev / JS' },
  { text: 'RNA polymerase II', domain: 'Biology / Genetics' },
  { text: 'SELECT * FROM users', domain: 'Database / SQL' },
];

export const MoeRouterVisualizer: React.FC = () => {
  const [routingMode, setRoutingMode] = useState<'top1' | 'top2' | 'deepseek_top8'>('top1');
  const [capacityFactor, setCapacityFactor] = useState<number>(1.25);
  const [seed, setSeed] = useState(0);

  const numExperts = 8;
  const expertCapacity = Math.ceil((SAMPLE_TOKENS.length / numExperts) * capacityFactor);

  // Simulate routing distributions based on semantic affinities
  const experts: ExpertState[] = [
    { id: 0, name: 'E0: Logic & Math', domain: 'Math/Calculus', assignedTokens: [] },
    { id: 1, name: 'E1: Python & Algorithms', domain: 'Python/Algo', assignedTokens: [] },
    { id: 2, name: 'E2: Multilingual & Lexical', domain: 'NLP/Languages', assignedTokens: [] },
    { id: 3, name: 'E3: Linear Algebra & Matrix', domain: 'Tensor/Math', assignedTokens: [] },
    { id: 4, name: 'E4: Humanities & Reasoning', domain: 'Philosophy/Logic', assignedTokens: [] },
    { id: 5, name: 'E5: Web & Systems', domain: 'JS/Async/OS', assignedTokens: [] },
    { id: 6, name: 'E6: Natural Sciences', domain: 'Bio/Chem', assignedTokens: [] },
    { id: 7, name: 'E7: Query & Data Engineering', domain: 'SQL/Storage', assignedTokens: [] },
  ];

  const droppedTokens: { token: string; intendedExpert: number }[] = [];

  // Assign tokens
  SAMPLE_TOKENS.forEach((t, idx) => {
    // Primary expert choice matches semantic domain index
    const primaryExpertId = idx % numExperts;
    const secondaryExpertId = (idx + 1) % numExperts;

    const targets = routingMode === 'top1' ? [primaryExpertId] : [primaryExpertId, secondaryExpertId];

    targets.forEach((expertId) => {
      if (experts[expertId].assignedTokens.length < expertCapacity) {
        experts[expertId].assignedTokens.push(t.text);
      } else {
        droppedTokens.push({ token: t.text, intendedExpert: expertId });
      }
    });
  });

  const totalAssigned = experts.reduce((acc, e) => acc + e.assignedTokens.length, 0);
  const maxLoad = Math.max(...experts.map((e) => e.assignedTokens.length));
  const minLoad = Math.min(...experts.map((e) => e.assignedTokens.length));
  const loadImbalance = (maxLoad - minLoad).toFixed(1);

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Sparse Mixture-of-Experts (MoE) Router Simulation
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Gating: <code className="text-purple-300 font-mono">Top-k(Softmax(W_g &times; x + &epsilon;))</code> &nbsp;|&nbsp;
            Auxiliary Loss: <code className="text-purple-300 font-mono">&alpha; &times; N &times; &sum; f_i &times; P_i</code>
          </p>
        </div>

        <div className="flex bg-[#181c26] border border-[#2e3446] rounded p-0.5 text-xs font-mono">
          <button
            onClick={() => setRoutingMode('top1')}
            className={`px-2.5 py-1 rounded transition-colors ${
              routingMode === 'top1'
                ? 'bg-purple-950 text-purple-300 font-bold border border-purple-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Switch Top-1
          </button>
          <button
            onClick={() => setRoutingMode('top2')}
            className={`px-2.5 py-1 rounded transition-colors ${
              routingMode === 'top2'
                ? 'bg-purple-950 text-purple-300 font-bold border border-purple-500'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Mixtral Top-2
          </button>
        </div>
      </div>

      {/* Capacity Factor Slider */}
      <div className="my-4 p-3 bg-[#131722] rounded border border-[#232734] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex-1 min-w-[240px]">
          <div className="flex justify-between mb-1.5">
            <span className="text-[#cbd5e1]">Expert Capacity Factor (CF):</span>
            <span className="text-purple-400 font-bold">{capacityFactor.toFixed(2)}x (Buffer: {expertCapacity} tokens/expert)</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.0"
            step="0.1"
            value={capacityFactor}
            onChange={(e) => setCapacityFactor(parseFloat(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[#64748b] block text-[10px]">Tokens Dropped:</span>
            <span className={`font-bold ${droppedTokens.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {droppedTokens.length} tokens
            </span>
          </div>
          <div>
            <span className="text-[#64748b] block text-[10px]">Max Load Disparity:</span>
            <span className="text-white font-bold">{loadImbalance} tokens</span>
          </div>
        </div>
      </div>

      {/* Visual Expert Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {experts.map((exp) => {
          const isFull = exp.assignedTokens.length >= expertCapacity;
          const pct = Math.min(100, (exp.assignedTokens.length / expertCapacity) * 100);

          return (
            <div
              key={exp.id}
              className={`p-3 rounded border transition-all ${
                isFull
                  ? 'bg-purple-950/30 border-purple-500/70'
                  : 'bg-[#131722] border-[#232734]'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="font-bold text-white text-[11px] truncate">{exp.name}</span>
                <span className="text-[10px] text-purple-300 font-mono">
                  {exp.assignedTokens.length}/{expertCapacity}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#1e2330] rounded-full overflow-hidden my-2">
                <div
                  className={`h-full transition-all ${
                    isFull ? 'bg-amber-400' : 'bg-purple-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Tokens assigned */}
              <div className="space-y-1 min-h-[44px]">
                {exp.assignedTokens.map((tok, i) => (
                  <span
                    key={i}
                    className="block text-[10px] font-mono bg-[#181c26] text-purple-200 px-1.5 py-0.5 rounded border border-[#2a3042] truncate"
                  >
                    {tok}
                  </span>
                ))}
                {exp.assignedTokens.length === 0 && (
                  <span className="text-[10px] text-[#64748b] italic">Idle / No tokens</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overflow Notification or Safe status */}
      {droppedTokens.length > 0 ? (
        <div className="p-3 bg-amber-950/40 border border-amber-500/60 rounded text-xs font-mono text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <strong>Buffer Overflow Alert:</strong> {droppedTokens.length} token(s) exceeded the expert capacity buffer
            and were passed through residual connections without FFN computation. Increase the Capacity Factor or raise
            the auxiliary load-balancing loss weight <code className="text-white">&alpha;</code>.
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/60 rounded text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            <strong>Zero Dropped Tokens.</strong> Gating distribution fits within buffer limits. 100% of tokens received
            expert FFN transformations.
          </span>
        </div>
      )}
    </div>
  );
};
