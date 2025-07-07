
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    name: string;
    phone: string;
    email: string;
  };
  onSave: (profile: { name: string; phone: string; email: string }) => void;
}

const EditProfileModal = ({ isOpen, onClose, currentProfile, onSave }: EditProfileModalProps) => {
  const [name, setName] = useState(currentProfile.name);
  const [phone, setPhone] = useState(currentProfile.phone);
  const [email, setEmail] = useState(currentProfile.email);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!phone.trim() || phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      onSave({ name: name.trim(), phone: phone.trim(), email: email.trim() });
      setIsLoading(false);
      onClose();
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    }, 1000);
  };

  const handleClose = () => {
    setName(currentProfile.name);
    setPhone(currentProfile.phone);
    setEmail(currentProfile.email);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Click to change photo</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number *</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="+91 98765 43210"
                maxLength={15}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email (Optional)</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
