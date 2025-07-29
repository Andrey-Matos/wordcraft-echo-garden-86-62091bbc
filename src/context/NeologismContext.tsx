
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Neologism, Category, NeologismStatus } from '../types/neologism';

// Sample Categories
const initialCategories: Category[] = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Slang' },
  { id: '3', name: 'Academic' },
  { id: '4', name: 'Business' },
  { id: '5', name: 'Culture' },
  { id: '6', name: 'Science' },
];

// Sample Neologisms
const initialNeologisms: Neologism[] = [
  {
    id: '1',
    name: 'Doomscrolling',
    rootWords: ['Doom', 'Scrolling'],
    categoryId: '1',
    category: 'Technology',
    definition: 'The act of continuously scrolling through negative news or social media content, despite the negative effect it has on one\'s mental health.',
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=400',
    status: 'Ready',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Phubbing',
    rootWords: ['Phone', 'Snubbing'],
    categoryId: '5',
    category: 'Culture',
    definition: 'The practice of ignoring one\'s companion or companions in order to pay attention to one\'s phone or other mobile device.',
    status: 'Ready',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    name: 'Nomophobia',
    rootWords: ['No', 'Mobile', 'Phobia'],
    categoryId: '1',
    category: 'Technology',
    definition: 'The fear of being without or unable to use one\'s mobile phone.',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=400',
    status: 'Ready',
    createdAt: new Date('2023-03-10'),
  },
  {
    id: '4',
    name: 'Infodemic',
    rootWords: ['Information', 'Epidemic'],
    categoryId: '6',
    category: 'Science',
    definition: 'An excessive amount of information about a problem that is typically unreliable, spreads rapidly, and makes a solution more difficult to achieve.',
    status: 'Draft',
    createdAt: new Date('2023-04-05'),
  },
  {
    id: '5',
    name: 'Webinar',
    rootWords: ['Web', 'Seminar'],
    categoryId: '4',
    category: 'Business',
    definition: 'A presentation, lecture, or workshop that is transmitted over the web.',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=400',
    status: 'Ready',
    createdAt: new Date('2023-05-12'),
  },
];

// Try to load neologisms from localStorage
const loadNeologismsFromStorage = (): Neologism[] => {
  try {
    const storedNeologisms = localStorage.getItem('neologisms');
    if (storedNeologisms) {
      const parsed = JSON.parse(storedNeologisms);
      // Convert string dates back to Date objects
      return parsed.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error loading neologisms from storage:', error);
  }
  return initialNeologisms;
};

// Try to load categories from localStorage
const loadCategoriesFromStorage = (): Category[] => {
  try {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      return JSON.parse(storedCategories);
    }
  } catch (error) {
    console.error('Error loading categories from storage:', error);
  }
  return initialCategories;
};

interface NeologismContextType {
  neologisms: Neologism[];
  categories: Category[];
  addNeologism: (neologism: Omit<Neologism, 'id' | 'createdAt'>) => void;
  addCategory: (category: string) => void;
  updateNeologismStatus: (id: string, status: NeologismStatus) => void;
  updateNeologism: (neologism: Neologism) => void;
  searchNeologisms: (query: string) => Neologism[];
  filterByCategory: (categoryId: string) => Neologism[];
  filterByStatus: (status: string) => Neologism[];
  getRandomNeologism: () => Neologism | null;
  getLatestNeologism: () => Neologism | null;
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
  const [neologisms, setNeologisms] = useState<Neologism[]>(loadNeologismsFromStorage());
  const [categories, setCategories] = useState<Category[]>(loadCategoriesFromStorage());
  const [latestNeologismId, setLatestNeologismId] = useState<string | null>(null);

  // Save to localStorage whenever neologisms or categories change
  useEffect(() => {
    try {
      localStorage.setItem('neologisms', JSON.stringify(neologisms));
    } catch (error) {
      console.error('Error saving neologisms to storage:', error);
    }
  }, [neologisms]);

  useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories to storage:', error);
    }
  }, [categories]);

  const addNeologism = (neologism: Omit<Neologism, 'id' | 'createdAt'>) => {
    const newId = Date.now().toString();
    const newNeologism = {
      ...neologism,
      id: newId,
      createdAt: new Date(),
    };
    
    // Find the category name from id
    const category = categories.find(cat => cat.id === neologism.categoryId);
    if (category && !newNeologism.category) {
      newNeologism.category = category.name;
    }
    
    setNeologisms(prevNeologisms => [newNeologism, ...prevNeologisms]);
    setLatestNeologismId(newId);
  };

  const addCategory = (categoryName: string) => {
    const newCategory = {
      id: Date.now().toString(),
      name: categoryName,
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const updateNeologismStatus = (id: string, status: NeologismStatus) => {
    setNeologisms(prevNeologisms =>
      prevNeologisms.map(neologism =>
        neologism.id === id ? { ...neologism, status } : neologism
      )
    );
  };

  const updateNeologism = (updatedNeologism: Neologism) => {
    setNeologisms(prevNeologisms =>
      prevNeologisms.map(neologism =>
        neologism.id === updatedNeologism.id ? updatedNeologism : neologism
      )
    );
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
    addNeologism,
    addCategory,
    updateNeologismStatus,
    updateNeologism,
    searchNeologisms,
    filterByCategory,
    filterByStatus,
    getRandomNeologism,
    getLatestNeologism,
  };

  return (
    <NeologismContext.Provider value={value}>
      {children}
    </NeologismContext.Provider>
  );
}
