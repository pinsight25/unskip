
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyListingsState = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-4 md:p-6">
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
        <p className="text-gray-600 mb-6">Post your first car or accessory to get started</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/sell')}>
            <Car className="h-4 w-4 mr-2" />
            Post Your Car
          </Button>
          <Button variant="outline" onClick={() => navigate('/post-accessory')}>
            <Package className="h-4 w-4 mr-2" />
            Post Accessory
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EmptyListingsState;
