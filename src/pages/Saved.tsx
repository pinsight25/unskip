
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';

const Saved = () => {
  const savedCars = [1, 2, 3, 4]; // Mock data

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-primary/5 to-orange-100/30 border-b border-gray-100">
          <div className="container mx-auto mobile-page-container-fixed">
            <div className="flex flex-col md:flex-row md:items-center justify-between section-gap">
              <div className="text-center md:text-left">
                <h1 className="heading-1 mb-3">Saved Cars</h1>
                <p className="text-lg text-gray-600">
                  {savedCars.length} cars in your wishlist
                </p>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0">
                <Search className="h-4 w-4 mr-2" />
                Find Similar
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto mobile-page-container-fixed pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {savedCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedCars.map((item) => (
                  <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="aspect-[4/3] bg-gray-200"></div>
                      <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">2022 Maruti Swift VXI</h3>
                      <p className="text-2xl font-bold text-primary mb-2">₹6,50,000</p>
                      <p className="text-gray-600 text-sm mb-4">Mumbai, Maharashtra</p>
                      {/* Simplified - only Make Offer button */}
                      <Button size="sm" className="w-full">Make Offer</Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved cars yet</h3>
                <p className="text-gray-600 mb-6">Start saving cars you're interested in to see them here</p>
                <Button>Browse Cars</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Saved;
