import React from 'react';
import { Search, BookOpen, Layers, Bookmark, ArrowUpDown, ExternalLink, Code2 } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  bookmarkedCount: number;
  readCount: number;
  totalCount: number;
  isCompareOpen: boolean;
  onToggleCompare: () => void;
  onOpenReadingList: () => void;
}

export const Header: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  bookmarkedCount,
  readCount,
  totalCount,
  isCompareOpen,
  onToggleCompare,
  onOpenReadingList,
}) => {
  const readPct = Math.round((readCount / totalCount) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#090b10]/95 backdrop-blur-md border-b border-[#1c2230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#131722] border border-[#2e374d] flex items-center justify-center shrink-0">
              <span className="text-white font-mono font-bold text-sm tracking-wider">33</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight font-mono">
                  FRONTIER 33 <span className="text-[#64748b] font-normal">//</span> RESEARCH COMPENDIUM
                </h1>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#161c28] border border-[#263045] text-emerald-400 font-semibold">
                  33 Curated Papers
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] tracking-tight">
                Architectural breakthroughs, training dynamics, formal proofs, and test-time reasoning
              </p>
            </div>
          </div>

          {/* Search Bar & Action Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64 md:w-72">
              <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search papers, authors, math, or techniques..."
                className="w-full bg-[#11141d] border border-[#232a3b] text-white pl-9 pr-3 py-1.5 rounded text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-[#475569]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748b] hover:text-white cursor-pointer"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Benchmark Compare Toggle */}
            <button
              onClick={onToggleCompare}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors border cursor-pointer ${
                isCompareOpen
                  ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-[#11141d] border-[#232a3b] text-[#94a3b8] hover:text-white hover:border-[#38435d]'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compare</span>
            </button>

            {/* Reading List & Progress */}
            <button
              onClick={onOpenReadingList}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#11141d] border border-[#232a3b] hover:border-[#38435d] text-[#cbd5e1] rounded text-xs font-mono transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {readCount}/{totalCount} <span className="text-[#64748b] hidden sm:inline">({readPct}%)</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
