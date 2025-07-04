import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, MapPin, Car, IndianRupee, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';

const SellCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    fuelType: '',
    transmission: '',
    mileage: '',
    color: '',
    price: '',
    isRentAvailable: false,
    dailyRate: '',
    weeklyRate: '',
    photos: [] as string[],
    area: '',
    description: ''
  });

  const makes = ['Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Mahindra', 'Tata', 'Ford', 'Volkswagen', 'BMW', 'Mercedes'];
  const models = ['Swift', 'i20', 'City', 'Innova', 'XUV700', 'Harrier', 'EcoSport', 'Polo', 'X1', 'C-Class'];
  const areas = ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'Porur', 'Tambaram', 'Chrompet'];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Car Listed Successfully!",
      description: "Your car has been posted. You'll receive calls from interested buyers soon.",
    });
    navigate('/');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Make *</Label>
                <Select value={formData.make} onValueChange={(value) => setFormData({ ...formData, make: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {makes.map((make) => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Model *</Label>
                <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Year *</Label>
                <Input 
                  type="number" 
                  placeholder="2020"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Fuel Type *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transmission *</Label>
                <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mileage (km) *</Label>
                <Input 
                  type="number" 
                  placeholder="50000"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pricing</h2>
            <div className="space-y-4">
              <div>
                <Label>Asking Price *</Label>
                <div className="flex items-center mt-1">
                  <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                  <Input 
                    type="number" 
                    placeholder="650000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.isRentAvailable}
                  onCheckedChange={(checked) => setFormData({ ...formData, isRentAvailable: checked })}
                />
                <Label>Also available for rent?</Label>
              </div>

              {formData.isRentAvailable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <Label>Daily Rate</Label>
                    <div className="flex items-center mt-1">
                      <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                      <Input 
                        type="number" 
                        placeholder="1500"
                        value={formData.dailyRate}
                        onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                      />
                      <span className="ml-2 text-sm text-gray-500">/day</span>
                    </div>
                  </div>
                  <div>
                    <Label>Weekly Rate</Label>
                    <div className="flex items-center mt-1">
                      <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                      <Input 
                        type="number" 
                        placeholder="9000"
                        value={formData.weeklyRate}
                        onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })}
                      />
                      <span className="ml-2 text-sm text-gray-500">/week</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Photos</h2>
            <div className="text-sm text-gray-600 mb-4">
              Add at least 3 photos of your car. Good photos help sell faster!
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-xs text-gray-500">Add Photo {index}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <Upload className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-800">Drag & drop photos here or click to browse</span>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Location & Contact</h2>
            <div className="space-y-4">
              <div>
                <Label>Area *</Label>
                <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Textarea 
                  placeholder="Tell buyers about your car's condition, service history, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review & Post</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Car className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{formData.make} {formData.model}</h3>
                    <p className="text-sm text-gray-600">{formData.year} • {formData.fuelType} • {formData.transmission}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <span className="ml-2 font-semibold text-primary">₹{formData.price ? Number(formData.price).toLocaleString() : '0'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mileage:</span>
                    <span className="ml-2">{formData.mileage} km</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2">{formData.area}</span>
                  </div>
                  {formData.isRentAvailable && (
                    <div>
                      <span className="text-gray-600">Rental:</span>
                      <span className="ml-2">₹{formData.dailyRate}/day</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Ready to post!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your listing will be live immediately and buyers can contact you directly.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ResponsiveLayout showFooter={false}>
      <div className="pt-16 md:pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Sell Your Car</h1>
              <Badge variant="outline">Step {currentStep} of 5</Badge>
            </div>
            <Progress value={(currentStep / 5) * 100} className="h-2" />
          </div>

          {/* Form Content */}
          <Card>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === 5 ? (
              <Button onClick={handleSubmit} className="bg-primary">
                Post for Free
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-primary">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default SellCar;
