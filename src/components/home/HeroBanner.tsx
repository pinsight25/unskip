
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
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-6">
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
          className="rounded-xl overflow-hidden shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {banners.map((banner) => {
            const Icon = banner.icon;
            return (
              <SwiperSlide key={banner.id}>
                <div className={`relative h-32 md:h-48 bg-gradient-to-r ${banner.bgColor} overflow-hidden cursor-pointer group`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/30"></div>
                    <div className="absolute bottom-4 right-12 w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/20"></div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex items-center justify-between p-4 md:p-8">
                    <div className="flex-1 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="text-xs md:text-sm font-medium opacity-90">Exclusive Offer</span>
                      </div>
                      <h2 className="text-xl md:text-3xl font-bold mb-1">
                        {banner.title}
                      </h2>
                      <p className="text-lg md:text-xl font-semibold mb-2 opacity-90">
                        {banner.subtitle}
                      </p>
                      <p className="text-xs md:text-sm opacity-80 mb-4 hidden md:block">
                        {banner.description}
                      </p>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="bg-white text-gray-900 hover:bg-white/90 font-medium group-hover:scale-105 transition-transform duration-200"
                      >
                        {banner.cta}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>

                    {/* Celebrity/Image Space */}
                    <div className="hidden md:flex items-center justify-center w-32 lg:w-48">
                      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon className="h-12 w-12 lg:h-16 lg:w-16 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
