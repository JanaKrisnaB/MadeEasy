import React, { useState } from 'react';
import { Paper } from '../types';
import { Bookmark, CheckCircle2, Circle, X, Trash2, BookOpen } from 'lucide-react';

interface Props {
  papers: Paper[];
  bookmarkedIds: Set<string>;
  readIds: Set<string>;
  onToggleBookmark: (id: string) => void;
  onToggleRead: (id: string) => void;
  onSelectPaper: (paper: Paper) => void;
  onClose: () => void;
}

export const ReadingListDrawer: React.FC<Props> = ({
  papers,
  bookmarkedIds,
  readIds,
  onToggleBookmark,
  onToggleRead,
  onSelectPaper,
  onClose,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarked' | 'unread' | 'completed'>('all');

  React.useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const total = papers.length;
  const readCount = readIds.size;
  const readPct = Math.round((readCount / total) * 100);

  const filteredPapers = papers.filter((p) => {
    if (filterMode === 'bookmarked') return bookmarkedIds.has(p.id);
    if (filterMode === 'unread') return !readIds.has(p.id);
    if (filterMode === 'completed') return readIds.has(p.id);
    return true;
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overscroll-contain overflow-hidden"
    >
      <div
        className="bg-[#090b10] border-l border-[#232b3b] w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden text-[#e2e8f0] overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1c2230] bg-[#0c0f17] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-white font-mono tracking-tight">
                RESEARCH STUDY CHECKLIST
              </h2>
              <p className="text-[11px] text-[#94a3b8] font-mono">
                {readCount} of {total} Papers Mastered ({readPct}%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#121622] border border-[#22293b] hover:text-white text-[#94a3b8] rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-5 py-3 bg-[#0d1017] border-b border-[#1c2230]">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#94a3b8]">Curriculum Completion:</span>
            <span className="text-emerald-400 font-bold">{readPct}%</span>
          </div>
          <div className="h-2 bg-[#181c26] rounded-full overflow-hidden border border-[#232734]">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${readPct}%` }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 bg-[#0b0e15] border-b border-[#1c2230] flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {(['all', 'bookmarked', 'unread', 'completed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-2.5 py-1 rounded transition-colors capitalize cursor-pointer ${
                filterMode === mode
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Papers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs overscroll-contain">
          {filteredPapers.length === 0 ? (
            <div className="text-center py-12 text-[#64748b]">
              No papers found in this filter view.
            </div>
          ) : (
            filteredPapers.map((paper) => {
              const isRead = readIds.has(paper.id);
              const isBookmarked = bookmarkedIds.has(paper.id);

              return (
                <div
                  key={paper.id}
                  onClick={() => onSelectPaper(paper)}
                  className="p-3 bg-[#0e121a] hover:bg-[#121622] rounded border border-[#1c2230] hover:border-[#2e374d] cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRead(paper.id);
                      }}
                      className="mt-0.5 text-[#64748b] hover:text-emerald-400 shrink-0 cursor-pointer"
                    >
                      {isRead ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] mb-0.5">
                        <span className="text-emerald-400 font-bold">
                          #{paper.number < 10 ? `0${paper.number}` : paper.number}
                        </span>
                        <span className="text-[#64748b]">&bull;</span>
                        <span className="text-[#94a3b8]">{paper.year}</span>
                      </div>
                      <div
                        className={`font-bold truncate text-xs group-hover:text-emerald-300 transition-colors ${
                          isRead ? 'text-[#94a3b8] line-through' : 'text-white'
                        }`}
                      >
                        {paper.title}
                      </div>
                      <div className="text-[10px] text-[#64748b] truncate mt-0.5">
                        {paper.subtitle}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(paper.id);
                    }}
                    className={`p-1 shrink-0 cursor-pointer ${
                      isBookmarked ? 'text-amber-400' : 'text-[#475569] hover:text-[#94a3b8]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
