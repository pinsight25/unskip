
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
      <div className="h-8 w-8 md:h-10 md:w-10 bg-primary rounded-lg flex items-center justify-center">
        <Car className="h-4 w-4 md:h-5 md:w-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg md:text-xl font-bold text-primary">CarVibe</span>
        <span className="text-xs text-muted-foreground -mt-1 font-medium hidden sm:block">Good Vibes, Fair Deals</span>
      </div>
    </Link>
  );
};

export default Logo;
