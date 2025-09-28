import React from 'react';
import type { InventoryItem } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { StarIcon } from './icons/StarIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

const currencyFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

const formatPrizeGrade = (grade: InventoryItem['prize']['grade']): string =>
  grade === 'Last One' ? 'ラストワン賞' : `${grade}賞`;

interface InventoryCardProps {
  item: InventoryItem;
  onSelect: () => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item, onSelect }) => {
  const { prize, store, price, photos, quantity } = item;
  const isRare = prize.grade === 'A' || prize.grade === 'Last One';

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group"
    >
      <div className="relative">
        <img src={photos[0]} alt={prize.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded-full ${isRare ? 'bg-amber-500' : 'bg-indigo-500'}`}>
          {formatPrizeGrade(prize.grade)}
        </div>
        {quantity === 1 && (
            <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full bg-red-600">
                残り1点！
            </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate text-slate-900" title={prize.title}>{prize.title}</h3>
        <p className="text-sm text-slate-500 truncate">{prize.series}</p>
        
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
                <p className="text-xl font-extrabold text-indigo-600">{currencyFormatter.format(price)}</p>
            </div>
            <div className="flex items-center text-sm text-slate-600 gap-1">
                <MapPinIcon className="w-4 h-4 text-slate-400" />
                <span>{store.distanceKm.toFixed(1)} km</span>
            </div>
        </div>

        <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-center text-sm">
            <div className="flex items-center gap-1.5 truncate">
                <p className="font-semibold text-slate-700 truncate">{store.name}</p>
                {/* FIX: The `title` prop is not a valid prop for SVG components. Wrapped the icon in a `span` and moved the title attribute to it to provide the tooltip. */}
                {store.verified && <span title="認証済み店舗"><CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" /></span>}
            </div>
            <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-amber-400" />
                <span className="font-medium text-slate-600">{store.rating.toFixed(1)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
