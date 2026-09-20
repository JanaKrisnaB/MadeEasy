import React from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryId } from '../types';

interface Props {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  paperCounts: Record<CategoryId | 'all', number>;
}

export const CategoryFilter: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  paperCounts,
}) => {
  return (
    <div className="py-3 overflow-x-auto scrollbar-none border-b border-[#1c2230]">
      <div className="flex items-center gap-1.5 min-w-max">
        {/* All Papers Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-bold'
              : 'bg-[#11141d] border border-[#232a3b] text-[#94a3b8] hover:text-white hover:border-[#38435d]'
          }`}
        >
          <span>All Papers</span>
          <span className="px-1.5 py-0.2 bg-[#181d2a] rounded text-[10px] text-[#cbd5e1]">
            {paperCounts['all'] || 33}
          </span>
        </button>

        {/* Individual Category Pills */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = paperCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-[#11141d] border border-[#232a3b] text-[#94a3b8] hover:text-white hover:border-[#38435d]'
              }`}
              title={cat.description}
            >
              <span>{cat.name}</span>
              <span className="px-1.5 py-0.2 bg-[#181d2a] rounded text-[10px] text-[#cbd5e1]">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
