
import { useParams, Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Car } from '@/types/car';
import { mockCars } from '@/data/mockData';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ShareButton from '@/components/ui/ShareButton';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Star, MapPin, Car as CarIcon, Phone, Shield, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const DealerInventory = () => {
  const { dealerId } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState('');
  
  // Mock dealer data - in real app this would come from API
  const dealer = {
    id: dealerId || '1',
    name: 'CarMax Motors',
    rating: 4.8,
    reviewCount: 234,
    location: 'Andheri West, Mumbai',
    carsInStock: 150,
    responseTime: '30 mins',
    verified: true,
    brands: ['Maruti Suzuki', 'Hyundai', 'Tata']
  };

  // Filter cars by dealer - in real app this would be API call
  const dealerCars = mockCars.filter(car => car.seller.type === 'dealer').slice(0, 12);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sortedCars = [...dealerCars].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'year_desc':
        return b.year - a.year;
      case 'mileage_asc':
        return a.mileage - b.mileage;
      default:
        return 0;
    }
  });

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dealers">Dealers</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{dealer.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button for Mobile */}
          <Link 
            to="/dealers" 
            className="md:hidden flex items-center text-primary font-medium mb-4 hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dealers
          </Link>

          {/* Dealer Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold">{dealer.name}</h1>
                  {dealer.verified && (
                    <Badge className="bg-green-100 text-green-700">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <ShareButton 
                    dealerName={dealer.name}
                    dealerId={dealer.id}
                    carsCount={dealer.carsInStock}
                  />
                </div>
                
                <div className="flex items-center text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">
                    {dealer.rating} ({dealer.reviewCount} reviews)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{dealer.location}</span>
                  </div>
                  <div className="flex items-center">
                    <CarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{dealer.carsInStock}+ cars in stock</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">Responds in {dealer.responseTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {dealer.brands.map((brand) => (
                    <Badge key={brand} variant="outline" className="text-xs">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline">Call Now</Button>
                <Button variant="outline">Get Directions</Button>
              </div>
            </div>
          </div>

          {/* Inventory Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold">Available Inventory</h2>
              <p className="text-gray-600">{sortedCars.length} cars available</p>
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
            >
              <option value="">Sort by: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest First</option>
              <option value="mileage_asc">Mileage: Best First</option>
            </select>
          </div>

          {/* Cars Grid */}
          <div className="w-full">
            {sortedCars.length > 0 ? (
              isMobile ? (
                <div className="space-y-4">
                  {sortedCars.map((car) => (
                    <MobileCarCard 
                      key={car.id} 
                      car={car} 
                      onSave={() => {}}
                      isSaved={false}
                      onMakeOffer={() => {}}
                      onChat={() => {}}
                      onTestDrive={() => {}}
                      offerStatus="none"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {sortedCars.map((car) => (
                    <CarCard 
                      key={car.id} 
                      car={car} 
                      onSave={() => {}}
                      isSaved={false}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No cars available</h3>
                <p className="text-gray-600 mb-4">This dealer currently has no cars in stock</p>
                <Link to="/dealers">
                  <Button>Browse Other Dealers</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {sortedCars.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Cars
              </Button>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default DealerInventory;
