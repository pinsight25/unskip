
import * as React from "react"
import { cn } from "@/lib/utils"

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, onFocus, onBlur, ...props }, ref) => {
    // Extract only the 10-digit part from the value
    const phoneDigits = value.replace(/^\+91\s?/, '').replace(/\D/g, '');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/\D/g, ''); // Only digits
      if (inputValue.length <= 10) {
        onChange(`+91 ${inputValue}`);
      }
    };

    return (
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-700 font-medium pointer-events-none z-10">
          +91
        </span>
        <input
          type="tel"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          value={phoneDigits}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={10}
          inputMode="numeric"
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
