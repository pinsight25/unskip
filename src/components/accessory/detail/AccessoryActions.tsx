
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';

interface AccessoryActionsProps {
  onChat: () => void;
  onCall: () => void;
}

const AccessoryActions = ({ onChat, onCall }: AccessoryActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button 
        variant="default" 
        className="bg-primary hover:bg-primary/90 text-white font-medium"
        onClick={onChat}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Chat
      </Button>
      <Button 
        variant="outline"
        onClick={onCall}
      >
        <Phone className="h-4 w-4 mr-2" />
        Call
      </Button>
    </div>
  );
};

export default AccessoryActions;
