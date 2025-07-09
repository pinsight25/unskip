
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';

interface CarFeaturesProps {
  features?: {
    sunroof?: boolean;
    alloyWheels?: boolean;
    reverseCamera?: boolean;
    pushStart?: boolean;
    musicSystem?: boolean;
    powerSteering?: boolean;
    powerWindows?: boolean;
    airConditioning?: boolean;
  };
}

const CarFeatures = ({ features }: CarFeaturesProps) => {
  const featuresList = [
    { key: 'sunroof', label: 'Sunroof', premium: true },
    { key: 'alloyWheels', label: 'Alloy Wheels', premium: true },
    { key: 'reverseCamera', label: 'Reverse Camera', premium: true },
    { key: 'pushStart', label: 'Push Button Start', premium: true },
    { key: 'musicSystem', label: 'Music System', premium: false },
    { key: 'powerSteering', label: 'Power Steering', premium: false },
    { key: 'powerWindows', label: 'Power Windows', premium: false },
    { key: 'airConditioning', label: 'Air Conditioning', premium: false },
  ];

  const availableFeatures = featuresList.filter(feature => 
    features?.[feature.key as keyof typeof features]
  );

  if (availableFeatures.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-orange-500" />
          Key Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature.label}</span>
              {feature.premium && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  Premium
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarFeatures;
