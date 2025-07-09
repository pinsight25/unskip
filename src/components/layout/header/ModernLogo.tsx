
import { Link } from 'react-router-dom';

const ModernLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* Modern Logo Icon - Option 1: Geometric/Abstract */}
      <div className="relative h-10 w-10 rounded-xl overflow-hidden">
        {/* Background with modern gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        
        {/* Abstract geometric pattern representing movement/path */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
            {/* Dynamic path/arrow design */}
            <path 
              d="M3 10L8 5L13 10L17 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            <circle cx="17" cy="6" r="2" fill="currentColor" className="opacity-80" />
          </svg>
        </div>
      </div>
      
      <div className="flex flex-col leading-tight">
        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Unskip
        </span>
        <span className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5 whitespace-nowrap tracking-wide">
          Find your perfect ride
        </span>
      </div>
    </Link>
  );
};

// Alternative Option 2: Automotive-focused design
export const ModernLogoOption2 = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="relative h-10 w-10 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
            {/* Modern car silhouette */}
            <path 
              d="M5 12V7a1 1 0 011-1h4l2-3h2l2 3h4a1 1 0 011 1v5M5 12a2 2 0 104 0M19 12a2 2 0 10-4 0M5 12h14" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex flex-col leading-tight">
        <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
          Unskip
        </span>
        <span className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5 whitespace-nowrap">
          Don't skip the right car
        </span>
      </div>
    </Link>
  );
};

// Alternative Option 3: Letter-based modern design
export const ModernLogoOption3 = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-lg">U</span>
      </div>
      
      <div className="flex flex-col leading-tight">
        <span className="text-xl md:text-2xl font-bold text-gray-900 font-sans">
          Unskip
        </span>
        <span className="text-[10px] md:text-xs text-gray-500 font-normal mt-0.5 whitespace-nowrap">
          Smart car discovery
        </span>
      </div>
    </Link>
  );
};

export default ModernLogo;
