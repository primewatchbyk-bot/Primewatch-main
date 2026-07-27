import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

// The existing admin login screen only asks for a password (no email field),
// so a single known admin email is used internally to call Supabase Auth.
// This is not a secret - the real secret is the password, verified by
// Supabase, not by this app. Create this user once in the Supabase
// dashboard (Authentication -> Users) with whatever password you choose.
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

export async function signInAdmin(password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ADMIN_EMAIL) {
    return { ok: false, error: 'VITE_ADMIN_EMAIL is not configured. Set it in your .env file.' };
  }
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
  if (error) {
    return { ok: false, error: 'Incorrect password. Please try again.' };
  }
  return { ok: true };
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

export async function updateAdminPassword(newPassword: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
