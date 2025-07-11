
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  timeout?: number; // in milliseconds
  onTimeout?: () => void;
  showTimeoutButton?: boolean;
}

const LoadingScreen = ({ 
  message = "Loading...", 
  timeout = 15000, // 15 seconds default
  onTimeout,
  showTimeoutButton = true
}: LoadingScreenProps) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [remainingTime, setRemainingTime] = useState(Math.ceil(timeout / 1000));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasTimedOut(true);
      onTimeout?.();
    }, timeout);

    // Update countdown every second
    const countdownId = setInterval(() => {
      setRemainingTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(countdownId);
    };
  }, [timeout, onTimeout]);

  const handleContinue = () => {
    window.location.reload();
  };

  if (hasTimedOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading is taking longer than expected</h2>
          <p className="text-gray-600 mb-4">
            The application is taking longer to load than usual. This might be due to a slow connection or temporary server issues.
          </p>
          {showTimeoutButton && (
            <Button onClick={handleContinue} className="w-full">
              Continue Anyway
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{message}</h2>
        <p className="text-gray-600 mb-4">
          Please wait while we initialize the application
        </p>
        {remainingTime > 0 && (
          <p className="text-sm text-gray-500">
            Timeout in {remainingTime} seconds...
          </p>
        )}
      </Card>
    </div>
  );
};

export default LoadingScreen;
