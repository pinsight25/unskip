
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, TrendingUp, Shield, Award, ChevronRight, ChevronLeft } from 'lucide-react';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      title: "Find Your Dream Car",
      subtitle: "2000+ Cars Available",
      description: "Browse verified cars from trusted dealers",
      cta: "Browse Cars",
      badge: "Exclusive",
      bgGradient: "from-blue-500 to-purple-600",
      icon: Car
    },
    {
      id: 2,
      title: "Sell Your Car Fast",
      subtitle: "Get Best Price in 24 Hours",
      description: "Free valuation and instant connections",
      cta: "Sell Now",
      badge: "Zero Commission",
      bgGradient: "from-green-500 to-teal-600",
      icon: TrendingUp
    },
    {
      id: 3,
      title: "Verified Dealers",
      subtitle: "100% Trusted Platform",
      description: "All dealers verified for your safety",
      cta: "View Dealers",
      badge: "Trusted",
      bgGradient: "from-orange-500 to-red-600",
      icon: Shield
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBanner = banners[currentSlide];
  const Icon = currentBanner.icon;

  return (
    <div className="bg-white py-4 lg:py-6">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6">
        <div className={`relative rounded-xl bg-gradient-to-r ${currentBanner.bgGradient} p-6 lg:p-8 text-white overflow-hidden shadow-lg h-72 md:h-80`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full border border-white/20"></div>
            <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border border-white/20"></div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
          
          {/* Content - Compact and centered */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 h-full max-w-5xl mx-auto">
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <Badge className="bg-white/20 text-white border-white/30 mb-4 backdrop-blur-sm px-3 py-1 text-sm">
                <Award className="h-3 w-3 mr-1" />
                {currentBanner.badge}
              </Badge>
              
              {/* Main Content */}
              <h1 className="text-2xl lg:text-4xl font-bold mb-3 leading-tight">
                {currentBanner.title}
              </h1>
              <p className="text-lg lg:text-xl font-semibold text-white/90 mb-2">
                {currentBanner.subtitle}
              </p>
              <p className="text-white/80 mb-6 text-sm lg:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                {currentBanner.description}
              </p>
              
              {/* CTA Button */}
              <Button 
                size="default"
                className="bg-white text-gray-900 hover:bg-white/90 font-medium shadow-md hover:shadow-lg transition-all duration-200 h-10 px-6"
              >
                {currentBanner.cta}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Icon - Smaller */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
