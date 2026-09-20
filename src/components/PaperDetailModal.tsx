import React, { useState, useEffect } from 'react';
import { Paper } from '../types';
import { CATEGORIES } from '../data/categories';
import { InteractiveToyContainer } from './interactive/InteractiveToyContainer';
import { MathView, FormattedMathText } from './MathView';
import {
  X,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Cpu,
  Layers,
  Activity,
  Code2,
  TrendingUp,
  Wrench,
  BookOpen,
} from 'lucide-react';

interface Props {
  paper: Paper;
  isBookmarked: boolean;
  isRead: boolean;
  onToggleBookmark: () => void;
  onToggleRead: () => void;
  onClose: () => void;
  onPrevPaper: () => void;
  onNextPaper: () => void;
}

type TabType = 'intuition' | 'architecture' | 'training' | 'interactive' | 'code' | 'benchmarks' | 'replication';

export const PaperDetailModal: React.FC<Props> = ({
  paper,
  isBookmarked,
  isRead,
  onToggleBookmark,
  onToggleRead,
  onClose,
  onPrevPaper,
  onNextPaper,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('intuition');
  const [copiedCode, setCopiedCode] = useState(false);

  const categoryMeta = CATEGORIES.find((c) => c.id === paper.category);

  // Lock background body scrolling while modal is open
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevPaper();
      if (e.key === 'ArrowRight') onNextPaper();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevPaper, onNextPaper]);

  const copySnippet = () => {
    navigator.clipboard.writeText(paper.codeSnippet.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'intuition', label: 'Intuition & Novelty', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'architecture', label: 'Architecture & Workflow', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'training', label: 'Training Dynamics', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'interactive', label: 'Interactive Sandbox', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code Implementation', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'benchmarks', label: 'Benchmarks & Alternatives', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'replication', label: 'Replication Guide', icon: <Wrench className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 overscroll-contain overflow-hidden"
    >
      <div
        className="bg-[#090b10] border border-[#232b3b] rounded-xl w-full max-w-5xl h-[94vh] flex flex-col shadow-2xl overflow-hidden text-[#e2e8f0] overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#1c2230] bg-[#0c0f17] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span
              className={`font-mono font-bold text-sm px-2.5 py-1 rounded border ${
                paper.isCustom
                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
                  : 'bg-[#131a26] border-[#233145] text-emerald-400'
              }`}
            >
              {paper.isCustom ? 'CUSTOM' : `#${paper.number < 10 ? `0${paper.number}` : paper.number}`}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#64748b]">{categoryMeta?.name}</span>
                <span className="text-[#334155]">&bull;</span>
                <span className="text-xs font-mono text-[#cbd5e1]">{paper.organization}</span>
                <span className="text-[#334155]">&bull;</span>
                <span className="text-xs font-mono text-[#64748b]">{paper.year}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-tight leading-snug">
                {paper.title}
              </h2>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleRead}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-colors cursor-pointer ${
                isRead
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-[#121622] border-[#22293b] text-[#94a3b8] hover:text-white'
              }`}
            >
              {isRead ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isRead ? 'Mastered' : 'Mark Read'}</span>
            </button>

            <button
              onClick={onToggleBookmark}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                  : 'bg-[#121622] border-[#22293b] text-[#94a3b8] hover:text-white'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 bg-[#121622] border border-[#22293b] hover:border-[#38435d] text-[#cbd5e1] hover:text-white rounded text-xs font-mono transition-colors cursor-pointer"
            >
              <span>ArXiv</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Prev/Next Paper Arrows */}
            <div className="flex items-center gap-1 ml-1 border-l border-[#1c2230] pl-2">
              <button
                onClick={onPrevPaper}
                className="p-1.5 bg-[#121622] border border-[#22293b] hover:text-white text-[#94a3b8] rounded cursor-pointer"
                title="Previous Paper (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNextPaper}
                className="p-1.5 bg-[#121622] border border-[#22293b] hover:text-white text-[#94a3b8] rounded cursor-pointer"
                title="Next Paper (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 bg-[#121622] border border-[#22293b] hover:bg-red-950 hover:border-red-500 hover:text-red-300 text-[#94a3b8] rounded ml-1 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#0b0e15] border-b border-[#1c2230] px-4 overflow-x-auto scrollbar-none flex items-center gap-1 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono border-b-2 transition-all min-w-max cursor-pointer ${
                activeTab === t.id
                  ? 'border-emerald-500 text-emerald-300 font-bold bg-[#111622]'
                  : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 overscroll-contain">
          {/* TAB 1: INTUITION & NOVELTY */}
          {activeTab === 'intuition' && (
            <div className="space-y-6 max-w-4xl">
              {/* Intuitive Explanation */}
              <div className="p-4 bg-[#0e121a] rounded-lg border border-[#1e2636]">
                <h3 className="text-xs font-mono uppercase text-[#64748b] tracking-wider mb-2 font-bold">
                  Intuitive Mental Model
                </h3>
                <p className="text-sm leading-relaxed text-[#cbd5e1] font-sans">
                  {paper.intuitiveExplanation}
                </p>
              </div>

              {/* Core Novelties */}
              <div>
                <h3 className="text-sm font-bold text-white font-mono tracking-tight mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Primary Scientific Novelties & Breakthroughs
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {paper.novelty.map((nov, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#0d1017] rounded border border-[#1c2230] font-mono text-xs flex items-start gap-3"
                    >
                      <span className="text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                      <span className="text-[#cbd5e1] leading-relaxed">{nov}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Techniques */}
              <div>
                <h3 className="text-sm font-bold text-white font-mono tracking-tight mb-3">
                  Key Technical Components
                </h3>
                <div className="flex flex-wrap gap-2">
                  {paper.keyTechniques.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#121622] rounded border border-[#232a3b] text-xs font-mono text-emerald-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE & WORKFLOW */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 max-w-4xl">
              {/* Architecture Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0e121a] rounded-lg border border-[#1e2636]">
                  <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold mb-2">
                    Scalability Mechanism
                  </h4>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed font-sans">
                    {paper.architecture.scalabilityMechanism}
                  </p>
                </div>

                <div className="p-4 bg-[#0e121a] rounded-lg border border-[#1e2636]">
                  <h4 className="text-xs font-mono uppercase text-amber-400 font-bold mb-2">
                    Bottleneck Solved
                  </h4>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed font-sans">
                    {paper.architecture.bottleneckSolved}
                  </p>
                </div>
              </div>

              {/* Core Concepts */}
              <div className="p-4 bg-[#0d1017] rounded-lg border border-[#1c2230]">
                <h4 className="text-xs font-mono uppercase text-[#64748b] font-bold mb-2">
                  Architectural Foundation
                </h4>
                <ul className="space-y-1.5 font-mono text-xs text-[#cbd5e1]">
                  {paper.architecture.coreConcepts.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">&bull;</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Mathematical Workflow */}
              <div>
                <h3 className="text-sm font-bold text-white font-mono tracking-tight mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Execution Flow & Algorithmic Pipeline
                </h3>
                <div className="space-y-3">
                  {paper.workflow.map((wf) => (
                    <div
                      key={wf.step}
                      className="p-3.5 bg-[#0d1017] rounded border border-[#1c2230] font-mono text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-emerald-400 font-bold">
                          Step {wf.step}: {wf.title}
                        </span>
                      </div>
                      <p className="text-[#cbd5e1] leading-relaxed font-sans mb-2">
                        <FormattedMathText text={wf.description} />
                      </p>
                      {wf.mathFormula && (
                        <MathView math={wf.mathFormula} displayMode={true} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRAINING DYNAMICS */}
          {activeTab === 'training' && (
            <div className="space-y-5 max-w-4xl">
              <div className="p-4 bg-[#0e121a] rounded-lg border border-[#1e2636] font-mono text-xs space-y-3">
                <div className="border-b border-[#1c2230] pb-3">
                  <span className="text-[#64748b] uppercase text-[10px] font-bold block mb-1">
                    Optimizer, Learning Rate & Scheduler
                  </span>
                  <span className="text-white text-xs leading-relaxed">
                    <FormattedMathText text={paper.trainingDynamics.optimizerAndSchedule} />
                  </span>
                </div>

                <div className="border-b border-[#1c2230] pb-3">
                  <span className="text-[#64748b] uppercase text-[10px] font-bold block mb-1">
                    Loss Function & Objective Formulation
                  </span>
                  {paper.trainingDynamics.lossFunction.includes('\\') || paper.trainingDynamics.lossFunction.includes('$$') ? (
                    <MathView math={paper.trainingDynamics.lossFunction} displayMode={true} />
                  ) : (
                    <span className="text-emerald-300 text-xs leading-relaxed block">
                      <FormattedMathText text={paper.trainingDynamics.lossFunction} />
                    </span>
                  )}
                </div>

                <div className="border-b border-[#1c2230] pb-3">
                  <span className="text-[#64748b] uppercase text-[10px] font-bold block mb-1">
                    Compute Cluster & Hardware Acceleration
                  </span>
                  <span className="text-white text-xs leading-relaxed">
                    {paper.trainingDynamics.computeAndHardware}
                  </span>
                </div>

                <div>
                  <span className="text-[#64748b] uppercase text-[10px] font-bold block mb-1">
                    Numerical Stability & Convergence Engineering
                  </span>
                  <span className="text-[#cbd5e1] text-xs leading-relaxed">
                    {paper.trainingDynamics.stabilityTricks}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE TOY SANDBOX */}
          {activeTab === 'interactive' && (
            <div className="max-w-4xl">
              <InteractiveToyContainer paper={paper} />
            </div>
          )}

          {/* TAB 5: CODE IMPLEMENTATION */}
          {activeTab === 'code' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between bg-[#11141d] px-4 py-2.5 rounded-t-lg border border-[#232a3b] font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-bold">{paper.codeSnippet.filename}</span>
                  <span className="text-[#64748b] text-[11px]">({paper.codeSnippet.language})</span>
                </div>
                <button
                  onClick={copySnippet}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181c26] border border-[#2e3547] hover:border-emerald-500 text-[#cbd5e1] hover:text-white transition-colors text-xs cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="p-4 bg-[#080a0f] border-x border-b border-[#232a3b] rounded-b-lg overflow-x-auto font-mono text-xs leading-relaxed text-[#cbd5e1]">
                <p className="text-[#64748b] italic mb-3 text-[11px]">
                  # {paper.codeSnippet.description}
                </p>
                <pre className="text-emerald-300/90 whitespace-pre">{paper.codeSnippet.code}</pre>
              </div>
            </div>
          )}

          {/* TAB 6: BENCHMARKS & ALTERNATIVES */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-6 max-w-4xl">
              {/* Benchmarks Table */}
              <div>
                <h3 className="text-sm font-bold text-white font-mono tracking-tight mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Empirical Benchmark Evaluations
                </h3>
                <div className="border border-[#1c2230] rounded-lg overflow-hidden font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#11141d] border-b border-[#1c2230] text-[#64748b] text-[11px]">
                      <tr>
                        <th className="p-3 font-semibold">Benchmark</th>
                        <th className="p-3 font-semibold text-emerald-400">Paper Score</th>
                        <th className="p-3 font-semibold">Baseline</th>
                        <th className="p-3 font-semibold text-cyan-400">Gain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c2230] bg-[#0d1017]">
                      {paper.empiricalBenchmarks.map((b, idx) => (
                        <tr key={idx} className="hover:bg-[#121622] transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-white">{b.benchmarkName}</div>
                            <div className="text-[10px] text-[#64748b] font-sans mt-0.5">{b.analysis}</div>
                          </td>
                          <td className="p-3 font-bold text-emerald-400">{b.paperScore}</td>
                          <td className="p-3 text-[#94a3b8]">
                            <div>{b.previousIterationScore}</div>
                            <div className="text-[10px] text-[#64748b]">{b.baselineName}</div>
                          </td>
                          <td className="p-3 font-bold text-cyan-400">{b.relativeGain}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alternatives & Tradeoffs */}
              <div>
                <h3 className="text-sm font-bold text-white font-mono tracking-tight mb-3">
                  Relevant Alternatives & Paradigm Trade-offs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paper.alternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#0d1017] rounded border border-[#1c2230] font-mono text-xs space-y-1.5"
                    >
                      <div className="font-bold text-white">{alt.name}</div>
                      <div className="text-[#94a3b8] text-[11px] font-sans">{alt.comparison}</div>
                      <div className="text-amber-300/90 text-[11px] pt-1 border-t border-[#1c2230] font-sans">
                        <strong>Tradeoff: </strong>
                        {alt.tradeoff}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REPLICATION GUIDE */}
          {activeTab === 'replication' && (
            <div className="space-y-5 max-w-4xl font-mono text-xs">
              {/* Difficulty & Hardware Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#0e121a] rounded border border-[#1e2636]">
                  <span className="text-[10px] text-[#64748b] uppercase block mb-1 font-bold">
                    Replication Difficulty
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-xs inline-block ${
                      paper.replicationGuide.difficulty === 'Introductory'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        : paper.replicationGuide.difficulty === 'Intermediate'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500'
                        : paper.replicationGuide.difficulty === 'Advanced'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500'
                        : 'bg-purple-950 text-purple-300 border border-purple-500'
                    }`}
                  >
                    {paper.replicationGuide.difficulty}
                  </span>
                </div>

                <div className="p-3 bg-[#0e121a] rounded border border-[#1e2636] sm:col-span-2">
                  <span className="text-[10px] text-[#64748b] uppercase block mb-1 font-bold">
                    Minimum Hardware
                  </span>
                  <span className="text-white text-xs">{paper.replicationGuide.minHardware}</span>
                </div>
              </div>

              {/* Libraries & Datasets */}
              <div className="p-4 bg-[#0d1017] rounded border border-[#1c2230] space-y-3">
                <div>
                  <span className="text-[#64748b] uppercase text-[10px] font-bold block mb-1.5">
                    Core Python / Accelerator Libraries:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {paper.replicationGuide.libraries.map((lib, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#141824] rounded border border-[#23293c] text-emerald-300"
                      >
                        {lib}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[#64748b] uppercase text-[10px] font-bold block mb-1.5">
                    Primary Evaluation Datasets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {paper.replicationGuide.datasets.map((ds, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#141824] rounded border border-[#23293c] text-cyan-300"
                      >
                        {ds}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Recipe */}
              <div className="p-4 bg-[#0d1017] rounded border border-[#1c2230]">
                <h4 className="text-white font-bold text-xs mb-3 uppercase tracking-wide">
                  Step-by-Step Reproduction Recipe:
                </h4>
                <ol className="space-y-2">
                  {paper.replicationGuide.reproducibilityRecipe.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[#cbd5e1]">
                      <span className="text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                      <span className="leading-relaxed font-sans">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Official Repository Link */}
              {paper.replicationGuide.githubOrRepo && (
                <div className="flex items-center justify-between p-3 bg-[#11141d] rounded border border-[#232a3b]">
                  <span className="text-[#94a3b8]">Official Source Repository / Implementation:</span>
                  <a
                    href={paper.replicationGuide.githubOrRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                  >
                    <span>Open GitHub Repo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
