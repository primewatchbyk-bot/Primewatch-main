import React from 'react';
import { FilterState } from '../types';
import { ALL_CATEGORIES } from '../data/initialData';
import { Search, Filter, RotateCcw, X, Check } from 'lucide-react';

interface FilterDrawerProps {
  filter: FilterState;
  onChangeFilter: (newFilter: FilterState) => void;
  onReset: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalResults: number;
}

const STRAP_TYPES = ['Leather', 'Rubber', 'Steel', 'Mesh', 'Titanium'];
const MOVEMENT_TYPES = ['Automatic', 'Quartz', 'Mecha-Quartz', 'Solar'];
const COLOR_OPTIONS = ['Gold', 'Silver', 'Black', 'Emerald', 'Blue', 'Rose Gold'];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filter,
  onChangeFilter,
  onReset,
  isOpenMobile,
  onCloseMobile,
  totalResults,
}) => {

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilter({ ...filter, search: e.target.value });
  };

  const handleCategoryToggle = (cat: string) => {
    const newCategory = filter.category === cat ? '' : cat;
    onChangeFilter({ ...filter, category: newCategory });
  };

  const handleStrapToggle = (strap: string) => {
    const newStrap = filter.strapType === strap ? '' : strap;
    onChangeFilter({ ...filter, strapType: newStrap });
  };

  const handleMovementToggle = (mov: string) => {
    const newMov = filter.movementType === mov ? '' : mov;
    onChangeFilter({ ...filter, movementType: newMov });
  };

  const handleColorToggle = (color: string) => {
    const newColor = filter.color === color ? '' : color;
    onChangeFilter({ ...filter, color: newColor });
  };

  const filterContent = (
    <div className="space-y-6 text-[#2B2A26]">
      
      {/* Search Input */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
          Search Collection
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C887F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.search}
            onChange={handleSearchChange}
            placeholder="Search by code (e.g. PW-101), name, brand..."
            className="w-full bg-white border border-[#E8E2D5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B2A26] placeholder-[#8C887F] focus:outline-none focus:border-[#5C6B3A] focus:ring-1 focus:ring-[#5C6B3A]"
          />
          {filter.search && (
            <button
              onClick={() => onChangeFilter({ ...filter, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C887F] hover:text-[#2B2A26]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Multi-Select Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2.5">
          Categories
        </label>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = filter.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  isSelected 
                    ? 'bg-[#5C6B3A] text-white font-semibold' 
                    : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Strap Material */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
          Strap Material
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STRAP_TYPES.map((strap) => {
            const isSelected = filter.strapType === strap;
            return (
              <button
                key={strap}
                onClick={() => handleStrapToggle(strap)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#B8952E] text-white shadow-xs'
                    : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:border-[#B8952E]'
                }`}
              >
                {strap}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movement Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
          Movement
        </label>
        <div className="flex flex-wrap gap-1.5">
          {MOVEMENT_TYPES.map((mov) => {
            const isSelected = filter.movementType === mov;
            return (
              <button
                key={mov}
                onClick={() => handleMovementToggle(mov)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#5C6B3A] text-white shadow-xs'
                    : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:border-[#5C6B3A]'
                }`}
              >
                {mov}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
          Dial / Accent Color
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COLOR_OPTIONS.map((col) => {
            const isSelected = filter.color === col;
            return (
              <button
                key={col}
                onClick={() => handleColorToggle(col)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#2B2A26] text-white shadow-xs'
                    : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:border-[#2B2A26]'
                }`}
              >
                {col}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-2 border-t border-[#E8E2D5]">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2B2A26]">
          <input
            type="checkbox"
            checked={filter.stockOnly}
            onChange={(e) => onChangeFilter({ ...filter, stockOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#5C6B3A] focus:ring-[#5C6B3A] border-[#E8E2D5]"
          />
          <span>In Stock Only (Hide Sold Out)</span>
        </label>
      </div>

      {/* Reset Filters CTA */}
      <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
        <span className="text-xs text-[#8C887F]">
          {totalResults} items found
        </span>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-[#5C6B3A] hover:text-[#47542B] font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filter Panel */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-24 bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#E8E2D5] shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8E2D5]">
          <h3 className="font-serif text-base font-bold text-[#2B2A26] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#5C6B3A]" />
            Filter Collection
          </h3>
        </div>
        {filterContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          <div className="relative ml-auto w-full max-w-xs bg-[#FAF6EE] h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5] mb-5">
                <h3 className="font-serif text-lg font-bold text-[#2B2A26] flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#5C6B3A]" />
                  Filters ({totalResults})
                </h3>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-full hover:bg-[#E8E2D5] text-[#2B2A26]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {filterContent}
            </div>

            <div className="pt-6 border-t border-[#E8E2D5] mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full bg-[#5C6B3A] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters ({totalResults} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
