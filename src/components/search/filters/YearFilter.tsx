
interface YearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const YearFilter = ({ selectedYear, onYearChange }: YearFilterProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 text-gray-900">Year</h4>
      <select 
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
      >
        <option value="">Any Year</option>
        <option value="2020">2020 & Newer</option>
        <option value="2018">2018 & Newer</option>
        <option value="2015">2015 & Newer</option>
        <option value="2010">2010 & Newer</option>
      </select>
    </div>
  );
};

export default YearFilter;
