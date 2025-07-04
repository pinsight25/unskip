import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCars } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OTPModal from '@/components/modals/OTPModal';
import OfferModal from '@/components/modals/OfferModal';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Eye, 
  MapPin, 
  Calendar, 
  Fuel, 
  Settings, 
  User, 
  Shield, 
  Star, 
  Phone, 
  MessageCircle, 
  Clock,
  DollarSign,
  Car as CarIcon,
  Building2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CarDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const car = mockCars.find(c => c.id === id);
  
  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Car not found</h1>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSeller = () => {
    setOtpPurpose('contact the seller');
    setIsOTPModalOpen(true);
  };

  const handleScheduleTestDrive = () => {
    setOtpPurpose('schedule a test drive');
    setIsOTPModalOpen(true);
  };

  const handleOTPSuccess = () => {
    toast({
      title: "Verification Successful!",
      description: "You can now contact the seller directly.",
    });
  };

  const handleOfferSubmit = (offer: any) => {
    toast({
      title: "Offer Submitted!",
      description: "Your offer has been sent to the seller. They will contact you if interested.",
    });
  };

  const carSpecs = [
    { label: 'Year', value: car.year, icon: Calendar },
    { label: 'Fuel Type', value: car.fuelType, icon: Fuel },
    { label: 'Transmission', value: car.transmission, icon: Settings },
    { label: 'Ownership', value: `${car.ownership}${car.ownership === 1 ? 'st' : car.ownership === 2 ? 'nd' : car.ownership === 3 ? 'rd' : 'th'} Owner`, icon: User },
    { label: 'Mileage', value: `${car.mileage.toLocaleString('en-IN')} km`, icon: CarIcon },
    { label: 'Location', value: car.location, icon: MapPin }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <img
                      src={car.images[currentImageIndex]}
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {car.featured && (
                        <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                      )}
                      {car.verified && (
                        <Badge className="bg-success/10 text-success border-success/20">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* Views Counter */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {car.views}
                    </div>

                    {/* Image Navigation */}
                    {car.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                          disabled={currentImageIndex === 0}
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(Math.min(car.images.length - 1, currentImageIndex + 1))}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                          disabled={currentImageIndex === car.images.length - 1}
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {car.images.length > 1 && (
                    <div className="p-4 flex gap-2 overflow-x-auto">
                      {car.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                            currentImageIndex === index ? 'border-primary' : 'border-border'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${car.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Car Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {carSpecs.map((spec) => {
                      const Icon = spec.icon;
                      return (
                        <div key={spec.label} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">{spec.label}</p>
                            <p className="font-medium">{spec.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Pricing & Actions */}
            <div className="space-y-6">
              {/* Price & Actions Card */}
              <Card className="sticky top-6">
                <CardContent className="p-6 space-y-4">
                  {/* Title & Price */}
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{car.title}</h1>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(car.price)}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Rent Option */}
                    {car.isRentAvailable && car.rentPrice && (
                      <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <h4 className="font-semibold text-primary mb-1">Also Available for Rent</h4>
                        <div className="text-sm space-y-1">
                          <div>Daily: ₹{car.rentPrice.daily.toLocaleString('en-IN')}</div>
                          <div>Weekly: ₹{car.rentPrice.weekly.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setIsOfferModalOpen(true)}
                      className="w-full bg-gradient-primary"
                      size="lg"
                    >
                      <DollarSign className="h-5 w-5 mr-2" />
                      Make Offer
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleContactSeller}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleContactSeller}
                        className="flex-1"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleScheduleTestDrive}
                      className="w-full"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Test Drive
                    </Button>
                  </div>

                  <Separator />

                  {/* Seller Info */}
                  <div>
                    <h4 className="font-semibold mb-3">Seller Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium">
                            {car.seller.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium">{car.seller.name}</h5>
                            {car.seller.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-accent fill-current" />
                            <span>{car.seller.rating} rating</span>
                            <span>•</span>
                            <span>{car.seller.totalSales} sales</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {car.seller.location}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          Member since {new Date(car.seller.memberSince).getFullYear()}
                        </div>
                      </div>

                      {car.seller.type === 'dealer' && (
                        <Badge variant="outline" className="w-full justify-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          Verified Dealer
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Safety Notice */}
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-warning mt-0.5" />
                      <div>
                        <h5 className="text-sm font-semibold text-warning-foreground">Safety First</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Always inspect the vehicle in person, verify documents, and meet in a safe public location.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onSuccess={handleOTPSuccess}
        phoneNumber="+91 98765 43210"
        purpose={otpPurpose}
      />

      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        car={car}
        onSubmit={handleOfferSubmit}
      />
    </div>
  );
};

export default CarDetail;