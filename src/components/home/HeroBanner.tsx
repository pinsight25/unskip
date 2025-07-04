
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
    <div className="container mx-auto px-4 py-6">
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
          className="rounded-2xl overflow-hidden shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {banners.map((banner) => {
            const Icon = banner.icon;
            return (
              <SwiperSlide key={banner.id}>
                <div className={`relative h-48 md:h-60 bg-gradient-to-br ${banner.bgColor} overflow-hidden cursor-pointer group`}>
                  {/* Modern Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-8 right-8 w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-white/30 animate-pulse"></div>
                    <div className="absolute bottom-8 right-16 w-20 h-20 md:w-24 md:w-24 rounded-full border-2 border-white/20"></div>
                    <div className="absolute top-1/2 right-8 w-12 h-12 rounded-full bg-white/10"></div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Content with proper spacing - FIXED PADDING */}
                  <div className="relative h-full flex items-center justify-between p-8 md:p-12">
                    <div className="flex-1 text-white">
                      {/* Exclusive Offer Badge - FIXED TOP MARGIN */}
                      <div className="flex items-center gap-2 mb-6 mt-2">
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs md:text-sm font-semibold opacity-90">Exclusive Offer</span>
                      </div>
                      
                      {/* Main Content */}
                      <h2 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                        {banner.title}
                      </h2>
                      <p className="text-lg md:text-2xl font-semibold mb-3 opacity-90">
                        {banner.subtitle}
                      </p>
                      <p className="text-xs md:text-sm opacity-80 mb-8 hidden md:block">
                        {banner.description}
                      </p>
                      
                      {/* CTA Button - FIXED BOTTOM PADDING */}
                      <div className="pb-4">
                        <Button 
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-white/90 font-bold group-hover:scale-105 transition-all duration-300 rounded-xl h-12 px-6 shadow-lg hover:shadow-xl"
                        >
                          {banner.cta}
                          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>

                    {/* Icon Display */}
                    <div className="hidden md:flex items-center justify-center w-40 lg:w-56 pr-4">
                      <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
                        <Icon className="h-14 w-14 lg:h-18 lg:w-18 text-white" />
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
