import * as React from 'react';
import { Calendar as ShadcnCalendar } from './calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YEARS = Array.from({ length: 2050 - 1990 + 1 }, (_, i) => 1990 + i);
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarWithYearProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
  yearMonthOnly?: boolean;
}

export const CalendarWithYear: React.FC<CalendarWithYearProps> = ({ value, onChange, className, yearMonthOnly }) => {
  const [viewDate, setViewDate] = React.useState<Date>(value || new Date());

  React.useEffect(() => {
    if (value) setViewDate(value);
  }, [value]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setViewDate(prev => {
      const newDate = new Date(newYear, prev.getMonth(), 1);
      if (yearMonthOnly && onChange) onChange(newDate);
      return newDate;
    });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setViewDate(prev => {
      const newDate = new Date(prev.getFullYear(), newMonth, 1);
      if (yearMonthOnly && onChange) onChange(newDate);
      return newDate;
    });
  };

  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2 gap-2">
        <button type="button" onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <select
          value={viewDate.getFullYear()}
          onChange={handleYearChange}
          className="border rounded px-2 py-1 text-sm focus:outline-none"
        >
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={viewDate.getMonth()}
          onChange={handleMonthChange}
          className="border rounded px-2 py-1 text-sm focus:outline-none"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <button type="button" onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {yearMonthOnly ? null : (
        <ShadcnCalendar
          selected={value}
          onSelect={onChange}
          month={viewDate}
          onMonthChange={setViewDate}
          showOutsideDays
          classNames={{
            ...((ShadcnCalendar as any).defaultProps?.classNames || {}),
            caption: 'hidden', // Hide the default caption/header
          }}
        />
      )}
    </div>
  );
};

export default CalendarWithYear; 