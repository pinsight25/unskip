
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-lg relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-red-500 text-white hover:bg-red-600 border border-red-500 hover:border-red-600 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        ghost: "hover:bg-gray-100 hover:text-gray-900 hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
        cta: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:-translate-y-1 active:-translate-y-0.5 text-base font-bold",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px]", // Ensure minimum touch target
        sm: "h-9 px-3 text-sm min-h-[36px]",
        lg: "h-12 px-8 text-base min-h-[48px]",
        xl: "h-14 px-10 text-lg min-h-[56px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
