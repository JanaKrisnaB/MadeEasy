import React, { useState } from 'react';
import { Sliders, Sparkles, HelpCircle } from 'lucide-react';

interface SentenceOption {
  tokens: string[];
  description: string;
  defaultFocusIndex: number;
  highlightPairs: { [sourceIdx: number]: { [targetIdx: number]: number } };
}

const SAMPLE_SENTENCES: SentenceOption[] = [
  {
    tokens: ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'],
    description: 'Winograd Schema: "it" refers to "animal" because of "tired"',
    defaultFocusIndex: 7, // "it"
    highlightPairs: {
      7: { 1: 0.82, 5: 0.08, 10: 0.65 }, // "it" attends strongly to "animal" (1) and "tired" (10)
    },
  },
  {
    tokens: ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'wide'],
    description: 'Winograd Schema: "it" refers to "street" because of "wide"',
    defaultFocusIndex: 7, // "it"
    highlightPairs: {
      7: { 5: 0.88, 1: 0.06, 10: 0.72 }, // "it" attends strongly to "street" (5) and "wide" (10)
    },
  },
  {
    tokens: ['The', 'bank', 'approved', 'the', 'loan', 'after', 'reviewing', 'the', 'financial', 'records'],
    description: 'Contextual Polysemy: "bank" resolves to financial institution rather than river bank',
    defaultFocusIndex: 1, // "bank"
    highlightPairs: {
      1: { 4: 0.75, 8: 0.84, 9: 0.68 },
    },
  },
];

export const AttentionMatrixVisualizer: React.FC = () => {
  const [selectedSentenceIdx, setSelectedSentenceIdx] = useState(0);
  const [temperature, setTemperature] = useState(1.0); // Softmax temperature / scaling
  const [headIndex, setHeadIndex] = useState(1);
  const [focusTokenIdx, setFocusTokenIdx] = useState(7);

  const currentSentence = SAMPLE_SENTENCES[selectedSentenceIdx];
  const tokens = currentSentence.tokens;

  // Calculate synthetic attention scores given temperature and focus token
  const getAttentionWeight = (targetIdx: number) => {
    const pairWeights = currentSentence.highlightPairs[focusTokenIdx] || {};
    let rawScore = pairWeights[targetIdx] || 0.05;

    // Simulate head specialization: head 2 pays more attention to adjacent tokens
    if (headIndex === 2) {
      const distance = Math.abs(focusTokenIdx - targetIdx);
      if (distance === 1) rawScore += 0.4;
    } else if (headIndex === 3) {
      // Syntactic root head
      if (targetIdx === 3) rawScore += 0.5; // "cross" or verb
    }

    // Apply temperature scaling: softmax(logits / temp)
    const scaledScore = Math.exp(rawScore / Math.max(0.2, temperature));
    return scaledScore;
  };

  const rawScores = tokens.map((_, i) => getAttentionWeight(i));
  const sumScores = rawScores.reduce((a, b) => a + b, 0);
  const normalizedWeights = rawScores.map((score) => score / sumScores);

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Scaled Dot-Product Attention Heatmap
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Formula: <code className="text-emerald-300 font-mono">Softmax(QK^T / &radic;d_k) * V</code>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#94a3b8]">Sentence Context:</span>
          <select
            value={selectedSentenceIdx}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedSentenceIdx(idx);
              setFocusTokenIdx(SAMPLE_SENTENCES[idx].defaultFocusIndex);
            }}
            className="bg-[#181c26] border border-[#2e3446] text-white px-2.5 py-1 rounded text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value={0}>Winograd A: "...too tired"</option>
            <option value={1}>Winograd B: "...too wide"</option>
            <option value={2}>Polysemy: "Financial Bank"</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-[#94a3b8] italic my-3 bg-[#131722] px-3 py-2 rounded border border-[#232734]">
        {currentSentence.description}
      </p>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 p-3 bg-[#131722] rounded border border-[#232734]">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#94a3b8]">Softmax Temperature / Scale:</span>
            <span className="text-emerald-400 font-bold">{temperature.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] mt-0.5">
            <span>Sharp / Argmax (0.2)</span>
            <span>Default (1.0)</span>
            <span>Diffused / Uniform (3.0)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#94a3b8]">Attention Head:</span>
            <span className="text-emerald-400 font-bold">Head #{headIndex} (of 8)</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((h) => (
              <button
                key={h}
                onClick={() => setHeadIndex(h)}
                className={`flex-1 py-1 text-xs rounded border transition-colors ${
                  headIndex === h
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-[#181c26] border-[#2e3446] text-[#94a3b8] hover:border-[#475569]'
                }`}
              >
                H{h}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#64748b] mt-1.5">
            {headIndex === 1 && 'H1: Coreference Semantic Resolver'}
            {headIndex === 2 && 'H2: Local Positional Adjacency'}
            {headIndex === 3 && 'H3: Verb-Object Syntactic Predicate'}
            {headIndex === 4 && 'H4: Global Broad Sentence Averaging'}
          </p>
        </div>
      </div>

      {/* Interactive Token Sequence */}
      <div className="my-4">
        <label className="text-xs text-[#94a3b8] font-mono block mb-2">
          Click any Query token to inspect its attention distribution over Keys:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {tokens.map((token, idx) => {
            const isFocus = idx === focusTokenIdx;
            const weight = normalizedWeights[idx];
            return (
              <button
                key={idx}
                onClick={() => setFocusTokenIdx(idx)}
                className={`px-2.5 py-1.5 rounded text-xs font-mono transition-all relative ${
                  isFocus
                    ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400 shadow-md'
                    : 'bg-[#181c26] border border-[#2e3446] text-[#cbd5e1] hover:border-[#64748b]'
                }`}
              >
                {token}
                <span className="block text-[9px] text-[#94a3b8] mt-0.5">#{idx}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Attention Distribution Matrix Bar */}
      <div className="mt-5 pt-4 border-t border-[#232734]">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-[#cbd5e1]">
            Attention weights from Query <strong className="text-emerald-400">"{tokens[focusTokenIdx]}"</strong> to all Keys:
          </span>
          <span className="text-[#94a3b8] text-[11px]">&Sigma; weights = 1.000</span>
        </div>

        <div className="space-y-2">
          {tokens.map((token, idx) => {
            const weight = normalizedWeights[idx];
            const pct = (weight * 100).toFixed(1);
            const isHigh = weight > 0.15;
            return (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                <span className="w-16 truncate text-right text-[#94a3b8]">
                  {token}
                </span>
                <div className="flex-1 h-5 bg-[#181c26] rounded overflow-hidden border border-[#232734] relative">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isHigh ? 'bg-emerald-500' : 'bg-[#334155]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-[10px] text-[#cbd5e1]">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-2.5 bg-[#141824] rounded border border-[#232734] text-[11px] text-[#94a3b8] flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong>Key Insight:</strong> Notice how switching between Sentence A ("...tired") and Sentence B ("...wide") causes
          the Query vector for <code className="text-white">"it"</code> to decisively flip its highest Key dot-product affinity
          between <code className="text-emerald-300">"animal"</code> and <code className="text-emerald-300">"street"</code>.
          This illustrates how multi-head self-attention resolves ambiguous pronouns dynamically without hand-coded grammar trees.
        </span>
      </div>
    </div>
  );
};
