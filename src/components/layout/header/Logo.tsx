
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
        <Car className="h-6 w-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 leading-tight">CarVibe</span>
        <span className="text-sm text-gray-600 font-medium leading-tight">Good Vibes, Fair Deals</span>
      </div>
    </Link>
  );
};

export default Logo;
