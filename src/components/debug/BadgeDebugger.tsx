import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Shield } from 'lucide-react';

interface BadgeDebuggerProps {
  car: {
    title: string;
    featured?: boolean;
    verified?: boolean;
  };
}

const BadgeDebugger = ({ car }: BadgeDebuggerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
      <h3 className="font-semibold text-sm mb-2">Badge Debugger</h3>
      <div className="space-y-2 text-xs">
        <div>
          <strong>Car:</strong> {car.title}
        </div>
        <div>
          <strong>Featured:</strong> {car.featured ? '✅ true' : '❌ false'}
        </div>
        <div>
          <strong>Verified:</strong> {car.verified ? '✅ true' : '❌ false'}
        </div>
        
        <div className="mt-3 pt-2 border-t">
          <strong>Badge Preview:</strong>
          <div className="mt-2 flex flex-col gap-1">
            {car.featured && (
              <Badge className="bg-amber-500 text-white text-xs font-medium px-2 py-1 shadow-lg w-fit">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {car.verified && (
              <Badge className="bg-green-500 text-white text-xs font-medium px-2 py-1 shadow-lg w-fit">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {!car.featured && !car.verified && (
              <span className="text-gray-500">No badges to show</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDebugger; 