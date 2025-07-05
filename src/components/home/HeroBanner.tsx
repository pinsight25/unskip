
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
      description: "Browse verified cars from trusted dealers with no lowball offers",
      cta: "Browse Cars",
      badge: "Exclusive",
      bgGradient: "from-blue-500 to-purple-600",
      icon: Car,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Sell Your Car Fast",
      subtitle: "Get Best Price in 24 Hours",
      description: "Connect with serious buyers instantly",
      cta: "Sell Now",
      badge: "Zero Commission",
      bgGradient: "from-green-500 to-teal-600",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Verified Buyers Only",
      subtitle: "100% Trusted Platform",
      description: "All users verified for your safety and peace of mind",
      cta: "Learn More",
      badge: "Trusted",
      bgGradient: "from-orange-500 to-red-600",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
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
    <div className="bg-white py-3 lg:py-4">
      <div className="w-full max-w-5xl mx-auto px-4 lg:px-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg h-80 md:h-96">
          {/* Background with gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.bgGradient}`} />
          
          {/* Navigation Arrows - Positioned outside content */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
          
          {/* Content with proper spacing from arrows */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center h-full px-16 md:px-20 py-8 max-w-5xl mx-auto">
            {/* Left Content - 60% */}
            <div className="flex-1 lg:pr-8 text-center lg:text-left max-w-md lg:max-w-none">
              {/* Badge */}
              <Badge className="bg-white/20 text-white border-white/30 mb-4 backdrop-blur-sm px-3 py-1 text-xs">
                <Award className="h-3 w-3 mr-1" />
                {currentBanner.badge}
              </Badge>
              
              {/* Main Content */}
              <h1 className="text-2xl lg:text-4xl font-bold mb-3 leading-tight text-white">
                {currentBanner.title}
              </h1>
              <p className="text-lg lg:text-xl font-semibold text-white/90 mb-3">
                {currentBanner.subtitle}
              </p>
              <p className="text-white/80 mb-6 text-sm lg:text-base leading-relaxed">
                {currentBanner.description}
              </p>
              
              {/* CTA Button */}
              <Button 
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-md hover:shadow-lg transition-all duration-200 h-12 px-8"
              >
                {currentBanner.cta}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            {/* Right Visual - 40% */}
            <div className="flex-1 lg:pl-8 mt-6 lg:mt-0 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Car Image */}
                <div className="w-72 h-48 lg:w-80 lg:h-56 rounded-lg overflow-hidden shadow-xl border-4 border-white/20">
                  <img 
                    src={currentBanner.image} 
                    alt="Car"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating Icon */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
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
