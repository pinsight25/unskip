
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockAccessories } from '@/data/accessoryMockData';
import { Accessory } from '@/types/accessory';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Shield, 
  MessageCircle, 
  Phone,
  CheckCircle,
  Clock,
  RotateCcw,
  Wrench
} from 'lucide-react';

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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={accessory.images[selectedImage]}
                alt={accessory.name}
                className="w-full h-full object-cover"
              />
            </div>
            {accessory.images.length > 1 && (
              <div className="flex space-x-2">
                {accessory.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${accessory.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {accessory.name}
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">{accessory.brand}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {accessory.featured && (
                  <Badge className="bg-amber-500 text-white">⭐ Featured</Badge>
                )}
                {accessory.seller.verified && (
                  <Badge className="bg-green-500 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Seller
                  </Badge>
                )}
                <Badge 
                  variant={accessory.availability === 'in-stock' ? 'default' : 'secondary'}
                  className={accessory.availability === 'in-stock' ? 'bg-green-500 text-white' : ''}
                >
                  {accessory.availability === 'in-stock' ? 'In Stock' : 'On Order'}
                </Badge>
              </div>

              {/* Price */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-primary mb-1">
                  {formatPrice(accessory.price)}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {accessory.rating} ({accessory.reviewCount} reviews)
                  </div>
                  <div>
                    {accessory.views} views
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Key Features</h3>
              <ul className="space-y-2">
                {accessory.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compatibility */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Compatible With</h3>
              <div className="flex flex-wrap gap-2">
                {accessory.compatibility.map((model, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Wrench className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Installation</p>
                  <p className="text-sm font-medium capitalize">{accessory.installation}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Warranty</p>
                  <p className="text-sm font-medium">{accessory.warranty}</p>
                </div>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Return Policy</p>
                  <p className="text-sm font-medium">{accessory.returnPolicy}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Response Time</p>
                  <p className="text-sm font-medium">{accessory.seller.responseTime}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90 text-white font-medium"
                onClick={handleChat}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button 
                variant="outline"
                onClick={handleCall}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
        </div>

        {/* Seller Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Seller Information</h3>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {accessory.seller.shopName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{accessory.seller.shopName}</h4>
                  <p className="text-gray-600">{accessory.seller.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {accessory.seller.rating} rating
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {accessory.seller.location}
                    </div>
                    <div>
                      {accessory.seller.totalSales} sales
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{accessory.description}</p>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedAccessories.length > 0 && (
          <div>
            <h3 className="font-semibold text-xl mb-6">Similar Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedAccessories.map((related) => (
                <Link key={related.id} to={`/accessories/${related.id}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-3">
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        className="w-full aspect-square object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {related.name}
                      </h4>
                      <p className="text-primary font-semibold text-sm">
                        {formatPrice(related.price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default AccessoryDetail;
