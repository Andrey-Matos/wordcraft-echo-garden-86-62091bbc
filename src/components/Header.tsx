
import React from 'react';
import { BookOpenIcon } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-neologism-primary text-white py-4 px-6 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="h-6 w-6 text-neologism-accent" />
          <h1 className="text-xl md:text-2xl font-display font-bold">Neologisms</h1>
        </div>
        <div className="text-sm text-neologism-accent">Coining the future of language</div>
      </div>
    </header>
  );
};
