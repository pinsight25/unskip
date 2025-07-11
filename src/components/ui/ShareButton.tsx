
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  dealerName: string;
  dealerId: string;
  carsCount: number;
  className?: string;
}

const ShareButton = ({ dealerName, dealerId, carsCount, className }: ShareButtonProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const generateShareUrl = () => {
    const baseUrl = 'https://unskip.lovable.app';
    const dealerSlug = createSlug(dealerName);
    return `${baseUrl}/dealers/${dealerSlug}`;
  };

  const shareText = `Check out ${dealerName} inventory on Unskip - ${carsCount}+ cars available`;

  const handleShare = async () => {
    setIsSharing(true);
    const shareUrl = generateShareUrl();

    try {
      // Check if Web Share API is supported (mobile)
      if (navigator.share) {
        await navigator.share({
          title: `${dealerName} - Unskip`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback for desktop - copy to clipboard
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({
          title: "Link Copied!",
          description: "Dealer link has been copied to clipboard",
        });
      }
    } catch (error) {
      // If sharing is cancelled or fails, try copying to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({
          title: "Link Copied!",
          description: "Dealer link has been copied to clipboard",
        });
      } catch (clipboardError) {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy link",
          variant: "destructive",
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      disabled={isSharing}
      className={className}
    >
      <Share2 className="h-4 w-4 mr-2" />
      {isSharing ? 'Sharing...' : 'Share'}
    </Button>
  );
};

export default ShareButton;
