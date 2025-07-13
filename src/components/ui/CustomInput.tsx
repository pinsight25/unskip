import React, { useState } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any additional props if needed
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, placeholder, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <Input
        className={cn(className)}
        ref={ref}
        placeholder={isFocused ? "" : placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";

export { CustomInput }; 