
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface CompactSearchHeaderProps {
  query: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  resultCount: number;
}

const CompactSearchHeader = ({ query, onSearch, onClear, resultCount }: CompactSearchHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 lg:top-20 z-40">
      <div className="w-full max-w-7xl mx-auto mobile-page-container search-results-compact">
        {/* Compact Search Bar */}
        <div className="flex gap-3 items-center search-header-to-bar">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search cars, brands, or locations..."
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-12 pr-12 h-11 lg:h-12 text-base border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && onSearch(query)}
            />
            {query && (
              <button
                onClick={onClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Count - Minimal spacing */}
        <div className="text-center search-bar-to-results">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
            {resultCount} {resultCount === 1 ? 'Car' : 'Cars'} found
          </h2>
          <p className="text-sm text-gray-600">
            Showing results for "{query}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompactSearchHeader;
