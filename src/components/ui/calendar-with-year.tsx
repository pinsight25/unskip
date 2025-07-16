import * as React from 'react';
import { Calendar as ShadcnCalendar } from './calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YEARS = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarWithYearProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export const CalendarWithYear: React.FC<CalendarWithYearProps> = ({ value, onChange, className }) => {
  const [viewDate, setViewDate] = React.useState<Date>(value || new Date());

  React.useEffect(() => {
    if (value) setViewDate(value);
  }, [value]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setViewDate(prev => new Date(newYear, prev.getMonth(), 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setViewDate(prev => new Date(prev.getFullYear(), newMonth, 1));
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
      <ShadcnCalendar
        selected={value}
        onSelect={onChange}
        month={viewDate}
        onMonthChange={setViewDate}
      />
    </div>
  );
};

export default CalendarWithYear; 