import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, ArrowLeft, Camera } from 'lucide-react';
import { accessoryCategories } from '@/data/accessoryMockData';

const PostAccessory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priceMin: '',
    priceMax: '',
    brand: '',
    compatibility: [] as string[],
    condition: '',
    warranty: '',
    location: '',
    phone: '',
    email: ''
  });
  
  const [newModel, setNewModel] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const popularCarModels = [
    'Swift', 'Baleno', 'WagonR', 'Alto', 'Verna', 'Creta', 'i20', 'Grand i10',
    'City', 'Amaze', 'Jazz', 'Thar', 'XUV300', 'Seltos', 'Sonet', 'Venue'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCompatibleModel = (model: string) => {
    if (model && !formData.compatibility.includes(model)) {
      setFormData(prev => ({
        ...prev,
        compatibility: [...prev.compatibility, model]
      }));
      setNewModel('');
    }
  };

  const removeCompatibleModel = (model: string) => {
    setFormData(prev => ({
      ...prev,
      compatibility: prev.compatibility.filter(m => m !== model)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.priceMin) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Accessory Posted Successfully!",
      description: "Your accessory listing is now live and buyers can contact you.",
    });
    
    navigate('/accessories');
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/accessories')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="heading-2">Post Your Accessory</h1>
              <p className="text-gray-600">Sell your car accessories to thousands of buyers</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <Input
                      placeholder="e.g., Premium Leather Seat Covers"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand</label>
                    <Input
                      placeholder="e.g., 3M, Bosch, etc."
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Describe your accessory, its condition, features, etc."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {accessoryCategories.filter(cat => cat.id !== 'all').map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              {category.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Condition</label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  <p>Upload up to 2 photos of your accessory. First photo will be the main image.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((index) => (
                    <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer relative">
                      <div className="text-center">
                        <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">
                          Add Photo {index}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">Drag & drop photos here or click to browse</span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Price (₹) *</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={formData.priceMin}
                      onChange={(e) => handleInputChange('priceMin', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Maximum Price (₹)</label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.priceMax}
                      onChange={(e) => handleInputChange('priceMax', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compatibility */}
            <Card>
              <CardHeader>
                <CardTitle>Car Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Compatible Car Models</label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Enter car model"
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompatibleModel(newModel))}
                    />
                    <Button type="button" onClick={() => addCompatibleModel(newModel)}>
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {popularCarModels.map((model) => (
                      <Button
                        key={model}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCompatibleModel(model)}
                        disabled={formData.compatibility.includes(model)}
                      >
                        {model}
                      </Button>
                    ))}
                  </div>

                  {formData.compatibility.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selected Models:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.compatibility.map((model) => (
                          <Badge key={model} variant="secondary" className="flex items-center gap-1">
                            {model}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeCompatibleModel(model)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    placeholder="City, Area"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1">
                Post Accessory
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/accessories')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default PostAccessory;
