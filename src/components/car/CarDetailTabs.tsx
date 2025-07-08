
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Shield, Wrench, FileText, Star } from 'lucide-react';

interface CarDetailTabsProps {
  description: string;
  location: string;
  landmark?: string;
  features?: string[];
  insurance?: {
    validTill: string;
    type: 'Comprehensive' | 'Third Party';
  };
  serviceHistory?: {
    lastServiceDate?: string;
    authorizedCenter: boolean;
  };
  registrationYear?: number;
  registrationState?: string;
  rtoTransferSupport: boolean;
}

const CarDetailTabs = ({
  description,
  location,
  landmark,
  features,
  insurance,
  serviceHistory,
  registrationYear,
  registrationState,
  rtoTransferSupport
}: CarDetailTabsProps) => {
  const displayLocation = landmark ? `${location}, ${landmark}` : location;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric' 
    });
  };

  const defaultFeatures = [
    'Air Conditioning',
    'Power Steering',
    'Central Locking',
    'Electric Windows',
    'Music System'
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-4 space-y-4">
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </h4>
          <p className="text-gray-700 text-sm">{displayLocation}</p>
        </div>
      </TabsContent>
      
      <TabsContent value="features" className="mt-4">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Key Features
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {displayFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-1.5 w-1.5 bg-orange-500 rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="documents" className="mt-4 space-y-4">
        {insurance && (
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-800">
              <Shield className="h-4 w-4" />
              Insurance Details
            </h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p><span className="font-medium">Type:</span> {insurance.type}</p>
              <p><span className="font-medium">Valid until:</span> {formatDate(insurance.validTill)}</p>
            </div>
          </div>
        )}

        {serviceHistory && (
          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="font-medium mb-2 flex items-center gap-2 text-purple-800">
              <Wrench className="h-4 w-4" />
              Service History
            </h4>
            <div className="space-y-1 text-sm text-purple-700">
              {serviceHistory.lastServiceDate && (
                <p><span className="font-medium">Last Service:</span> {formatDate(serviceHistory.lastServiceDate)}</p>
              )}
              <p><span className="font-medium">Service Center:</span> {serviceHistory.authorizedCenter ? 'Authorized' : 'Local'}</p>
            </div>
          </div>
        )}

        {(registrationYear || registrationState) && (
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-medium mb-2 flex items-center gap-2 text-green-800">
              <FileText className="h-4 w-4" />
              Registration Details
            </h4>
            <div className="space-y-1 text-sm text-green-700">
              {registrationYear && <p><span className="font-medium">Year:</span> {registrationYear}</p>}
              {registrationState && <p><span className="font-medium">State:</span> {registrationState}</p>}
              {rtoTransferSupport && <p className="text-green-600">✓ RC Transfer Support Available</p>}
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default CarDetailTabs;
