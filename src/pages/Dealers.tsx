
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, Phone, Shield, Plus, Calendar, Building2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dealersData, createSlug } from '@/data/dealers';

const Dealers = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Filter dealers based on selected filters
  const filteredDealers = dealersData.filter(dealer => {
    const locationMatch = !selectedLocation || selectedLocation === 'All Locations' || 
                         dealer.city.toLowerCase() === selectedLocation.toLowerCase();
    const brandMatch = !selectedBrand || selectedBrand === 'All Brands' || 
                      dealer.brands.some(brand => brand.toLowerCase() === selectedBrand.toLowerCase());
    
    return locationMatch && brandMatch;
  });

  const handleApplyFilters = () => {
    console.log('Filters applied:', { selectedLocation, selectedBrand });
  };

  const getSpecializationColor = (specialization: string) => {
    switch (specialization) {
      case 'Luxury Cars':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'Budget Cars':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'Electric':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="max-width-container-wide py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-2">Authorized Dealers</h1>
              <p className="text-gray-600 text-sm md:text-base">Find trusted dealers near you</p>
            </div>
            <Link to="/dealer/register">
              <Button className="mt-3 md:mt-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 py-2 shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Become a Dealer
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
            >
              <option value="">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
            </select>
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
            >
              <option value="">All Brands</option>
              <option value="Maruti Suzuki">Maruti Suzuki</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Tata">Tata</option>
              <option value="BMW">BMW</option>
              <option value="Audi">Audi</option>
              <option value="Mercedes">Mercedes</option>
            </select>
            <Button variant="outline" size="sm" className="shadow-sm" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>

          {/* Show active filters */}
          {(selectedLocation || selectedBrand) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedLocation && (
                <Badge variant="secondary" className="text-xs">
                  Location: {selectedLocation}
                  <button 
                    onClick={() => setSelectedLocation('')}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="text-xs">
                  Brand: {selectedBrand}
                  <button 
                    onClick={() => setSelectedBrand('')}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-width-container-wide py-4 pb-24 lg:pb-8">
        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            Showing {filteredDealers.length} of {dealersData.length} dealers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDealers.map((dealer) => (
            <Card key={dealer.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md">
              {/* Shop Photo Header */}
              <div className="relative h-24 bg-gradient-to-r from-gray-200 to-gray-300">
                {dealer.shopPhoto && (
                  <img
                    src={dealer.shopPhoto}
                    alt={`${dealer.name} shop`}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Verified Badge */}
                {dealer.verified && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-0 text-xs px-2 py-1">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                {/* Header Info */}
                <div className="mb-3">
                  <h3 className="font-bold text-base mb-1">{dealer.name}</h3>
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    Since {dealer.establishmentYear}
                  </div>
                </div>

                {/* Specialization Badge */}
                <div className="mb-3">
                  <Badge className={`${getSpecializationColor(dealer.specialization)} border font-medium text-xs px-2 py-1`}>
                    {dealer.specialization}
                  </Badge>
                </div>

                {/* Key Info Cards */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-3 w-3 mr-2 text-primary" />
                      <span className="text-xs font-medium">{dealer.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-blue-50 p-2 rounded-lg">
                    <Car className="h-3 w-3 mr-2 text-blue-600" />
                    <span className="text-xs font-medium">{dealer.carsInStock || 0} cars</span>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="mb-3 bg-orange-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-2 text-orange-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">{dealer.contactPerson}</p>
                      <p className="text-xs text-gray-600">{dealer.businessCategory}</p>
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Brands Available</h4>
                  <div className="flex flex-wrap gap-1">
                    {dealer.brands.map((brand) => (
                      <Badge key={brand} variant="outline" className="text-xs px-2 py-1">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/dealers/${createSlug(dealer.name)}`}>
                  <Button className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white font-semibold shadow-md text-sm py-2">
                    View Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredDealers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No dealers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
            <Button 
              onClick={() => {
                setSelectedLocation('');
                setSelectedBrand('');
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Bottom CTA for Mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/dealer/register">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Join as a Dealer
            </Button>
          </Link>
          <p className="text-sm text-gray-600 mt-2">Grow your business with us</p>
        </div>
      </div>
    </div>
  );
};

export default Dealers;
