import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { PropertyFilters } from '@/contexts/PropertyContext';

interface SearchBarProps {
  onSearch: (filters: PropertyFilters) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [filters, setFilters] = useState<PropertyFilters>({});

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleInputChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  return (
    <div className={`bg-background border rounded-lg p-4 shadow-lg ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location..."
            className="pl-10"
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>

        <Select onValueChange={(value) => handleInputChange('type', value)}>
          <SelectTrigger>
            <Home className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleInputChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Buy or Rent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Buy & Rent</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Max Price..."
            className="pl-10"
            onChange={(e) => handleInputChange('maxPrice', parseFloat(e.target.value) || undefined)}
          />
        </div>

        <Button onClick={handleSearch} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;