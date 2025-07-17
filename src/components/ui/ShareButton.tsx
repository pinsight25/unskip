
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  dealerName: string;
  dealerSlug: string;
  carsCount: number;
  className?: string;
}

const ShareButton = ({ dealerName, dealerSlug, carsCount, className }: ShareButtonProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/dealers/${dealerSlug}`;
  };

  const shareText = `Check out ${dealerName} inventory on Unskip - ${carsCount}+ cars available`;

  const handleShare = async () => {
    if (!dealerSlug) {
      toast({
        title: "Share Failed",
        description: "Dealer link is not available.",
        variant: "destructive",
      });
      return;
    }
    setIsSharing(true);
    const shareUrl = generateShareUrl();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${dealerName} - Unskip`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({
          title: "Link Copied!",
          description: "Dealer link has been copied to clipboard",
        });
      }
    } catch (error) {
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
      className={className}
      disabled={isSharing || !dealerSlug}
    >
      <Share2 className="h-4 w-4 mr-2" />
      {isSharing ? 'Sharing...' : 'Share'}
    </Button>
  );
};

export default ShareButton;
