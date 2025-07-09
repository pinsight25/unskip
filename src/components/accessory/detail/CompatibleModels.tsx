
import { Card, CardContent } from '@/components/ui/card';
import { Accessory } from '@/types/accessory';

interface CompatibleModelsProps {
  accessory: Accessory;
}

const CompatibleModels = ({ accessory }: CompatibleModelsProps) => {
  const displayModels = accessory.compatibility.slice(0, 4);
  const remainingCount = accessory.compatibility.length - 4;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-2">Compatible Models</h3>
        <p className="text-sm text-gray-700">
          {displayModels.join(', ')}
          {remainingCount > 0 && ` +${remainingCount} more`}
        </p>
      </CardContent>
    </Card>
  );
};

export default CompatibleModels;
