
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  helperText?: string
  showHelperOnMobile?: boolean
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
  disabled,
  helperText,
  showHelperOnMobile = false
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect?.(selectedDate)
    setOpen(false) // Auto-close on selection
  }

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            style={{ userSelect: 'none' }} // Suppress browser helper text
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {helperText && showHelperOnMobile && (
        <p className="text-xs text-gray-500 lg:hidden">
          {helperText}
        </p>
      )}
    </div>
  )
}
