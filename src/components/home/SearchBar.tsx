
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchBar = ({ searchQuery, onSearchQueryChange, onSearch, onClear }: SearchBarProps) => {
  return (
    <div className="flex gap-3 max-w-4xl mx-auto">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by make, model, or location..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-12 pr-12 h-11 lg:h-12 text-base border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-lg transition-all duration-200 hover:shadow-md"
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        />
        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button 
        onClick={onSearch}
        size="default"
        className="px-6 lg:px-8 h-11 lg:h-12 text-base font-bold flex-shrink-0"
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
