import React, { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { WatchProduct, StoreSettings, PageView } from './types';
import { fetchWatches, insertWatch, updateWatch, deleteWatch, loadSettings, saveSettings, areWatchesEqual } from './lib/storage';
import { getCurrentSession, onAuthStateChange } from './lib/auth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomeView } from './views/HomeView';
import { CollectionView } from './views/CollectionView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { PrivacyTermsView } from './views/PrivacyTermsView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<WatchProduct | null>(null);

  const [watches, setWatches] = useState<WatchProduct[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [syncError, setSyncError] = useState('');

  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Load catalog + settings from Supabase on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [loadedWatches, loadedSettings] = await Promise.all([fetchWatches(), loadSettings()]);
        if (cancelled) return;
        setWatches(loadedWatches);
        setSettings(loadedSettings);
        setDataError('');
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load store data:', err);
        setDataError('Could not load the catalog right now. Please refresh the page.');
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Track the Supabase auth session for admin access.
  useEffect(() => {
    let cancelled = false;
    getCurrentSession().then((s) => {
      if (!cancelled) {
        setSession(s);
        setAuthChecking(false);
      }
    });
    const unsubscribe = onAuthStateChange((s) => setSession(s));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // Diff-based sync: AdminView still computes and hands back a full array
  // (unchanged behavior/UI), this translates that into the specific
  // insert/update/delete calls Supabase actually needs.
  const handleSaveWatches = useCallback(async (newWatches: WatchProduct[]) => {
    const previousWatches = watches;
    setWatches(newWatches); // optimistic - matches the instant feel of the old localStorage version

    const previousById = new Map(previousWatches.map((w) => [w.id, w]));
    const newById = new Map(newWatches.map((w) => [w.id, w]));

    const toInsert = newWatches.filter((w) => !previousById.has(w.id));
    const toDelete = previousWatches.filter((w) => !newById.has(w.id));
    const toUpdate = newWatches.filter((w) => {
      const prev = previousById.get(w.id);
      return prev && !areWatchesEqual(prev, w);
    });

    try {
      const [insertedWatches] = await Promise.all([
        Promise.all(toInsert.map((w) => insertWatch(w))),
        Promise.all(toDelete.map((w) => deleteWatch(w.id))),
        Promise.all(toUpdate.map((w) => updateWatch(w.id, w))),
      ]);

      // Supabase assigns the real id on insert - it will never match the
      // temporary client-side placeholder id (e.g. "pw-1737400000000") that
      // AdminView generated before saving. Swap those placeholders out for
      // the real rows now, so the next edit or delete on a just-added
      // product targets a row that actually exists.
      if (insertedWatches.length > 0) {
        const placeholderIds = new Set(toInsert.map((w) => w.id));
        setWatches((current) => {
          const withoutPlaceholders = current.filter((w) => !placeholderIds.has(w.id));
          return [...withoutPlaceholders, ...insertedWatches].sort((a, b) => a.orderIndex - b.orderIndex);
        });
      }

      setSyncError('');
    } catch (err) {
      console.error('Failed to sync product changes to Supabase:', err);
      setSyncError('Some product changes could not be saved. Reloading the catalog to double-check...');
      try {
        const fresh = await fetchWatches();
        setWatches(fresh);
        setSyncError('');
      } catch {
        setSyncError('Some product changes could not be saved. Please refresh the page and try again.');
      }
    }
  }, [watches]);

  const handleSaveSettings = useCallback(async (newSettings: StoreSettings) => {
    setSettings(newSettings); // optimistic
    const ok = await saveSettings(newSettings);
    setSyncError(ok ? '' : 'Settings could not be saved. Please try again.');
  }, []);

  // Navigation Handler
  const handleNavigate = (view: PageView, filterCategory?: string) => {
    setCurrentView(view);
    if (filterCategory !== undefined) {
      setSelectedCategory(filterCategory);
    } else if (view !== 'collection') {
      setSelectedCategory('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (dataLoading || !settings) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
        {dataError ? (
          <p className="text-sm text-[#2B2A26] max-w-xs text-center px-4">{dataError}</p>
        ) : (
          <div className="w-8 h-8 border-2 border-[#5C6B3A] border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2B2A26] flex flex-col font-sans selection:bg-[#5C6B3A] selection:text-white">

      {/* Sticky Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        settings={settings}
        totalProductsCount={watches.length}
      />

      {syncError && (
        <div className="bg-rose-50 text-rose-700 text-xs px-4 py-2 text-center border-b border-rose-200">
          {syncError}
        </div>
      )}

      {/* Main View Router Container */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            watches={watches}
            settings={settings}
            onNavigate={handleNavigate}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'collection' && (
          <CollectionView
            watches={watches}
            settings={settings}
            initialCategory={selectedCategory}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'new-arrivals' && (
          <CollectionView
            watches={watches}
            settings={settings}
            presetFilterType="new-arrivals"
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'best-sellers' && (
          <CollectionView
            watches={watches}
            settings={settings}
            presetFilterType="best-sellers"
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            settings={settings}
          />
        )}

        {currentView === 'privacy' && (
          <PrivacyTermsView
            initialTab="privacy"
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'terms' && (
          <PrivacyTermsView
            initialTab="terms"
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            watches={watches}
            settings={settings}
            session={session}
            authChecking={authChecking}
            onSaveWatches={handleSaveWatches}
            onSaveSettings={handleSaveSettings}
            onExitAdmin={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          allProducts={watches}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        settings={settings}
      />

    </div>
  );
}
