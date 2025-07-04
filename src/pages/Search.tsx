
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ResponsiveLayout>
      <div className="pt-16 md:pt-20">
        {/* Search Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Advanced Search</h1>
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search cars by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle - Mobile */}
            <div className="md:hidden">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden md:block w-80 flex-shrink-0">
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="Min" className="border rounded px-3 py-2" />
                      <input type="number" placeholder="Max" className="border rounded px-3 py-2" />
                    </div>
                  </div>
                  
                  {/* Make */}
                  <div>
                    <h4 className="font-medium mb-2">Make</h4>
                    <select className="w-full border rounded px-3 py-2">
                      <option>All Makes</option>
                      <option>Maruti Suzuki</option>
                      <option>Hyundai</option>
                      <option>Tata</option>
                      <option>Mahindra</option>
                    </select>
                  </div>
                  
                  {/* Fuel Type */}
                  <div>
                    <h4 className="font-medium mb-2">Fuel Type</h4>
                    <div className="space-y-2">
                      {['Petrol', 'Diesel', 'CNG', 'Electric'].map((fuel) => (
                        <label key={fuel} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span>{fuel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full">Apply Filters</Button>
                </div>
              </Card>
            </div>

            {/* Results Area */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Search Results</h2>
                  <p className="text-gray-600">1,234 cars found</p>
                </div>
                
                <select className="border rounded px-3 py-2">
                  <option>Sort by: Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Year: Newest First</option>
                </select>
              </div>
              
              {/* Search Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] bg-gray-200 relative">
                      <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">2022 Maruti Swift VXI</h3>
                      <p className="text-2xl font-bold text-primary mb-2">₹6,50,000</p>
                      <p className="text-gray-600 text-sm">Mumbai, Maharashtra</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Search;
