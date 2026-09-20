import React from 'react';
import { ChevronRight, Home, Sparkles, BookOpen, Layers, ArrowUpDown, Bookmark } from 'lucide-react';
import { CategoryId, Paper } from '../types';
import { CATEGORIES } from '../data/categories';

export type MainView = 'library' | 'benchmark' | 'reading-list';

interface Props {
  currentView: MainView;
  onNavigateView: (view: MainView) => void;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  selectedPaper: Paper | null;
  onClearSelectedPaper: () => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const Breadcrumb: React.FC<Props> = ({
  currentView,
  onNavigateView,
  selectedCategory,
  onSelectCategory,
  selectedPaper,
  onClearSelectedPaper,
  searchQuery,
  onClearSearch,
}) => {
  const categoryMeta = CATEGORIES.find((c) => c.id === selectedCategory);

  const getViewLabel = () => {
    switch (currentView) {
      case 'library':
        return 'Industry Library (50 Papers)';
      case 'benchmark':
        return 'Benchmark Matrix';
      case 'reading-list':
        return 'Study Checklist';
    }
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="bg-[#0b0e15] border-b border-[#1c2230] px-4 sm:px-6 lg:px-8 py-2.5 text-xs font-mono text-[#64748b]"
    >
      <ol className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5 pl-[1cm]">
        {/* Root: MadeEasy */}
        <li className="flex items-center gap-1.5">
          <button
            onClick={() => {
              onClearSelectedPaper();
              onSelectCategory('all');
              onClearSearch();
              onNavigateView('library');
            }}
            className="hover:text-emerald-400 text-white font-bold transition-colors cursor-pointer"
          >
            MadeEasy
          </button>
        </li>

        {/* Separator */}
        <li className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 text-[#334155]" />
        </li>

        {/* Current View Section */}
        <li className="flex items-center gap-1.5">
          <button
            onClick={() => {
              onClearSelectedPaper();
            }}
            className={`transition-colors cursor-pointer ${
              !selectedPaper && selectedCategory === 'all' && !searchQuery
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-white text-[#94a3b8]'
            }`}
          >
            {getViewLabel()}
          </button>
        </li>

        {/* Optional Category level */}
        {selectedCategory !== 'all' && categoryMeta && (
          <>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-[#334155]" />
            </li>
            <li className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onClearSelectedPaper();
                }}
                className={`transition-colors cursor-pointer ${
                  !selectedPaper ? 'text-emerald-400 font-semibold' : 'hover:text-white text-[#94a3b8]'
                }`}
              >
                {categoryMeta.name}
              </button>
            </li>
          </>
        )}

        {/* Optional Search Query level */}
        {searchQuery && (
          <>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-[#334155]" />
            </li>
            <li className="flex items-center gap-1 text-cyan-400">
              <span>search: "{searchQuery}"</span>
              <button
                onClick={onClearSearch}
                className="hover:text-white text-[#64748b] ml-1 cursor-pointer"
                title="Clear search"
              >
                &times;
              </button>
            </li>
          </>
        )}

        {/* Selected Paper level */}
        {selectedPaper && (
          <>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-[#334155]" />
            </li>
            <li className="flex items-center gap-1.5 text-white font-bold truncate max-w-[280px] sm:max-w-md">
              <span className="text-emerald-400">
                {selectedPaper.isCustom ? 'Custom' : `#${selectedPaper.number < 10 ? `0${selectedPaper.number}` : selectedPaper.number}`}
              </span>
              <span className="truncate">{selectedPaper.title}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};
