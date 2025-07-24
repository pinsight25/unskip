
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAccessory, useAccessories } from '@/hooks/queries/useAccessories';
import { Accessory } from '@/types/accessory';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AccessoryImageGallery from '@/components/accessory/detail/AccessoryImageGallery';
import AccessoryInfo from '@/components/accessory/detail/AccessoryInfo';
import AccessorySellerCard from '@/components/accessory/detail/AccessorySellerCard';
import RelatedAccessories from '@/components/accessory/detail/RelatedAccessories';

const AccessoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();

  const { data: accessory, isLoading, error } = useAccessory(id!);
  const { data: allAccessories = [] } = useAccessories();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 pb-32 md:pb-6">
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !accessory) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Accessory Not Found</h2>
          <p className="text-gray-600">Sorry, the accessory you are looking for could not be found.</p>
          <Link to="/accessories" className="text-blue-500">Go back to accessories</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (priceMin: number, priceMax?: number | null) => {
    if (!priceMax || priceMin === priceMax) {
      return `₹${priceMin.toLocaleString('en-IN')}`;
    }
    return `₹${priceMin.toLocaleString('en-IN')} - ₹${priceMax.toLocaleString('en-IN')}`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'new': return 'bg-green-500 text-white';
      case 'like-new': return 'bg-blue-500 text-white';
      case 'good': return 'bg-yellow-500 text-white';
      case 'fair': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleChat = () => {
    if (accessory.whatsapp_contact && accessory.phone) {
      // Open WhatsApp with pre-filled message
      const message = `Hi! I'm interested in your ${accessory.name} listed on Unskip. Can you provide more details?`;
      const whatsappUrl = `https://wa.me/91${accessory.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast({
        title: "Contact Information",
        description: `Call ${accessory.phone} to inquire about this accessory`,
      });
    }
  };

  const handleCall = () => {
    if (accessory.phone) {
      window.open(`tel:${accessory.phone}`, '_self');
    } else {
      toast({
        title: "No Phone Number",
        description: "Phone number not available for this seller",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    navigator.share?.({
      title: accessory.name,
      text: `Check out this ${accessory.name} on CarVibe`,
      url: window.location.href,
    }) || toast({
      title: "Link copied!",
      description: "Accessory link copied to clipboard",
    });
  };

  // Get related accessories (same category, different products)
  const relatedAccessories = allAccessories
    .filter(acc => acc.category === accessory.category && acc.id !== accessory.id)
    .slice(0, 4);

  // Use real images from accessory data, fallback to placeholder if none
  const images = accessory.images && accessory.images.length > 0 
    ? accessory.images 
    : ['https://via.placeholder.com/600x400?text=Accessory+Image'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-32 md:pb-6">
      {/* Back Button and Breadcrumb */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/accessories" className="hover:text-primary">Accessories</Link>
          <span>/</span>
          <span className="text-gray-900">{accessory.name}</span>
        </nav>
      </div>

      {/* Main Content - Improved Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Images and Product Info (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccessoryImageGallery
              images={images}
              name={accessory.name}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              featured={accessory.featured || false}
              verified={accessory.verified_seller || false}
            />

            <AccessoryInfo
              accessory={accessory}
              onShare={handleShare}
              formatPrice={formatPrice}
              getConditionColor={getConditionColor}
            />
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{accessory.description}</p>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {accessory.additional_info && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Additional Details</h3>
                <p className="text-gray-700 leading-relaxed">{accessory.additional_info}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Seller Info (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          <AccessorySellerCard 
            seller={{
              id: accessory.seller_id,
              name: accessory.seller_name,
              shopName: accessory.seller_name,
              type: accessory.verified_seller ? 'dealer' : 'individual',
              phone: accessory.phone,
              email: accessory.email || '',
              verified: accessory.verified_seller || false,
              totalSales: 0,
              memberSince: accessory.created_at || '',
              location: accessory.location,
              specialization: [accessory.category],
              brandsCarried: [accessory.brand],
              responseTime: 'Usually responds within 1 hour'
            }}
            onChat={handleChat}
            onCall={handleCall}
            email={accessory.email}
            whatsappContact={accessory.whatsapp_contact}
          />
        </div>
      </div>

      <RelatedAccessories
        accessories={relatedAccessories}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default AccessoryDetail;
