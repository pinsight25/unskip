
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: any;
  onSave: (profile: any) => void;
}

const cities = [
  'Chennai',
  'Mumbai', 
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Kolkata'
];

const EditProfileModal = ({ isOpen, onClose, currentProfile, onSave }: EditProfileModalProps) => {
  // Add null checks and provide default values
  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    email: currentProfile?.email || '',
    city: currentProfile?.city || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Don't render if currentProfile is null
  if (!currentProfile) {
    return null;
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.city) {
      setError('Please select your city');
      return;
    }

    setIsSaving(true);
    setError('');

    setTimeout(() => {
      onSave(formData);
      onClose();
      setIsSaving(false);
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Full Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">City *</label>
            <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {cities.map((city) => (
                  <SelectItem key={city} value={city} className="hover:bg-gray-50">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1 h-12"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !formData.name.trim() || !formData.city}
              className="flex-1 h-12"
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
