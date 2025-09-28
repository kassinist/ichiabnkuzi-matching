
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { InventoryList } from './components/InventoryList';
import { InventoryDetailModal } from './components/InventoryDetailModal';
import { searchInventory } from './services/mockApi';
import type { InventoryItem, SearchFilters, SortOption } from './types';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (filters: SearchFilters, sort: SortOption) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchInventory(filters, sort);
      setInventory(results);
    } catch (err) {
      setError('Failed to fetch inventory. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load with default filters
    performSearch({ query: '', radius: 10, prizeGrade: 'all' }, 'score');
  }, [performSearch]);

  const handleSelectCard = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Find Your <span className="text-indigo-600">Prize</span>, Instantly.
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover and reserve leftover lottery prizes from stores near you. No more endless searching.
          </p>
        </div>
        
        <SearchBar onSearch={performSearch} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-md mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center mt-8 p-6 bg-red-100 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <InventoryList items={inventory} onSelectCard={handleSelectCard} />
        )}
      </main>
      
      {selectedItem && (
        <InventoryDetailModal item={selectedItem} onClose={handleCloseModal} />
      )}
      <Footer />
    </div>
  );
};

export default App;
