
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-100 border-t border-slate-200">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} KujiLink. All rights reserved.</p>
                <p className="mt-1">"Ichiban Kuji" is a registered trademark of its respective owner. This is an independent platform.</p>
            </div>
        </footer>
    );
};
