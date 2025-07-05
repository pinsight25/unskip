
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshControlProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const RefreshControl = ({ isRefreshing, onRefresh }: RefreshControlProps) => {
  return (
    <div className="flex justify-center mb-6 px-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 min-h-[44px]"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
      </Button>
    </div>
  );
};

export default RefreshControl;
