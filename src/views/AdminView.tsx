import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { WatchProduct, StoreSettings, StockStatus } from '../types';
import { ALL_CATEGORIES } from '../data/initialData';
import { compressImageFile, resetToDefaults, uploadProductPhoto } from '../lib/storage';
import { signInAdmin, signOutAdmin, updateAdminPassword } from '../lib/auth';
import { 
  Lock, Key, Plus, Edit, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, 
  Upload, Link as LinkIcon, Check, X, Sparkles, Flame, Shield, RefreshCw, 
  Settings as SettingsIcon, Package, LogOut, Eye, Save, AlertTriangle 
} from 'lucide-react';

interface AdminViewProps {
  watches: WatchProduct[];
  settings: StoreSettings;
  session: Session | null;
  authChecking: boolean;
  onSaveWatches: (newWatches: WatchProduct[]) => void | Promise<void>;
  onSaveSettings: (newSettings: StoreSettings) => void | Promise<void>;
  onExitAdmin: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  watches,
  settings,
  session,
  authChecking,
  onSaveWatches,
  onSaveSettings,
  onExitAdmin,
}) => {
  // Authentication is now derived from the real Supabase session, not local
  // state - this also means navigating away from Admin and back keeps you
  // signed in, matching how a real session should behave.
  const isAuthenticated = !!session;
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Admin password change (Settings tab) - separate from the settings form,
  // since this now goes straight to Supabase Auth, not the settings table.
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');

  // Product Editing / Modal State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<WatchProduct> | null>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...settings });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Photo Input State in Modal
  const [externalPhotoUrl, setExternalPhotoUrl] = useState('');
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  // Quick Notification Toast
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Login handler - real Supabase Auth, not a hardcoded string comparison
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setAuthError('');
    const result = await signInAdmin(passwordInput);
    if (!result.ok) {
      setAuthError(result.error);
    } else {
      setPasswordInput('');
    }
    setLoginSubmitting(false);
  };

  // Quick Stock Status Change
  const handleQuickStockChange = (productId: string, newStatus: StockStatus) => {
    const updated = watches.map(w => w.id === productId ? { ...w, stockStatus: newStatus } : w);
    onSaveWatches(updated);
    showToast(`Updated stock status to ${newStatus}`);
  };

  // Toggle Badges
  const handleToggleBadge = (productId: string, field: 'isNewArrival' | 'isBestSeller' | 'isFeatured') => {
    const updated = watches.map(w => w.id === productId ? { ...w, [field]: !w[field] } : w);
    onSaveWatches(updated);
    showToast('Updated watch badge flag');
  };

  // Move product up/down
  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= watches.length) return;

    const copy = [...watches];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);

    // Update orderIndex property
    const reindexed = copy.map((item, idx) => ({ ...item, orderIndex: idx + 1 }));
    onSaveWatches(reindexed);
    showToast('Reordered catalog list');
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this watch permanently from the catalog?')) {
      const updated = watches.filter(w => w.id !== productId);
      onSaveWatches(updated);
      showToast('Product deleted');
    }
  };

  // Start New Watch Form
  const handleStartAddProduct = () => {
    const nextCodeNum = watches.length + 101;
    setEditingProduct({
      id: `pw-${Date.now()}`,
      code: `PW-${nextCodeNum}`,
      name: '',
      brand: 'PrimeWatch Signature',
      price: 150000,
      originalPrice: undefined,
      categories: ['Leather Strap Watches'],
      strapMaterial: 'Genuine Calfskin Leather',
      movementType: 'Automatic Mechanical',
      caseMaterial: '316L Stainless Steel',
      colors: ['Silver', 'Black'],
      stockStatus: 'Available',
      isNewArrival: true,
      isBestSeller: false,
      isFeatured: false,
      shortDescription: '',
      fullDescription: '',
      features: ['Scratch-Resistant Sapphire Crystal', 'Water Resistant 5 ATM'],
      packageContents: ['PrimeWatch Gift Box', 'Warranty Card'],
      photos: [],
      orderIndex: watches.length + 1,
      createdAt: new Date().toISOString(),
    });
    setIsEditingProduct(true);
  };

  // Start Edit Existing Watch Form
  const handleStartEditProduct = (product: WatchProduct) => {
    setEditingProduct({ ...product });
    setIsEditingProduct(true);
  };

  // Photo upload from device: compress client-side, then upload to Supabase
  // Storage (watch-images bucket) and store only the resulting public URL.
  const handleDevicePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setIsCompressingPhoto(true);
    try {
      const newPhotoUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressedBlob = await compressImageFile(files[i], 1200, 0.82);
        const publicUrl = await uploadProductPhoto(compressedBlob, editingProduct.id || 'unfiled');
        newPhotoUrls.push(publicUrl);
      }

      setEditingProduct({
        ...editingProduct,
        photos: [...(editingProduct.photos || []), ...newPhotoUrls],
      });
      showToast('Uploaded and attached photos successfully');
    } catch (err) {
      console.error('Photo upload error', err);
      alert('Failed to upload photo. Try a smaller image or check your connection.');
    } finally {
      setIsCompressingPhoto(false);
      e.target.value = '';
    }
  };

  // Add external photo URL
  const handleAddExternalPhotoUrl = () => {
    if (!externalPhotoUrl.trim() || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      photos: [...(editingProduct.photos || []), externalPhotoUrl.trim()],
    });
    setExternalPhotoUrl('');
  };

  // Remove photo by index
  const handleRemovePhoto = (indexToRemove: number) => {
    if (!editingProduct) return;
    const filtered = (editingProduct.photos || []).filter((_, idx) => idx !== indexToRemove);
    setEditingProduct({ ...editingProduct, photos: filtered });
  };

  // Save watch form submission
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.code) {
      alert('Please fill in required fields (Watch Name and Product Code).');
      return;
    }

    const fullProduct = editingProduct as WatchProduct;
    const exists = watches.some(w => w.id === fullProduct.id);

    let updatedList: WatchProduct[];
    if (exists) {
      updatedList = watches.map(w => w.id === fullProduct.id ? fullProduct : w);
    } else {
      updatedList = [fullProduct, ...watches];
    }

    onSaveWatches(updatedList);
    setIsEditingProduct(false);
    setEditingProduct(null);
    showToast('Saved product changes');
  };

  // Save Settings Tab
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setSettingsSavedMsg('Store settings saved successfully!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  // Reset store catalog to original seed
  const handleResetCatalog = async () => {
    if (window.confirm('Reset catalog and settings back to original Kayode sample state? Custom additions will be overwritten.')) {
      showToast('Resetting catalog...');
      const resetData = await resetToDefaults();
      onSaveWatches(resetData.watches);
      onSaveSettings(resetData.settings);
      setSettingsForm(resetData.settings);
      showToast('Reset store to default seed state');
    }
  };

  // Checking for an existing session before deciding what to show
  if (authChecking) {
    return (
      <div className="max-w-md mx-auto my-24 px-4 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#5C6B3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl p-8 border border-[#E8E2D5] shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#5C6B3A] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#2B2A26]">
              Kayode's Admin Dashboard
            </h1>
            <p className="text-xs text-[#615E57]">
              Enter admin password to manage products, photos, stock status, and settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#8C887F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                  autoFocus
                  disabled={loginSubmitting}
                />
              </div>
            </div>

            {authError && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-200">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full bg-[#5C6B3A] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#47542B] transition-colors shadow-sm disabled:opacity-60"
              id="admin-login-btn"
            >
              {loginSubmitting ? 'Checking...' : 'Authenticate & Access Dashboard'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8E2D5] text-center">
            <button
              onClick={onExitAdmin}
              className="text-xs text-[#8C887F] hover:text-[#2B2A26] underline"
            >
              Return to Public Storefront
            </button>
          </div>

        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2B2A26] text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-[#25D366]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8952E]">
            Store Owner Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A26] flex items-center gap-2">
            PrimeWatch Admin Control
          </h1>
          <p className="text-xs text-[#615E57] mt-0.5">
            Managing {watches.length} catalog timepieces & business settings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="bg-[#FAF6EE] text-[#2B2A26] border border-[#E8E2D5] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#E8E2D5] flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>View Public Store</span>
          </button>

          <button
            onClick={() => signOutAdmin()}
            className="bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-rose-100 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Dashboard</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher (PRD §5.6: Products & Settings) */}
      <div className="flex items-center gap-3 border-b border-[#E8E2D5] pb-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-[#5C6B3A] text-white shadow-md'
              : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:bg-[#FAF6EE]'
          }`}
          id="admin-tab-products"
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog ({watches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-[#5C6B3A] text-white shadow-md'
              : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:bg-[#FAF6EE]'
          }`}
          id="admin-tab-settings"
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Store & WhatsApp Settings</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Top Actions: Add Watch */}
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#2B2A26]">
              Inventory & Photo Management
            </h2>

            <button
              onClick={handleStartAddProduct}
              className="bg-[#5C6B3A] text-white px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#47542B] transition-all flex items-center gap-2 shadow-sm"
              id="admin-add-watch-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Watch</span>
            </button>
          </div>

          {/* Products List Table / Cards */}
          <div className="bg-white rounded-3xl border border-[#E8E2D5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6EE] border-b border-[#E8E2D5] text-[#615E57] uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Order / Photo</th>
                    <th className="p-4">Watch & Code</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D5]">
                  {watches.map((w, idx) => {
                    const thumbnail = w.photos[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=200&auto=format&fit=crop';
                    return (
                      <tr key={w.id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                        
                        {/* Order & Thumbnail */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleReorder(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-[#E8E2D5] text-[#2B2A26] disabled:opacity-30"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleReorder(idx, 'down')}
                                disabled={idx === watches.length - 1}
                                className="p-1 rounded hover:bg-[#E8E2D5] text-[#2B2A26] disabled:opacity-30"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <img
                              src={thumbnail}
                              alt={w.name}
                              className="w-12 h-12 object-cover rounded-xl border border-[#E8E2D5] bg-[#FAF6EE]"
                            />
                          </div>
                        </td>

                        {/* Title & Code */}
                        <td className="p-4">
                          <span className="font-mono text-[10px] font-bold text-[#5C6B3A] bg-[#5C6B3A]/10 px-2 py-0.5 rounded">
                            {w.code}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-[#2B2A26] mt-1 line-clamp-1">
                            {w.name}
                          </h4>
                          <span className="text-[11px] text-[#8C887F] block">
                            {w.brand} • {w.photos.length} photos
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-4 font-serif font-bold text-[#2B2A26]">
                          {settings.currencySymbol}{w.price.toLocaleString()}
                        </td>

                        {/* Inline Stock Status Selector */}
                        <td className="p-4">
                          <select
                            value={w.stockStatus}
                            onChange={(e) => handleQuickStockChange(w.id, e.target.value as StockStatus)}
                            className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                              w.stockStatus === 'Available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : w.stockStatus === 'Limited Stock'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            <option value="Available">Available</option>
                            <option value="Limited Stock">Limited Stock</option>
                            <option value="Sold Out">Sold Out</option>
                          </select>
                        </td>

                        {/* Quick Badge Toggles */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleBadge(w.id, 'isNewArrival')}
                              className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1 ${
                                w.isNewArrival
                                  ? 'bg-[#5C6B3A] text-white border-[#5C6B3A]'
                                  : 'bg-white text-[#8C887F] border-[#E8E2D5]'
                              }`}
                              title="Toggle New Arrival"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>New</span>
                            </button>

                            <button
                              onClick={() => handleToggleBadge(w.id, 'isBestSeller')}
                              className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1 ${
                                w.isBestSeller
                                  ? 'bg-[#B8952E] text-white border-[#B8952E]'
                                  : 'bg-white text-[#8C887F] border-[#E8E2D5]'
                              }`}
                              title="Toggle Best Seller"
                            >
                              <Flame className="w-3 h-3" />
                              <span>Best</span>
                            </button>
                          </div>
                        </td>

                        {/* Edit & Delete */}
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleStartEditProduct(w)}
                            className="p-2 rounded-xl bg-[#FAF6EE] text-[#5C6B3A] border border-[#E8E2D5] hover:bg-[#5C6B3A] hover:text-white transition-colors"
                            title="Edit Full Product Form"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(w.id)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Delete Watch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: STORE & WHATSAPP SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs max-w-3xl">
          
          <div className="border-b border-[#E8E2D5] pb-4 mb-6">
            <h2 className="font-serif text-xl font-bold text-[#2B2A26]">
              Business Details & Contact Channels
            </h2>
            <p className="text-xs text-[#615E57] mt-1">
              Configure your official WhatsApp number, social handles, currency, and admin password.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* WhatsApp Number & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                  WhatsApp Direct Phone Number
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsAppNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsAppNumber: e.target.value })}
                  placeholder="E.g., 2348123456789"
                  className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                  required
                />
                <span className="text-[10px] text-[#8C887F] mt-1 block">Include country code without '+' (e.g., 234 for Nigeria)</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={settingsForm.currencySymbol}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                  placeholder="E.g., ₦ or $"
                  className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                  required
                />
              </div>
            </div>

            {/* Social Handles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={settingsForm.instagramHandle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                  placeholder="primewatch_by_kayode"
                  className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  value={settingsForm.tiktokHandle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tiktokHandle: e.target.value })}
                  placeholder="primewatch_kayode"
                  className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                  Business Email
                </label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  placeholder="kayode@primewatch.com"
                  className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                />
              </div>
            </div>

            {/* Hours & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={settingsForm.businessHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                  placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                  className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                  Showroom / Location
                </label>
                <input
                  type="text"
                  value={settingsForm.location}
                  onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                  placeholder="Lekki Phase 1, Lagos, Nigeria"
                  className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                />
              </div>
            </div>

            {/* Hero Image URL */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                Homepage Hero Image URL
              </label>
              <input
                type="text"
                value={settingsForm.heroImageUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
              />
            </div>

            {/* Admin Password Change */}
            <div className="pt-4 border-t border-[#E8E2D5]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                Change Admin Password
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="New password"
                  className="w-full sm:w-1/2 bg-[#FAF6EE] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A]"
                />
                <button
                  type="button"
                  onClick={async () => {
                    setPasswordChangeMsg('');
                    setPasswordChangeError('');
                    if (newPasswordInput.length < 6) {
                      setPasswordChangeError('Password must be at least 6 characters.');
                      return;
                    }
                    const result = await updateAdminPassword(newPasswordInput);
                    if (result.ok) {
                      setPasswordChangeMsg('Password updated.');
                      setNewPasswordInput('');
                    } else {
                      setPasswordChangeError(result.error);
                    }
                  }}
                  className="bg-[#2B2A26] text-white px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-black transition-colors"
                >
                  Update Password
                </button>
              </div>
              {passwordChangeMsg && <p className="text-[11px] text-emerald-700 mt-1.5">{passwordChangeMsg}</p>}
              {passwordChangeError && <p className="text-[11px] text-rose-600 mt-1.5">{passwordChangeError}</p>}
            </div>

            {settingsSavedMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{settingsSavedMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#5C6B3A] text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#47542B] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>

              <button
                type="button"
                onClick={handleResetCatalog}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1.5 underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Store to Sample Seed Catalog</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* FULL PRODUCT EDIT / CREATE MODAL FORM */}
      {isEditingProduct && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div 
            className="bg-[#FAF6EE] rounded-3xl border border-[#E8E2D5] shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#5C6B3A]">
                  Watch Form Editor
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2B2A26]">
                  {editingProduct.id && watches.some(w => w.id === editingProduct.id) ? 'Edit Watch Details' : 'Add New Watch to Catalog'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProduct(false)}
                className="p-2 rounded-full hover:bg-[#E8E2D5] text-[#2B2A26]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-6 text-xs text-[#2B2A26]">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Product Code *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.code || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                    placeholder="E.g. PW-109"
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Watch Name *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="E.g. Royal Chronograph Gold Emerald"
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                    required
                  />
                </div>
              </div>

              {/* Pricing & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    placeholder="PrimeWatch Signature"
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Price ({settings.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="For strike-through sale"
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                  />
                </div>
              </div>

              {/* Categories Multi-Select Checkboxes */}
              <div>
                <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                  Select Categories
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-2xl border border-[#E8E2D5]">
                  {ALL_CATEGORIES.map((cat) => {
                    const checked = (editingProduct.categories || []).includes(cat);
                    return (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer text-[11px] font-medium">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const current = editingProduct.categories || [];
                            const updatedCat = e.target.checked 
                              ? [...current, cat] 
                              : current.filter(c => c !== cat);
                            setEditingProduct({ ...editingProduct, categories: updatedCat });
                          }}
                          className="w-3.5 h-3.5 rounded text-[#5C6B3A]"
                        />
                        <span className="truncate">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Movement Type
                  </label>
                  <input
                    type="text"
                    value={editingProduct.movementType || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, movementType: e.target.value })}
                    placeholder="Automatic Self-Winding"
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Strap Material
                  </label>
                  <input
                    type="text"
                    value={editingProduct.strapMaterial || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, strapMaterial: e.target.value })}
                    placeholder="Genuine Calf Leather"
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Case Material
                  </label>
                  <input
                    type="text"
                    value={editingProduct.caseMaterial || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, caseMaterial: e.target.value })}
                    placeholder="18K Gold Plated 316L Steel"
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                  />
                </div>
              </div>

              {/* Short & Full Description */}
              <div className="space-y-3">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Short Description (Teaser)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.shortDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                    placeholder="Brief 1-sentence highlight..."
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C6B3A]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#615E57] block mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.fullDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                    className="w-full bg-white border border-[#E8E2D5] rounded-xl p-3 text-xs focus:outline-none focus:border-[#5C6B3A]"
                  />
                </div>
              </div>

              {/* PRD §5.6 PHOTO MANAGEMENT SECTION */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#2B2A26] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#5C6B3A]" />
                    Photo Management (Multiple Photos Supported)
                  </h4>
                  <span className="text-[10px] text-[#8C887F]">
                    {(editingProduct.photos || []).length} photos attached
                  </span>
                </div>

                {/* Upload Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Direct Phone/Device Upload with Canvas Auto-Compression */}
                  <div className="border-2 border-dashed border-[#E8E2D5] hover:border-[#5C6B3A] rounded-xl p-3 text-center bg-[#FAF6EE] transition-colors">
                    <Upload className="w-5 h-5 text-[#5C6B3A] mx-auto mb-1" />
                    <span className="font-bold block text-xs">Upload From Device</span>
                    <span className="text-[10px] text-[#8C887F] block mb-2">Auto-compressed in-browser JPEG</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleDevicePhotoUpload}
                      disabled={isCompressingPhoto}
                      className="text-[10px] w-full cursor-pointer text-[#8C887F]"
                    />
                    {isCompressingPhoto && (
                      <span className="text-[10px] text-[#B8952E] font-bold block mt-1 animate-pulse">
                        Compressing photo...
                      </span>
                    )}
                  </div>

                  {/* External URL Input */}
                  <div className="border border-[#E8E2D5] rounded-xl p-3 bg-[#FAF6EE] flex flex-col justify-between">
                    <div>
                      <span className="font-bold block text-xs mb-1">Paste Image URL</span>
                      <div className="relative">
                        <LinkIcon className="w-3.5 h-3.5 text-[#8C887F] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={externalPhotoUrl}
                          onChange={(e) => setExternalPhotoUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-[#E8E2D5] rounded-lg pl-8 pr-2 py-1 text-[11px]"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExternalPhotoUrl}
                      className="mt-2 bg-[#2B2A26] text-white py-1.5 rounded-lg text-[11px] font-bold hover:bg-[#5C6B3A]"
                    >
                      Attach Photo URL
                    </button>
                  </div>

                </div>

                {/* Attached Photo Thumbnails */}
                {(editingProduct.photos || []).length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                    {editingProduct.photos?.map((photo, pIdx) => (
                      <div key={pIdx} className="relative group aspect-square rounded-xl overflow-hidden border border-[#E8E2D5] bg-[#FAF6EE]">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(pIdx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full shadow-md opacity-90 hover:opacity-100"
                          title="Delete photo permanently"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                          #{pIdx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8E2D5] font-semibold text-xs text-[#2B2A26] hover:bg-[#E8E2D5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5C6B3A] font-bold text-xs text-white uppercase tracking-wider hover:bg-[#47542B] shadow-sm"
                >
                  Save Watch
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
