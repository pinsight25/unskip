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
    <div className="container mx-auto px-4 py-3">
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
                <div className={`relative h-28 md:h-32 bg-gradient-to-br ${banner.bgColor} overflow-hidden cursor-pointer group`}>
                  {/* Modern Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-3 right-3 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/30 animate-pulse"></div>
                    <div className="absolute bottom-3 right-6 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/20"></div>
                    <div className="absolute top-1/2 right-3 w-4 h-4 rounded-full bg-white/10"></div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Content with proper spacing */}
                  <div className="relative h-full flex items-center justify-between p-3 md:p-4">
                    <div className="flex-1 text-white">
                      {/* Exclusive Offer Badge with proper margin */}
                      <div className="flex items-center gap-2 mb-2 mt-0.5">
                        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <Icon className="h-2.5 w-2.5" />
                        </div>
                        <span className="text-xs font-semibold opacity-90">Exclusive Offer</span>
                      </div>
                      
                      {/* Main Content */}
                      <h2 className="text-base md:text-xl font-bold mb-0.5 leading-tight">
                        {banner.title}
                      </h2>
                      <p className="text-sm md:text-base font-semibold mb-1.5 opacity-90">
                        {banner.subtitle}
                      </p>
                      <p className="text-xs opacity-80 mb-2 hidden md:block">
                        {banner.description}
                      </p>
                      
                      {/* CTA Button with proper bottom padding */}
                      <div className="pb-0.5">
                        <Button 
                          size="sm"
                          className="bg-white text-gray-900 hover:bg-white/90 font-bold group-hover:scale-105 transition-all duration-300 rounded-lg h-7 px-3 shadow-lg hover:shadow-xl text-xs"
                        >
                          {banner.cta}
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>

                    {/* Icon Display */}
                    <div className="hidden md:flex items-center justify-center w-20 lg:w-24 pr-1">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
                        <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
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
