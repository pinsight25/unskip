
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, TrendingUp, Shield, Award, ChevronRight } from 'lucide-react';

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

  const currentBanner = banners[currentSlide];
  const Icon = currentBanner.icon;

  return (
    <div className="bg-white py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`relative rounded-2xl bg-gradient-to-r ${currentBanner.bgGradient} p-6 md:p-8 text-white overflow-hidden shadow-xl`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/20"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border border-white/20"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              {/* Badge */}
              <Badge className="bg-white/20 text-white border-white/30 mb-4 backdrop-blur-sm">
                <Award className="h-3 w-3 mr-1" />
                {currentBanner.badge}
              </Badge>
              
              {/* Main Content */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                {currentBanner.title}
              </h1>
              <p className="text-lg md:text-xl font-semibold text-white/90 mb-3">
                {currentBanner.subtitle}
              </p>
              <p className="text-white/80 mb-6 text-sm md:text-base">
                {currentBanner.description}
              </p>
              
              {/* CTA Button */}
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-8"
              >
                {currentBanner.cta}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
            </div>
          </div>
          
          {/* Slide Indicators - FIXED SIZE */}
          <div className="flex justify-center space-x-2 mt-6">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
