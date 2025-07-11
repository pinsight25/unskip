
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DealerHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <div className="max-width-container-wide py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">Authorized Dealers</h1>
            <p className="text-gray-600 text-sm md:text-base">Find trusted dealers near you</p>
          </div>
          <Link to="/dealer/register">
            <Button className="mt-3 md:mt-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 py-2 shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Become a Dealer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DealerHeader;
