
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="h-10 w-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
        <Car className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xl md:text-2xl font-bold text-gray-900">CarVibe</span>
        <span className="text-[10px] md:text-xs text-gray-600 font-medium mt-0.5">Good Vibes, Fair Deals</span>
      </div>
    </Link>
  );
};

export default Logo;
