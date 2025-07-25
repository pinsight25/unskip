
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface AccessoryActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const AccessoryActions = ({ onEdit, onDelete }: AccessoryActionsProps) => {
  return (
    <div className="flex flex-row gap-2 w-full">
      <Button 
        size="sm" 
        variant="outline"
        onClick={onEdit}
        className="flex-1 text-xs sm:text-sm items-center justify-center"
      >
        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Edit</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onDelete}
        className="flex-1 text-xs sm:text-sm text-red-600 hover:text-red-700 items-center justify-center"
      >
        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Delete</span>
      </Button>
    </div>
  );
};

export default AccessoryActions;
