
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockAccessories } from '@/data/accessoryMockData';
import { Accessory } from '@/types/accessory';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AccessoryImageGallery from '@/components/accessory/detail/AccessoryImageGallery';
import AccessoryInfo from '@/components/accessory/detail/AccessoryInfo';
import AccessoryDetails from '@/components/accessory/detail/AccessoryDetails';
import AccessorySellerCard from '@/components/accessory/detail/AccessorySellerCard';
import RelatedAccessories from '@/components/accessory/detail/RelatedAccessories';

const AccessoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const accessory: Accessory | undefined = mockAccessories.find((acc) => acc.id === id);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();

  if (!accessory) {
    return (
      <ResponsiveLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Accessory Not Found</h2>
            <p className="text-gray-600">Sorry, the accessory you are looking for could not be found.</p>
            <Link to="/accessories" className="text-blue-500">Go back to accessories</Link>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const formatPrice = (price: { min: number; max: number }) => {
    if (price.min === price.max) {
      return `₹${price.min.toLocaleString('en-IN')}`;
    }
    return `₹${price.min.toLocaleString('en-IN')} - ₹${price.max.toLocaleString('en-IN')}`;
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

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Saved!",
      description: isSaved 
        ? "Accessory removed from your saved items" 
        : "Accessory saved to your wishlist",
    });
  };

  const handleChat = () => {
    toast({
      title: "Starting Chat",
      description: `Connecting you with ${accessory.seller.shopName}`,
    });
  };

  const handleCall = () => {
    toast({
      title: "Calling Seller",
      description: `Calling ${accessory.seller.shopName}`,
    });
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
  const relatedAccessories = mockAccessories
    .filter(acc => acc.category === accessory.category && acc.id !== accessory.id)
    .slice(0, 4);

  return (
    <ResponsiveLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-32 md:pb-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/accessories" className="hover:text-primary">Accessories</Link>
          <span>/</span>
          <span className="text-gray-900">{accessory.name}</span>
        </nav>

        {/* Main Content - Desktop 2-column, Mobile stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Images and Main Info (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AccessoryImageGallery
                images={accessory.images}
                name={accessory.name}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />

              <AccessoryInfo
                accessory={accessory}
                isSaved={isSaved}
                onSave={handleSave}
                onShare={handleShare}
                formatPrice={formatPrice}
                getConditionColor={getConditionColor}
              />
            </div>

            <AccessoryDetails accessory={accessory} />

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{accessory.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Seller Info with Contact Actions (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <AccessorySellerCard 
              seller={accessory.seller} 
              onChat={handleChat}
              onCall={handleCall}
            />
          </div>
        </div>

        <RelatedAccessories
          accessories={relatedAccessories}
          formatPrice={formatPrice}
        />
      </div>
    </ResponsiveLayout>
  );
};

export default AccessoryDetail;
