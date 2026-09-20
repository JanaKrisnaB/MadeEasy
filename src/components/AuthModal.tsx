import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User as UserIcon,
  Shield,
  Cloud,
} from 'lucide-react';
import {
  signInWithGoogle,
  signOut,
} from '../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  bookmarkedCount: number;
  readCount: number;
  onRefreshSession: () => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  bookmarkedCount,
  readCount,
  onRefreshSession,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = await signInWithGoogle();
    if (result.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    } else {
      setSuccessMsg('Google sign-in initiated. Please select your Google account.');
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    const res = await signOut();
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Successfully signed out.');
      onRefreshSession();
    }
    setIsLoading(false);
  };

  const userAvatar = currentUser?.user_metadata?.avatar_url || currentUser?.user_metadata?.picture;
  const userName = currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'Researcher';
  const userEmail = currentUser?.email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0d1017] border border-[#232a3b] rounded-xl shadow-2xl p-6 text-white my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1c2230]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              ME
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-white">
                {currentUser ? 'Your Research Account' : 'MadeEasy Cloud Sync'}
              </h2>
              <p className="text-[11px] text-[#94a3b8] font-mono">
                {currentUser
                  ? 'Persistent Google authentication enabled'
                  : 'Never lose your bookmarks, checklist, or study notes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#64748b] hover:text-white hover:bg-[#161b26] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-mono flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="mt-5">
          {currentUser ? (
            /* Logged-in State */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2538] flex items-center gap-3.5">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-12 h-12 rounded-full border border-emerald-500/40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <UserIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white font-mono truncate">
                      {userName}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      Google
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8] font-mono truncate">{userEmail}</p>
                  <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> All changes auto-saved to Supabase
                  </p>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#0a0d14] border border-[#1a202c] text-center">
                <div>
                  <span className="text-[11px] text-[#64748b] font-mono block">Bookmarked Papers</span>
                  <span className="text-lg font-bold font-mono text-white">{bookmarkedCount}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#64748b] font-mono block">Completed Checklist</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{readCount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg bg-[#161b26] hover:bg-[#202738] text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Logged-out State: Google Sign-in */
            <div className="space-y-5">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-[#141a29] border border-[#232c42] flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <Cloud className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-mono text-white mb-1">
                  Save Your Research Journey
                </h3>
                <p className="text-xs text-[#94a3b8] font-mono max-w-sm mx-auto leading-relaxed">
                  Sign in with Google to sync your bookmarked papers, reading checklist, and math study progress directly to cloud storage.
                </p>
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-900 rounded-lg text-xs font-mono font-bold shadow-md transition-all flex items-center justify-center gap-3 border border-neutral-200 disabled:opacity-60 cursor-pointer"
              >
                {/* Official Google 'G' Logo SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {/* Guest mode notice */}
              <div className="p-3 rounded-lg bg-[#111622] border border-[#1a2130] flex items-center justify-between text-xs font-mono">
                <span className="text-[#94a3b8] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Not logged in? Progress is stored locally in your browser.</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
