import { useState } from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import CarCard from '@/components/car/CarCard';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';
import { useSavedCars } from '@/hooks/useSavedCars';
import { useCars } from '@/hooks/queries/useCarQueries';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Saved = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { savedCars: savedCarIds, isLoading, unsaveCar, isSaving } = useSavedCars();
  const { data: allCars = [], isLoading: isCarsLoading } = useCars();

  // Filter allCars to only those in savedCarIds
  const savedCars = allCars.filter(car => savedCarIds?.includes(car.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <ResponsiveLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Saved Cars</h1>
                <p className="text-base md:text-lg text-gray-600">
                  {savedCars?.length || 0} cars in your wishlist
                </p>
              </div>
              <Button variant="outline" className="self-center md:self-auto hover-lift">
                <Search className="h-4 w-4 mr-2" />
                Find Similar
              </Button>
            </div>
          </div>
        </div>
        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8 pb-24 lg:pb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={`skeleton-${i}`} className="overflow-hidden bg-white animate-pulse h-72" />
              ))}
            </div>
          ) : savedCarIds && savedCarIds.length > 0 && savedCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onSave={() => unsaveCar(car.id)}
                  isSaved={true}
                  isSaving={isSaving === car.id}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No saved cars yet</h3>
              <p className="text-gray-600 mb-6">Start saving cars you're interested in to see them here</p>
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/'}
                className="touch-target-button"
              >
                Browse Cars
              </Button>
            </Card>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Saved;
