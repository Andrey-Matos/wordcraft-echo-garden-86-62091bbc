
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useNeologism } from '@/context/NeologismContext';
import { NeologismStatus } from '@/types/neologism';

interface SearchAndFilterProps {
  onSearch: (results: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onStatusChange: (status: string) => void;
}

export function SearchAndFilter({ onSearch, onCategoryChange, onStatusChange }: SearchAndFilterProps) {
  const { categories } = useNeologism();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
  };

  const handleStatusChange = (value: string) => {
    onStatusChange(value);
  };

  const statuses: Array<NeologismStatus | 'all'> = ['all', 'Draft', 'Ready', 'Rejected'];

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search neologisms..."
          className="pl-8 bg-white"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Select onValueChange={handleCategoryChange} defaultValue="all">
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={handleStatusChange} defaultValue="all">
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
