import React from 'react';
import { Paper } from '../types';
import { CATEGORIES } from '../data/categories';
import { ExternalLink, Bookmark, CheckCircle2, Circle, ArrowUpRight, Cpu, Sparkles } from 'lucide-react';

interface Props {
  paper: Paper;
  isBookmarked: boolean;
  isRead: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onToggleRead: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export const PaperCard: React.FC<Props> = ({
  paper,
  isBookmarked,
  isRead,
  onToggleBookmark,
  onToggleRead,
  onClick,
}) => {
  const categoryMeta = CATEGORIES.find((c) => c.id === paper.category);
  const primaryBenchmark = paper.empiricalBenchmarks[0];

  return (
    <article
      onClick={onClick}
      className={`group relative bg-[#0d1017] border rounded-lg p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg ${
        isRead
          ? 'border-[#1e2738] opacity-90'
          : 'border-[#1c2230] hover:border-[#38435d] hover:bg-[#10141e]'
      }`}
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`font-bold px-2 py-0.5 rounded border ${
                paper.isCustom
                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
                  : 'bg-[#141b26] border-[#232f42] text-emerald-400'
              }`}
            >
              {paper.isCustom ? 'CUSTOM' : `#${paper.number < 10 ? `0${paper.number}` : paper.number}`}
            </span>
            <span className="text-[#64748b] text-[11px] truncate max-w-[140px]">
              {categoryMeta?.name || 'Frontier AI'}
            </span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Read status toggle */}
            <button
              onClick={onToggleRead}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isRead
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-[#475569] hover:text-[#94a3b8]'
              }`}
              title={isRead ? 'Mark as unread' : 'Mark as read'}
            >
              {isRead ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </button>

            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isBookmarked
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-[#475569] hover:text-[#94a3b8]'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark paper'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            {/* ArXiv direct link */}
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-[#475569] hover:text-white transition-colors cursor-pointer"
              title="Open ArXiv page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-base font-bold text-white font-mono tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
          {paper.title}
        </h3>
        <p className="text-xs text-[#94a3b8] font-mono mt-1 mb-3">
          {paper.subtitle}
        </p>

        {/* Authors, Year & Organization */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748b] font-mono mb-3.5">
          <span className="text-[#cbd5e1]">{paper.organization}</span>
          <span>&bull;</span>
          <span>{paper.year}</span>
          <span>&bull;</span>
          <span className="truncate max-w-[130px]">{paper.authors}</span>
        </div>

        {/* TL;DR */}
        <p className="text-xs text-[#cbd5e1] leading-relaxed line-clamp-3 mb-4">
          {paper.tldr}
        </p>
      </div>

      {/* Bottom Key Techniques and Benchmark Highlight */}
      <div>
        {/* Primary Benchmark Highlight Pill */}
        {primaryBenchmark && (
          <div className="mb-3 p-2 bg-[#121622] rounded border border-[#212738] font-mono text-[11px] flex items-center justify-between gap-2">
            <span className="text-[#64748b] truncate">{primaryBenchmark.benchmarkName.split('(')[0]}:</span>
            <span className="text-emerald-400 font-bold shrink-0">{primaryBenchmark.paperScore}</span>
          </div>
        )}

        {/* Key Technique Tags */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#1c2230]">
          {paper.keyTechniques.slice(0, 2).map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono bg-[#141824] text-[#94a3b8] px-2 py-0.5 rounded border border-[#23293c] truncate max-w-[200px]"
            >
              {tech}
            </span>
          ))}
          {paper.keyTechniques.length > 2 && (
            <span className="text-[10px] font-mono text-[#64748b] px-1 py-0.5">
              +{paper.keyTechniques.length - 2} more
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
