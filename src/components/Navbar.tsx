import React from 'react';
import {
  Search,
  Bookmark,
  ArrowUpDown,
  BookOpen,
  User as UserIcon,
} from 'lucide-react';
import { MainView } from './Breadcrumb';
import { isSupabaseConfigured } from '../lib/supabase';

interface Props {
  currentView: MainView;
  onNavigateView: (view: MainView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalPaperCount: number;
  bookmarkedCount: number;
  readCount: number;
  onOpenCloudSync: () => void;
  currentUser: any;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigateView,
  searchQuery,
  onSearchChange,
  totalPaperCount,
  bookmarkedCount,
  readCount,
  onOpenCloudSync,
  currentUser,
}) => {
  const isCloudActive = isSupabaseConfigured();

  const userAvatar = currentUser?.user_metadata?.avatar_url || currentUser?.user_metadata?.picture;
  const displayName = currentUser?.user_metadata?.full_name?.split(' ')[0] || currentUser?.email?.split('@')[0];

  return (
    <header className="sticky top-0 z-40 bg-[#090b10]/95 backdrop-blur-md border-b border-[#1c2230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Brand Name & Primary View Navigation */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Clean Text Title - NO LOGO */}
            <div
              onClick={() => onNavigateView('library')}
              className="cursor-pointer group flex items-baseline gap-2 shrink-0"
            >
              <span className="text-lg font-bold text-white font-mono tracking-tight group-hover:text-emerald-400 transition-colors">
                MadeEasy
              </span>
              <span className="text-[11px] text-[#64748b] font-mono hidden sm:inline">
                Research Deconstructed
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1 overflow-x-auto text-xs font-mono scrollbar-none">
              <button
                onClick={() => onNavigateView('library')}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  currentView === 'library'
                    ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-bold'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#121622]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Industry Library</span>
                <span className="text-[10px] text-emerald-400 font-bold">({totalPaperCount})</span>
              </button>

              <button
                onClick={() => onNavigateView('benchmark')}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  currentView === 'benchmark'
                    ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-bold'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#121622]'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Benchmark Matrix</span>
              </button>

              <button
                onClick={() => onNavigateView('reading-list')}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  currentView === 'reading-list'
                    ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-bold'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#121622]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reading Checklist</span>
                <span className="text-[10px] text-[#64748b]">({readCount}/{totalPaperCount})</span>
              </button>
            </nav>
          </div>

          {/* Search Bar & Google Auth / Supabase Cloud Sync */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative flex-1 sm:w-56 md:w-64">
              <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search 50 papers, techniques..."
                className="w-full bg-[#11141d] border border-[#232a3b] text-white pl-8 pr-3 py-1.5 rounded text-xs font-mono focus:outline-none focus:border-emerald-500 placeholder:text-[#475569]"
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

            {/* Google Authentication / Account Sync Button */}
            <button
              onClick={onOpenCloudSync}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all shrink-0 cursor-pointer ${
                currentUser
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-200 shadow-sm font-semibold'
              }`}
              title={currentUser ? `Signed in with Google as ${currentUser.email}` : 'Sign in with Google to sync your study progress'}
            >
              {currentUser ? (
                <>
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={displayName}
                      className="w-4 h-4 rounded-full object-cover border border-emerald-400"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] text-white">
                      {displayName ? displayName[0].toUpperCase() : <UserIcon className="w-2.5 h-2.5" />}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{displayName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Cloud Synced" />
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Sign in with Google</span>
                  <span className="sm:hidden">Sign In</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
