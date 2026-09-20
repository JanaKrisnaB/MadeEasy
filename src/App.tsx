/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ALL_PAPERS } from './data/papers';
import { CATEGORIES } from './data/categories';
import { Paper, CategoryId } from './types';
import { Navbar } from './components/Navbar';
import { Breadcrumb, MainView } from './components/Breadcrumb';
import { CategoryFilter } from './components/CategoryFilter';
import { PaperCard } from './components/PaperCard';
import { PaperDetailModal } from './components/PaperDetailModal';
import { BenchmarkComparator } from './components/BenchmarkComparator';
import { ReadingListDrawer } from './components/ReadingListDrawer';
import { AuthModal } from './components/AuthModal';
import { Terminal } from 'lucide-react';
import {
  getSupabase,
  syncStateToSupabase,
  fetchStateFromSupabase,
  isSupabaseConfigured,
} from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<MainView>('library');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isReadingListOpen, setIsReadingListOpen] = useState<boolean>(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Local persistence for bookmarks & read status (default initialized)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('madeeasy_bookmarks');
      return saved
        ? new Set(JSON.parse(saved))
        : new Set(['paper-1', 'paper-34', 'paper-35', 'paper-36', 'paper-50']);
    } catch {
      return new Set(['paper-1', 'paper-34', 'paper-35', 'paper-36', 'paper-50']);
    }
  });

  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('madeeasy_read');
      return saved ? new Set(JSON.parse(saved)) : new Set(['paper-1', 'paper-38']);
    } catch {
      return new Set(['paper-1', 'paper-38']);
    }
  });

  const loadUserDataFromSupabase = useCallback(async (userId: string) => {
    const cloudState = await fetchStateFromSupabase(userId);
    if (cloudState) {
      // Merge guest local bookmarks with cloud bookmarks so no progress is ever lost
      if (cloudState.bookmarks && cloudState.bookmarks.length > 0) {
        setBookmarkedIds((prev) => {
          const merged = new Set([...Array.from(prev), ...cloudState.bookmarks]);
          return merged;
        });
      }
      if (cloudState.readList && cloudState.readList.length > 0) {
        setReadIds((prev) => {
          const merged = new Set([...Array.from(prev), ...cloudState.readList]);
          return merged;
        });
      }
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setCurrentUser(null);
      return;
    }
    const { data } = await supabase.auth.getSession();
    setCurrentUser(data.session?.user || null);
    if (data.session?.user) {
      loadUserDataFromSupabase(data.session.user.id);
    }
  }, [loadUserDataFromSupabase]);

  // Check Supabase session on startup and subscribe to auth state changes
  useEffect(() => {
    // If this window is opened as a popup by another window (OAuth callback)
    if (window.opener && window.opener !== window) {
      try {
        window.opener.postMessage(
          { type: 'OAUTH_AUTH_SUCCESS', hash: window.location.hash },
          '*'
        );
        setTimeout(() => {
          window.close();
        }, 300);
      } catch (err) {
        console.warn('Popup postMessage notice:', err);
      }
    }

    const supabase = getSupabase();
    if (supabase) {
      // Helper to clean URL back to root '/'
      const cleanUrl = () => {
        if (window.location.pathname.includes('/auth/callback') || window.location.hash) {
          window.history.replaceState({}, document.title, '/');
        }
      };

      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          setCurrentUser(data.session.user);
          loadUserDataFromSupabase(data.session.user.id);
        }
        cleanUrl();
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setCurrentUser(session?.user || null);
          if (session?.user) {
            loadUserDataFromSupabase(session.user.id);
          }
          cleanUrl();
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      // If no supabase, still clean /auth/callback if present
      if (window.location.pathname.includes('/auth/callback') || window.location.hash) {
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, [loadUserDataFromSupabase]);

  // Listen for OAuth success postMessage from the popup window
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const supabase = getSupabase();
        if (supabase) {
          // If hash contains access_token, let Supabase process it
          if (event.data?.hash) {
            try {
              const hashParams = new URLSearchParams(event.data.hash.replace(/^#/, ''));
              const accessToken = hashParams.get('access_token');
              const refreshToken = hashParams.get('refresh_token');
              if (accessToken && refreshToken) {
                await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });
              }
            } catch (err) {
              console.warn('Notice parsing popup hash:', err);
            }
          }
          await refreshSession();
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [refreshSession]);

  // Sync to localStorage and Supabase whenever bookmarks change
  useEffect(() => {
    try {
      const bArr = Array.from(bookmarkedIds);
      localStorage.setItem('madeeasy_bookmarks', JSON.stringify(bArr));
      if (currentUser) {
        syncStateToSupabase(currentUser.id, currentUser.email, {
          bookmarks: bArr,
          readList: Array.from(readIds),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Persistence notice:', e);
    }
  }, [bookmarkedIds, currentUser, readIds]);

  // Sync to localStorage and Supabase whenever read list changes
  useEffect(() => {
    try {
      const rArr = Array.from(readIds);
      localStorage.setItem('madeeasy_read', JSON.stringify(rArr));
      if (currentUser) {
        syncStateToSupabase(currentUser.id, currentUser.email, {
          bookmarks: Array.from(bookmarkedIds),
          readList: rArr,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Persistence notice:', e);
    }
  }, [readIds, currentUser, bookmarkedIds]);

  // Toggle handlers
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Category counts based on all 50 papers
  const paperCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ALL_PAPERS.length };
    CATEGORIES.forEach((c) => {
      counts[c.id] = ALL_PAPERS.filter((p) => p.category === c.id).length;
    });
    return counts as Record<CategoryId | 'all', number>;
  }, []);

  // Filtered papers
  const filteredPapers = useMemo(() => {
    return ALL_PAPERS.filter((paper) => {
      // Category match
      if (selectedCategory !== 'all' && paper.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = paper.title.toLowerCase().includes(q);
        const matchSubtitle = paper.subtitle?.toLowerCase().includes(q);
        const matchAuthors = paper.authors?.toLowerCase().includes(q);
        const matchOrg = paper.organization?.toLowerCase().includes(q);
        const matchTldr = paper.tldr?.toLowerCase().includes(q);
        const matchTech = paper.keyTechniques?.some((t) => t.toLowerCase().includes(q));
        const matchNum = paper.number?.toString() === q || `#${paper.number}` === q;

        return (
          matchTitle ||
          matchSubtitle ||
          matchAuthors ||
          matchOrg ||
          matchTldr ||
          matchTech ||
          matchNum
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Modal navigation within current filtered list
  const handlePrevPaper = () => {
    if (!selectedPaper || filteredPapers.length === 0) return;
    const currentIndex = filteredPapers.findIndex((p) => p.id === selectedPaper.id);
    const prevIndex = (currentIndex - 1 + filteredPapers.length) % filteredPapers.length;
    setSelectedPaper(filteredPapers[prevIndex]);
  };

  const handleNextPaper = () => {
    if (!selectedPaper || filteredPapers.length === 0) return;
    const currentIndex = filteredPapers.findIndex((p) => p.id === selectedPaper.id);
    const nextIndex = (currentIndex + 1) % filteredPapers.length;
    setSelectedPaper(filteredPapers[nextIndex]);
  };

  // View navigation handler
  const handleNavigateView = (view: MainView) => {
    setCurrentView(view);
    setSelectedCategory('all');
    setSelectedPaper(null);
    if (view === 'benchmark') {
      setIsCompareOpen(true);
    } else if (view === 'reading-list') {
      setIsReadingListOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-900 selection:text-emerald-200">
      {/* Navbar with brand name MadeEasy, navigation tabs, search, and Google Auth */}
      <Navbar
        currentView={currentView}
        onNavigateView={handleNavigateView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalPaperCount={ALL_PAPERS.length}
        bookmarkedCount={bookmarkedIds.size}
        readCount={readIds.size}
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        currentUser={currentUser}
      />

      {/* Dynamic Breadcrumb Bar */}
      <Breadcrumb
        currentView={currentView}
        onNavigateView={handleNavigateView}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedPaper={selectedPaper}
        onClearSelectedPaper={() => setSelectedPaper(null)}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Filter Pills */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          paperCounts={paperCounts}
        />

        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs font-mono text-[#64748b]">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-white">{filteredPapers.length}</strong> of{' '}
              <strong className="text-white">{ALL_PAPERS.length}</strong> industry research papers
            </span>
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 bg-[#141824] rounded text-emerald-400 border border-[#222a3d]">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-0.5 bg-[#141824] rounded text-cyan-400 border border-[#222a3d]">
                Query: "{searchQuery}"
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#94a3b8]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Click any paper for deep-dive & interactive simulator
            </span>
            <span className="text-[#334155]">&bull;</span>
            <span className="text-[#94a3b8]">Use &larr; &rarr; keys to navigate modal</span>
          </div>
        </div>

        {/* Paper Grid or Empty Search */}
        {filteredPapers.length === 0 ? (
          <div className="py-20 text-center rounded-lg border border-[#1c2230] bg-[#0c0f17] my-4">
            <Terminal className="w-8 h-8 text-[#475569] mx-auto mb-3" />
            <h3 className="text-base font-bold text-white font-mono mb-1">No Matching Papers Found</h3>
            <p className="text-xs text-[#94a3b8] font-mono max-w-md mx-auto mb-4">
              We couldn't find any papers matching your query "{searchQuery}". Try searching by paper title,
              technique (e.g., "MLA", "RoPE", "adaLN", "Speculative"), or author.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-[#161c28] hover:bg-[#1f2738] border border-[#2d3850] text-emerald-400 rounded text-xs font-mono font-bold transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-2">
            {filteredPapers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                isBookmarked={bookmarkedIds.has(paper.id)}
                isRead={readIds.has(paper.id)}
                onToggleBookmark={(e) => {
                  e.stopPropagation();
                  handleToggleBookmark(paper.id);
                }}
                onToggleRead={(e) => {
                  e.stopPropagation();
                  handleToggleRead(paper.id);
                }}
                onClick={() => setSelectedPaper(paper)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Clean Footer - No logos */}
      <footer className="border-t border-[#1c2230] bg-[#0c0f17] py-6 mt-12 text-xs font-mono text-[#64748b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="font-bold text-emerald-400">MadeEasy</span>
            <span className="text-[#334155]">&bull;</span>
            <span className="text-[#94a3b8]">AI Research Papers Made Understandable</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#64748b]">
            <span>{ALL_PAPERS.length} Foundational Papers</span>
            <span>12 Interactive Simulators</span>
            <span>Google Auth & Supabase Cloud Persistence</span>
          </div>
        </div>
      </footer>

      {/* Paper Detail Deep Dive Modal */}
      {selectedPaper && (
        <PaperDetailModal
          paper={selectedPaper}
          isBookmarked={bookmarkedIds.has(selectedPaper.id)}
          isRead={readIds.has(selectedPaper.id)}
          onToggleBookmark={() => handleToggleBookmark(selectedPaper.id)}
          onToggleRead={() => handleToggleRead(selectedPaper.id)}
          onClose={() => setSelectedPaper(null)}
          onPrevPaper={handlePrevPaper}
          onNextPaper={handleNextPaper}
        />
      )}

      {/* Benchmark Comparator Matrix Modal */}
      {isCompareOpen && (
        <BenchmarkComparator
          papers={ALL_PAPERS}
          onSelectPaper={(p) => {
            setIsCompareOpen(false);
            setSelectedPaper(p);
          }}
          onClose={() => {
            setIsCompareOpen(false);
            if (currentView === 'benchmark') setCurrentView('library');
          }}
        />
      )}

      {/* Reading Checklist Drawer */}
      {isReadingListOpen && (
        <ReadingListDrawer
          papers={ALL_PAPERS}
          bookmarkedIds={bookmarkedIds}
          readIds={readIds}
          onToggleBookmark={handleToggleBookmark}
          onToggleRead={handleToggleRead}
          onSelectPaper={(p) => {
            setIsReadingListOpen(false);
            setSelectedPaper(p);
          }}
          onClose={() => {
            setIsReadingListOpen(false);
            if (currentView === 'reading-list') setCurrentView('library');
          }}
        />
      )}

      {/* Google Authentication & Supabase Cloud Sync Modal */}
      <AuthModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        currentUser={currentUser}
        bookmarkedCount={bookmarkedIds.size}
        readCount={readIds.size}
        onRefreshSession={refreshSession}
      />
    </div>
  );
}
