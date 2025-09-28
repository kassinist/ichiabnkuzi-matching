
import React, { useState } from 'react';
import type { SearchFilters, SortOption, PrizeGrade } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { TagIcon } from './icons/TagIcon';

interface SearchBarProps {
  onSearch: (filters: SearchFilters, sort: SortOption) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(10);
  const [prizeGrade, setPrizeGrade] = useState<PrizeGrade | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('score');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, radius, prizeGrade }, sort);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sticky top-20 z-40">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Search Query Input */}
        <div className="md:col-span-2">
          <label htmlFor="search-query" className="block text-sm font-medium text-slate-700 mb-1">
            Title / Prize Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="search-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'One Piece', 'Last One Prize'"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-slate-700 mb-1">
              Radius
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-slate-400" />
              </div>
              <select
                id="radius"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="prize-grade" className="block text-sm font-medium text-slate-700 mb-1">
              Prize Grade
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon className="h-5 w-5 text-slate-400" />
              </div>
              <select
                id="prize-grade"
                value={prizeGrade}
                onChange={(e) => setPrizeGrade(e.target.value as PrizeGrade | 'all')}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
              >
                <option value="all">All Grades</option>
                <option value="A">A Prize</option>
                <option value="B">B Prize</option>
                <option value="C">C Prize</option>
                <option value="Last One">Last One</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <SearchIcon className="h-5 w-5" />
          Search
        </button>
      </form>
      
      {/* Sorting Options */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-slate-600">Sort by:</span>
        <div className="flex flex-wrap gap-2">
        {([['score', 'Recommended'], ['distance', 'Distance'], ['price', 'Price'], ['newest', 'Newest']] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => {
                setSort(value);
                onSearch({ query, radius, prizeGrade }, value);
              }}
              className={`px-3 py-1 text-sm rounded-full transition ${
                sort === value
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {label}
            </button>
        ))}
        </div>
      </div>
    </div>
  );
};
