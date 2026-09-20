import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Local storage keys for developer/project level Supabase credentials
const STORAGE_KEY_URL = 'madeeasy_supabase_project_url';
const STORAGE_KEY_KEY = 'madeeasy_supabase_project_anon_key';
const TABLE_NAME = 'user_paper_state';

let cachedClient: SupabaseClient | null = null;

export interface UserPaperState {
  bookmarks: string[];
  readList: string[];
  updatedAt: string;
}

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  // Check project environment variables first
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_KEY) || '';

  return {
    url: (envUrl || localUrl).trim(),
    anonKey: (envKey || localKey).trim(),
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('https://'));
}

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || !url.startsWith('https://')) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
      },
    });
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function saveProjectSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  cachedClient = null;
}

export function clearProjectSupabaseCredentials() {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
  cachedClient = null;
}

/**
 * Initiates Google OAuth using Supabase.
 * In iframe environments (AI Studio preview), opens the Google auth provider URL
 * in a popup window to prevent X-Frame-Options blocking.
 */
export async function signInWithGoogle(): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      error: 'Supabase project is not connected yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    };
  }

  const callbackUrl = window.location.origin;
  const isInIframe = window.self !== window.top;

  try {
    // On standalone browsers (e.g. Vercel), do seamless redirect in the SAME window
    if (!isInIframe) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }
      return {};
    }

    // Inside iframe preview environments, use a popup to avoid X-Frame-Options blocking
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data?.url) {
      // Calculate centered popup coordinates
      const width = 560;
      const height = 680;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        data.url,
        'google_supabase_oauth',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        // If popup was blocked by browser, fallback to standard redirect
        window.location.href = data.url;
      }
    } else {
      return { error: 'Failed to retrieve Google authentication URL from Supabase.' };
    }

    return {};
  } catch (err: any) {
    return { error: err?.message || 'Error initializing Google sign-in' };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return {};

  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return {};
  } catch (err: any) {
    return { error: err?.message || 'Sign out failed' };
  }
}

/**
 * Persist user bookmarks and read checklist to Supabase table
 */
export async function syncStateToSupabase(
  userId: string,
  userEmail: string | undefined,
  state: UserPaperState
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.from(TABLE_NAME).upsert(
      {
        user_id: userId,
        user_email: userEmail || '',
        bookmarks: state.bookmarks,
        read_list: state.readList,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.warn('Supabase state sync notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to sync to Supabase' };
  }
}

/**
 * Fetch persistent state for an authenticated user
 */
export async function fetchStateFromSupabase(
  userId: string
): Promise<UserPaperState | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('bookmarks, read_list, updated_at')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      bookmarks: data.bookmarks || [],
      readList: data.read_list || [],
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}
