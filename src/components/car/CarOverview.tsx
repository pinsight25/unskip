
import CarPriceSection from './CarPriceSection';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, CheckCircle, Users } from 'lucide-react';

interface CarOverviewProps {
  title: string;
  price: number;
  rentPrice?: {
    daily: number;
    weekly: number;
  };
  description: string;
  variant?: string;
  ownership: number;
  noAccidentHistory?: boolean;
  verified?: boolean;
  featured?: boolean;
  seatingCapacity?: number;
}

const CarOverview = ({ 
  title, 
  price, 
  rentPrice, 
  description, 
  variant,
  ownership,
  noAccidentHistory,
  verified,
  featured,
  seatingCapacity
}: CarOverviewProps) => {
  const getOwnershipText = (ownership: number) => {
    if (ownership === 1) return '1st Owner';
    if (ownership === 2) return '2nd Owner';
    if (ownership === 3) return '3rd Owner';
    return `${ownership}th Owner`;
  };

  const displayTitle = variant ? `${title} ${variant}` : title;

  return (
    <div className="space-y-4">
      <CarPriceSection 
        title={displayTitle}
        price={price}
        rentPrice={rentPrice}
      />
      
      {/* Key Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
          {getOwnershipText(ownership)}
        </Badge>
        
        {noAccidentHistory && (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-3 py-1">
            <CheckCircle className="h-3 w-3 mr-1" />
            No Accident
          </Badge>
        )}
        
        {verified && (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-sm px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
        
        {featured && (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-sm px-3 py-1">
            <Award className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        
        {seatingCapacity && (
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Users className="h-3 w-3 mr-1" />
            {seatingCapacity} Seater
          </Badge>
        )}
      </div>
      
      <div>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default CarOverview;
