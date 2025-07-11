
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, Calendar, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createSlug } from '@/data/dealers';

interface DealerCardProps {
  dealer: {
    id: string;
    name: string;
    contactPerson: string;
    businessCategory: string;
    specialization: string;
    location: string;
    establishmentYear: string;
    carsInStock: number;
    verified: boolean;
    brands: string[];
    shopPhoto?: string;
  };
}

const DealerCard = ({ dealer }: DealerCardProps) => {
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md">
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
  );
};

export default DealerCard;
