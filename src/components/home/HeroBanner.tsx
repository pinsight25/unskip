
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const banners = [
    {
      id: 1,
      title: "Find Your Perfect Car",
      subtitle: "Verified listings from trusted sellers",
      cta: "Browse Cars",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
      action: () => navigate('/search')
    },
    {
      id: 2,
      title: "Sell Your Car",
      subtitle: "Get the best price in 24 hours",
      cta: "Start Selling",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
      action: () => navigate('/sell')
    },
    {
      id: 3,
      title: "Trusted Dealers",
      subtitle: "All dealers are verified for your safety", 
      cta: "View Dealers",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
      action: () => navigate('/dealers')
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
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${currentBanner.image})` }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content - Positioned in upper area */}
          <div className="relative z-10 flex flex-col items-center justify-start h-full text-center px-8 pt-8 md:pt-12">
            <h1 className="text-xl md:text-4xl font-bold mb-2 text-white">
              {currentBanner.title}
            </h1>
            <p className="text-sm md:text-lg text-white/90 mb-4 md:mb-6">
              {currentBanner.subtitle}
            </p>
            <Button 
              size="lg"
              onClick={currentBanner.action}
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-md px-6 md:px-8 py-2 md:py-3 min-w-[100px] md:min-w-[120px] h-auto text-sm md:text-base"
            >
              {currentBanner.cta}
            </Button>
          </div>
          
          {/* Dots Indicator - Hidden on mobile, visible on desktop */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex space-x-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
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
