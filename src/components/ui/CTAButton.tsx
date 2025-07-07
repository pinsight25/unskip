
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface CTAButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
  size?: 'default' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary';
}

const CTAButton = ({ 
  children, 
  icon: Icon, 
  onClick, 
  className = '', 
  size = 'lg',
  variant = 'primary'
}: CTAButtonProps) => {
  return (
    <Button
      variant={variant === 'primary' ? 'cta' : 'outline'}
      size={size}
      onClick={onClick}
      className={`shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Button>
  );
};

export default CTAButton;
