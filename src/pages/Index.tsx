
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FeaturedNeologism } from '@/components/FeaturedNeologism';
import { AddNeologismModal } from '@/components/AddNeologismModal';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { NeologismsList } from '@/components/NeologismsList';
import { useNeologism } from '@/context/NeologismContext';
import { Neologism, NeologismStatus } from '@/types/neologism';

const Index = () => {
  const { neologisms, searchNeologisms, filterByCategory, filterByStatus, getLatestNeologism } = useNeologism();
  const [filteredNeologisms, setFilteredNeologisms] = useState<Neologism[]>(neologisms);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Initialize neologisms on page load
  useEffect(() => {
    setFilteredNeologisms(neologisms);
  }, [neologisms]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedCategory, selectedStatus);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    applyFilters(searchQuery, categoryId, selectedStatus);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    applyFilters(searchQuery, selectedCategory, status);
  };

  const applyFilters = (query: string, categoryId: string, status: string) => {
    let results = neologisms;
    
    if (query) {
      results = searchNeologisms(query);
    }
    
    if (categoryId && categoryId !== 'all') {
      results = results.filter(neologism => neologism.categoryId === categoryId);
    }
    
    if (status && status !== 'all') {
      results = results.filter(neologism => neologism.status === status);
    }
    
    setFilteredNeologisms(results);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1 space-y-6 md:space-y-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-neologism-primary">
            Featured Neologism
          </h2>
          <AddNeologismModal />
        </div>
        
        <FeaturedNeologism />
        
        <div className="pt-4 md:pt-8">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-neologism-primary mb-4">
            Browse Neologisms
          </h2>
          
          <div className="space-y-4">
            <SearchAndFilter 
              onSearch={handleSearch} 
              onCategoryChange={handleCategoryChange}
              onStatusChange={handleStatusChange}
            />
            <NeologismsList neologisms={filteredNeologisms} />
          </div>
        </div>
      </main>
      <footer className="bg-neologism-primary text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>© 2025 Neologisms - Coining the future of language</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
