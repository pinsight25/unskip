import React, { forwardRef } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaControls?: string;
  ariaHaspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  role?: string;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      className,
      ariaLabel,
      ariaDescribedBy,
      ariaExpanded,
      ariaPressed,
      ariaControls,
      ariaHaspopup,
      role,
      tabIndex = 0,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle keyboard navigation
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (props.onClick) {
            props.onClick(event as any);
          }
          break;
        case 'Escape':
          // Close dropdowns or modals
          if (ariaHaspopup) {
            event.preventDefault();
            // You can add custom escape handling here
          }
          break;
        default:
          break;
      }

      // Call custom onKeyDown handler
      onKeyDown?.(event);
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className
        )}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        aria-controls={ariaControls}
        aria-haspopup={ariaHaspopup}
        role={role}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

// Accessible link button for navigation
interface AccessibleLinkButtonProps extends AccessibleButtonProps {
  href: string;
  external?: boolean;
}

export const AccessibleLinkButton = forwardRef<HTMLButtonElement, AccessibleLinkButtonProps>(
  (
    {
      href,
      external = false,
      children,
      variant = 'default',
      size = 'default',
      className,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (external) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
      props.onClick?.(event);
    };

    return (
      <AccessibleButton
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        ariaLabel={ariaLabel || `Navigate to ${href}`}
        onClick={handleClick}
        {...props}
      >
        {children}
        {external && (
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </AccessibleButton>
    );
  }
);

AccessibleLinkButton.displayName = 'AccessibleLinkButton';

// Accessible icon button
interface AccessibleIconButtonProps extends Omit<AccessibleButtonProps, 'children' | 'size'> {
  icon: React.ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AccessibleIconButton = forwardRef<HTMLButtonElement, AccessibleIconButtonProps>(
  (
    {
      icon,
      label,
      size = 'md',
      variant = 'ghost',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12'
    };

    return (
      <AccessibleButton
        ref={ref}
        variant={variant}
        size="icon"
        className={cn(sizeClasses[size], className)}
        ariaLabel={label}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {icon}
      </AccessibleButton>
    );
  }
);

AccessibleIconButton.displayName = 'AccessibleIconButton';

// Accessible toggle button
interface AccessibleToggleButtonProps extends AccessibleButtonProps {
  pressed: boolean;
  onToggle: (pressed: boolean) => void;
  pressedLabel?: string;
  unpressedLabel?: string;
}

export const AccessibleToggleButton = forwardRef<HTMLButtonElement, AccessibleToggleButtonProps>(
  (
    {
      pressed,
      onToggle,
      pressedLabel,
      unpressedLabel,
      children,
      variant = 'outline',
      className,
      ...props
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onToggle(!pressed);
      props.onClick?.(event);
    };

    const label = pressed ? pressedLabel : unpressedLabel;

    return (
      <AccessibleButton
        ref={ref}
        variant={variant}
        className={cn(
          pressed && 'bg-primary text-primary-foreground',
          className
        )}
        ariaPressed={pressed}
        ariaLabel={label}
        onClick={handleClick}
        {...props}
      >
        {children}
      </AccessibleButton>
    );
  }
);

AccessibleToggleButton.displayName = 'AccessibleToggleButton'; 