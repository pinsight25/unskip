
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, Package, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyListingsState = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 md:p-8">
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Car className="h-10 w-10 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold mb-3 text-gray-900">No listings yet</h3>
        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
          Start earning money by posting your first car or accessory. It only takes a few minutes!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button 
            onClick={() => navigate('/sell-car')}
            size="lg"
            className="flex-1 h-12 text-base font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Post Your First Car
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/post-accessory')}
            size="lg"
            className="flex-1 h-12 text-base font-semibold"
          >
            <Package className="h-4 w-4 mr-2" />
            Post Accessory
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>✓ Free to post • ✓ Reach thousands of buyers • ✓ Easy management</p>
        </div>
      </div>
    </Card>
  );
};

export default EmptyListingsState;
