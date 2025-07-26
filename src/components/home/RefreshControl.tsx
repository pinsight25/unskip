import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface RefreshControlProps {
  queryKeys: string[];
  onRefresh?: () => void;
  className?: string;
}

export const RefreshControl = ({ queryKeys, onRefresh, className = '' }: RefreshControlProps) => {
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    // Invalidate the specified query keys
    await Promise.all(
      queryKeys.map(key => 
        queryClient.invalidateQueries({ queryKey: [key] })
      )
    );
    
    // Call the optional callback
    onRefresh?.();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      className={`gap-2 ${className}`}
    >
      <RefreshCw className="h-4 w-4" />
      Refresh
    </Button>
  );
}; 