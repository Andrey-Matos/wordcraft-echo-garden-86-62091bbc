import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Neologism, Category, NeologismStatus } from '../types/neologism';
import { neologismService, categoryService } from '../services/supabaseService';
import { useAuth } from './AuthContext';
import { toast } from '../hooks/use-toast';

interface NeologismContextType {
  neologisms: Neologism[];
  categories: Category[];
  loading: boolean;
  addNeologism: (neologism: Omit<Neologism, 'id' | 'createdAt'>) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  updateNeologismStatus: (id: string, status: NeologismStatus) => Promise<void>;
  updateNeologism: (neologism: Neologism) => Promise<void>;
  deleteNeologism: (id: string) => Promise<void>;
  searchNeologisms: (query: string) => Neologism[];
  filterByCategory: (categoryId: string) => Neologism[];
  filterByStatus: (status: string) => Neologism[];
  getRandomNeologism: () => Neologism | null;
  getLatestNeologism: () => Neologism | null;
  refreshData: () => Promise<void>;
}

const NeologismContext = createContext<NeologismContextType | undefined>(undefined);

export function useNeologism() {
  const context = useContext(NeologismContext);
  if (context === undefined) {
    throw new Error('useNeologism must be used within a NeologismProvider');
  }
  return context;
}

export function NeologismProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [neologisms, setNeologisms] = useState<Neologism[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [latestNeologismId, setLatestNeologismId] = useState<string | null>(null);

  // Load data when component mounts or auth state changes
  useEffect(() => {
    refreshData();
  }, [isAuthenticated]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [neologismsData, categoriesData] = await Promise.all([
        neologismService.getNeologisms(),
        categoryService.getCategories()
      ]);
      setNeologisms(neologismsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNeologism = async (neologism: Omit<Neologism, 'id' | 'createdAt'>) => {
    console.log('addNeologism called:', { neologism, isAuthenticated });
    if (!isAuthenticated) {
      console.log('User not authenticated, showing toast');
      toast({
        title: "Authentication Required",
        description: "Please log in to create a neologism",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Attempting to create neologism:', neologism);
      const newNeologism = await neologismService.createNeologism(neologism);
      console.log('Neologism created successfully:', newNeologism);
      setNeologisms(prevNeologisms => [newNeologism, ...prevNeologisms]);
      setLatestNeologismId(newNeologism.id);
      toast({
        title: "Success",
        description: "Neologism created successfully",
      });
    } catch (error) {
      console.error('Error creating neologism:', error);
      toast({
        title: "Error",
        description: "Failed to create neologism",
        variant: "destructive",
      });
    }
  };

  const addCategory = async (categoryName: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a category",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newCategory = await categoryService.createCategory(categoryName);
      setCategories(prevCategories => [...prevCategories, newCategory]);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const updateNeologismStatus = async (id: string, status: NeologismStatus) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to update neologisms",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedNeologism = await neologismService.updateNeologismStatus(id, status);
      setNeologisms(prevNeologisms =>
        prevNeologisms.map(neologism =>
          neologism.id === id ? updatedNeologism : neologism
        )
      );
      toast({
        title: "Success",
        description: "Neologism status updated",
      });
    } catch (error) {
      console.error('Error updating neologism status:', error);
      toast({
        title: "Error",
        description: "Failed to update neologism status",
        variant: "destructive",
      });
    }
  };

  const updateNeologism = async (updatedNeologism: Neologism) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to update neologisms",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await neologismService.updateNeologism(updatedNeologism.id, updatedNeologism);
      setNeologisms(prevNeologisms =>
        prevNeologisms.map(neologism =>
          neologism.id === updatedNeologism.id ? result : neologism
        )
      );
      toast({
        title: "Success",
        description: "Neologism updated successfully",
      });
    } catch (error) {
      console.error('Error updating neologism:', error);
      toast({
        title: "Error",
        description: "Failed to update neologism",
        variant: "destructive",
      });
    }
  };

  const deleteNeologism = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete neologisms",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await neologismService.deleteNeologism(id);
      setNeologisms(prevNeologisms => prevNeologisms.filter(n => n.id !== id));
      toast({
        title: "Success",
        description: "Neologism deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting neologism:', error);
      toast({
        title: "Error",
        description: "Failed to delete neologism",
        variant: "destructive",
      });
    }
  };

  const searchNeologisms = (query: string): Neologism[] => {
    if (!query) return neologisms;
    
    const lowercaseQuery = query.toLowerCase();
    return neologisms.filter(neologism =>
      neologism.name.toLowerCase().includes(lowercaseQuery) ||
      neologism.definition.toLowerCase().includes(lowercaseQuery) ||
      neologism.rootWords.some(word => word.toLowerCase().includes(lowercaseQuery))
    );
  };

  const filterByCategory = (categoryId: string): Neologism[] => {
    if (!categoryId || categoryId === 'all') return neologisms;
    return neologisms.filter(neologism => neologism.categoryId === categoryId);
  };

  const filterByStatus = (status: string): Neologism[] => {
    if (!status || status === 'all') return neologisms;
    return neologisms.filter(neologism => neologism.status === status);
  };

  const getRandomNeologism = (): Neologism | null => {
    // If we have a latest neologism, prioritize it
    if (latestNeologismId) {
      const latest = neologisms.find(n => n.id === latestNeologismId);
      if (latest) return latest;
    }
    
    const readyNeologisms = neologisms.filter(n => n.status === 'Ready');
    if (readyNeologisms.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * readyNeologisms.length);
    return readyNeologisms[randomIndex];
  };

  const getLatestNeologism = (): Neologism | null => {
    if (neologisms.length === 0) return null;
    
    // Return the most recently added neologism
    return neologisms[0];
  };

  const value = {
    neologisms,
    categories,
    loading,
    addNeologism,
    addCategory,
    updateNeologismStatus,
    updateNeologism,
    deleteNeologism,
    searchNeologisms,
    filterByCategory,
    filterByStatus,
    getRandomNeologism,
    getLatestNeologism,
    refreshData,
  };

  return (
    <NeologismContext.Provider value={value}>
      {children}
    </NeologismContext.Provider>
  );
}