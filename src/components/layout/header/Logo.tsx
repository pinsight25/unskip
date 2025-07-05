
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-baseline group">
      <div className="h-10 w-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mr-3">
        <Car className="h-5 w-5 text-white" />
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl md:text-2xl font-bold text-gray-900 leading-tight">CarVibe</span>
        <span className="text-xs md:text-xs text-gray-600 font-medium leading-tight ml-2">Good Vibes, Fair Deals</span>
      </div>
    </Link>
  );
};

export default Logo;
