
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import AccessoryActions from './AccessoryActions';

interface Accessory {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: { min: number; max: number };
  images: string[];
  location: string;
  views: number;
  postedDate: string;
  status: string;
  type: 'accessory';
}

interface AccessoryCardProps {
  accessory: Accessory;
  onEdit: (accessory: Accessory) => void;
  onDelete: (accessoryId: string, name: string) => void;
  formatPrice: (price: { min: number; max: number }) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

const AccessoryCard = ({ 
  accessory, 
  onEdit, 
  onDelete, 
  formatPrice, 
  getStatusBadge 
}: AccessoryCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-lg">{accessory.name}</h4>
            {getStatusBadge(accessory.status)}
          </div>
          <p className="text-sm text-gray-600 mb-1">{accessory.brand}</p>
          <p className="text-primary font-bold text-xl mb-1">
            {formatPrice(accessory.price)}
          </p>
          <p className="text-gray-600 text-sm mb-2">{accessory.location}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {accessory.postedDate}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {accessory.views} views
            </span>
          </div>
        </div>
        <AccessoryActions
          onEdit={() => onEdit(accessory)}
          onDelete={() => onDelete(accessory.id, accessory.name)}
        />
      </div>
    </div>
  );
};

export default AccessoryCard;
