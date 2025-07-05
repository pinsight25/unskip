
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
      subtitle: "2000+ Cars Available in Chennai",
      description: "Browse verified cars from trusted dealers and individual sellers",
      cta: "Browse Cars",
      badge: "Exclusive Offer",
      bgGradient: "from-blue-500 to-purple-600",
      icon: Car
    },
    {
      id: 2,
      title: "Sell Your Car Fast",
      subtitle: "Get Best Price in 24 Hours",
      description: "Free valuation and instant buyer connections",
      cta: "Sell Now",
      badge: "Zero Commission",
      bgGradient: "from-green-500 to-teal-600",
      icon: TrendingUp
    },
    {
      id: 3,
      title: "Verified Dealers",
      subtitle: "100% Trusted Platform",
      description: "All dealers are verified for your safety and peace of mind",
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
    <div className="bg-white py-6 lg:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
        <div className={`relative rounded-2xl bg-gradient-to-r ${currentBanner.bgGradient} p-6 lg:p-12 text-white overflow-hidden shadow-xl`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 right-8 w-40 h-40 rounded-full border-2 border-white/20"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full border border-white/20"></div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
          
          {/* Content - Properly centered */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <Badge className="bg-white/20 text-white border-white/30 mb-6 backdrop-blur-sm px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                {currentBanner.badge}
              </Badge>
              
              {/* Main Content */}
              <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                {currentBanner.title}
              </h1>
              <p className="text-xl lg:text-2xl font-semibold text-white/90 mb-4">
                {currentBanner.subtitle}
              </p>
              <p className="text-white/80 mb-8 text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                {currentBanner.description}
              </p>
              
              {/* CTA Button */}
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-14 px-10 text-lg"
              >
                {currentBanner.cta}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 lg:w-28 lg:h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon className="h-10 w-10 lg:h-14 lg:w-14 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
