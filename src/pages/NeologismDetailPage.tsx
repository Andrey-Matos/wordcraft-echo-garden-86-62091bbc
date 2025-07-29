
import React from 'react';
import { Header } from '@/components/Header';
import { NeologismDetail } from '@/components/NeologismDetail';

const NeologismDetailPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <NeologismDetail />
      </main>
      <footer className="bg-neologism-primary text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>© 2025 Neologisms - Coining the future of language</p>
        </div>
      </footer>
    </div>
  );
};

export default NeologismDetailPage;
