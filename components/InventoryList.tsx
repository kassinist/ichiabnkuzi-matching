
import React from 'react';
import type { InventoryItem } from '../types';
import { InventoryCard } from './InventoryCard';

interface InventoryListProps {
  items: InventoryItem[];
  onSelectCard: (item: InventoryItem) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ items, onSelectCard }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-800">No Results Found</h3>
        <p className="text-slate-500 mt-2">Try adjusting your search filters to find more prizes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <InventoryCard key={item.id} item={item} onSelect={() => onSelectCard(item)} />
      ))}
    </div>
  );
};
