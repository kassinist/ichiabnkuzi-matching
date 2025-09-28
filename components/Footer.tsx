
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-100 border-t border-slate-200">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} KujiLink. 無断転載を禁じます。</p>
                <p className="mt-1">「一番くじ」は各権利者の登録商標です。本サービスは非公式のファン向けプラットフォームです。</p>
            </div>
        </footer>
    );
};

