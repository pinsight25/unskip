
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 md:space-x-4 group">
      <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
        <Car className="h-5 w-5 md:h-6 md:w-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-bold text-primary">CarVibe</span>
        <span className="text-sm md:text-base text-muted-foreground -mt-1 font-medium hidden sm:block">Good Vibes, Fair Deals</span>
      </div>
    </Link>
  );
};

export default Logo;
