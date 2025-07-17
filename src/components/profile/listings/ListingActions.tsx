
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';

interface ListingActionsProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

const ListingActions = ({ onEdit, onDuplicate, onDelete, disabled }: ListingActionsProps) => {
  return (
    <div className="flex flex-row md:flex-col gap-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={onEdit}
        className="flex-1 md:flex-none items-center"
        disabled={disabled}
      >
        <Edit className="h-4 w-4 mr-1 align-middle" />
        Edit
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onDuplicate}
        className="flex-1 md:flex-none text-blue-600 hover:text-blue-700 flex items-center justify-center"
        disabled={disabled}
      >
        <Copy className="h-4 w-4 mr-2" />
        <span>Duplicate</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onDelete}
        className="flex-1 md:flex-none text-red-600 hover:text-red-700 items-center"
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4 mr-1 align-middle" />
        Delete
      </Button>
    </div>
  );
};

export default ListingActions;
