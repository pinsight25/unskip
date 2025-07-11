
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface AccessoryActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const AccessoryActions = ({ onEdit, onDelete }: AccessoryActionsProps) => {
  return (
    <div className="flex flex-row md:flex-col gap-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={onEdit}
        className="flex-1 md:flex-none"
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onDelete}
        className="flex-1 md:flex-none text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  );
};

export default AccessoryActions;
