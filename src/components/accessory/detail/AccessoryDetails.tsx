
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Shield, RotateCcw, Clock } from 'lucide-react';
import { Accessory } from '@/types/accessory';

interface AccessoryDetailsProps {
  accessory: Accessory;
}

const AccessoryDetails = ({ accessory }: AccessoryDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <Wrench className="h-4 w-4 text-gray-500 mr-2" />
        <div>
          <p className="text-xs text-gray-500">Installation</p>
          <p className="text-sm font-medium">Available</p>
        </div>
      </div>
      <div className="flex items-center">
        <Shield className="h-4 w-4 text-gray-500 mr-2" />
        <div>
          <p className="text-xs text-gray-500">Warranty</p>
          <p className="text-sm font-medium">{accessory.warranty}</p>
        </div>
      </div>
      <div className="flex items-center">
        <RotateCcw className="h-4 w-4 text-gray-500 mr-2" />
        <div>
          <p className="text-xs text-gray-500">Return Policy</p>
          <p className="text-sm font-medium">{accessory.returnPolicy}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Clock className="h-4 w-4 text-gray-500 mr-2" />
        <div>
          <p className="text-xs text-gray-500">Response Time</p>
          <p className="text-sm font-medium">{accessory.seller.responseTime}</p>
        </div>
      </div>
    </div>
  );
};

export default AccessoryDetails;
