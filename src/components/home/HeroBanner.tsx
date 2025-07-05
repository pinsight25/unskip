import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      title: "Find Your Perfect Car",
      subtitle: "2000+ verified listings",
      cta: "Browse",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Sell Without Lowballers",
      subtitle: "Get fair offers only",
      cta: "Sell Now",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Verified Dealers Only",
      subtitle: "Buy with confidence", 
      cta: "View All",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const currentBanner = banners[currentSlide];

  return (
    <div className="bg-white py-3 lg:py-4">
      <div className="w-full max-w-5xl mx-auto px-4 lg:px-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg h-[200px] md:h-[300px]">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentBanner.image})` }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
            <h1 className="text-2xl lg:text-4xl font-bold mb-2 text-white">
              {currentBanner.title}
            </h1>
            <p className="text-lg text-white/90 mb-6">
              {currentBanner.subtitle}
            </p>
            <Button 
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-md px-8 py-3 min-w-[120px] h-auto text-base"
            >
              {currentBanner.cta}
            </Button>
          </div>
          
          {/* Dots Indicator - Improved for mobile */}
          <div className="absolute bottom-6 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 md:space-x-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1 h-1 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
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
