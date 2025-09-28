
import React, { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { StarIcon } from './icons/StarIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { TagIcon } from './icons/TagIcon';
import { CubeIcon } from './icons/CubeIcon';

interface InventoryDetailModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export const InventoryDetailModal: React.FC<InventoryDetailModalProps> = ({ item, onClose }) => {
  const [activePhoto, setActivePhoto] = useState(item.photos[0]);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const isRare = item.prize.grade === 'A' || item.prize.grade === 'Last One';

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  const handleReservation = () => {
    setIsReserving(true);
    // Simulate API call for reservation
    setTimeout(() => {
        setIsReserving(false);
        setReservationSuccess(true);
    }, 1500);
  };
  
  if (reservationSuccess) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 m-4 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-4">Reservation Confirmed!</h3>
                <p className="text-slate-600 mt-2">Your item is held for 24 hours. Check your notifications for details on pickup at <span className="font-semibold">{item.store.name}</span>.</p>
                <button onClick={onClose} className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition">
                    Done
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl m-4 max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 p-4 flex flex-col">
          <div className="relative flex-grow">
            <img src={activePhoto} alt={item.prize.title} className="w-full h-full object-contain rounded-lg" />
            <button onClick={onClose} className="absolute top-2 right-2 bg-white/50 hover:bg-white rounded-full p-2 transition">
              <XMarkIcon className="w-6 h-6 text-slate-800" />
            </button>
          </div>
          {item.photos.length > 1 && (
            <div className="flex gap-2 mt-2 p-2 justify-center">
              {item.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setActivePhoto(photo)}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${activePhoto === photo ? 'border-indigo-500' : 'border-transparent'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details and Actions */}
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <div className="flex-grow">
            <div className={`inline-block px-3 py-1 text-sm font-bold text-white rounded-full mb-2 ${isRare ? 'bg-amber-500' : 'bg-indigo-500'}`}>
              {item.prize.grade} Prize
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">{item.prize.title}</h2>
            <p className="text-md text-slate-500 mt-1">{item.prize.series}</p>
            
            <div className="my-6">
                <div className="flex items-center gap-4 text-sm text-slate-700">
                    <span className="flex items-center gap-1.5"><TagIcon className="w-5 h-5 text-indigo-500" /> Price: <span className="font-bold text-2xl text-indigo-600">${item.price.toFixed(2)}</span></span>
                    <span className="flex items-center gap-1.5"><CubeIcon className="w-5 h-5 text-indigo-500" /> In Stock: <span className="font-bold">{item.quantity}</span></span>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-bold text-lg text-slate-800 mb-2">Store Information</h4>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.store.name}</p>
                        {item.store.verified && <CheckBadgeIcon className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <StarIcon className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold">{item.store.rating.toFixed(1)}</span>
                    </div>
                </div>
                <div className="text-sm text-slate-600 mt-2 flex items-start gap-1.5">
                    <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{item.store.address} ({item.store.distanceKm.toFixed(1)} km away)</span>
                </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
             <p className="text-xs text-slate-500 mb-2 text-center">A small, refundable deposit of $3.00 is required. This will be deducted from the final price upon pickup.</p>
            <button
              onClick={handleReservation}
              disabled={isReserving}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isReserving ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : 'Reserve with Deposit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
