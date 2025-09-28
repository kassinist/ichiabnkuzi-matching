
import React from 'react';
import { TargetIcon } from './icons/TargetIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TargetIcon className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-slate-900">KujiLink</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">For Stores</a>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Login
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
