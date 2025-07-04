
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Clock, FileText, Zap } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroBanner = () => {
  const [isHovered, setIsHovered] = useState(false);

  const banners = [
    {
      id: 1,
      title: "Get ₹50,000 off",
      subtitle: "on premium cars",
      description: "Limited time offer on luxury vehicles",
      cta: "View Offers",
      bgColor: "from-orange-500 to-red-500",
      icon: Star,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "0% processing fee",
      subtitle: "this week only",
      description: "Complete paperwork assistance included",
      cta: "Get Started",
      bgColor: "from-blue-500 to-purple-500",
      icon: Zap,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Sell your car",
      subtitle: "in 24 hours",
      description: "Quick evaluation and instant offers",
      cta: "Sell Now",
      bgColor: "from-green-500 to-teal-500",
      icon: Clock,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Free RC transfer",
      subtitle: "assistance",
      description: "Complete documentation support",
      cta: "Learn More",
      bgColor: "from-purple-500 to-pink-500",
      icon: FileText,
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-2 !h-2',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-6'
          }}
          loop={true}
          className="rounded-2xl overflow-hidden shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {banners.map((banner) => {
            const Icon = banner.icon;
            return (
              <SwiperSlide key={banner.id}>
                <div className={`relative h-32 md:h-40 bg-gradient-to-br ${banner.bgColor} overflow-hidden cursor-pointer group`}>
                  {/* Modern Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/30 animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20"></div>
                    <div className="absolute top-1/2 right-4 w-6 h-6 rounded-full bg-white/10"></div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Content with proper spacing */}
                  <div className="relative h-full flex items-center justify-between p-4 md:p-6">
                    <div className="flex-1 text-white">
                      {/* Exclusive Offer Badge with proper top margin */}
                      <div className="flex items-center gap-2 mb-3 mt-1">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-semibold opacity-90">Exclusive Offer</span>
                      </div>
                      
                      {/* Main Content */}
                      <h2 className="text-lg md:text-2xl font-bold mb-1 leading-tight">
                        {banner.title}
                      </h2>
                      <p className="text-sm md:text-lg font-semibold mb-2 opacity-90">
                        {banner.subtitle}
                      </p>
                      <p className="text-xs opacity-80 mb-3 hidden md:block">
                        {banner.description}
                      </p>
                      
                      {/* CTA Button with proper bottom padding */}
                      <div className="pb-1">
                        <Button 
                          size="sm"
                          className="bg-white text-gray-900 hover:bg-white/90 font-bold group-hover:scale-105 transition-all duration-300 rounded-lg h-8 px-4 shadow-lg hover:shadow-xl text-xs"
                        >
                          {banner.cta}
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>

                    {/* Icon Display */}
                    <div className="hidden md:flex items-center justify-center w-24 lg:w-32 pr-2">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
                        <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroBanner;
