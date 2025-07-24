
interface MakeFilterProps {
  selectedMake: string;
  onMakeChange: (make: string) => void;
  makes: string[];
}

const MakeFilter = ({ selectedMake, onMakeChange, makes }: MakeFilterProps) => {
  const uniqueMakes = Array.from(new Set(makes)).filter(Boolean);
  return (
    <div>
      <h4 className="font-medium mb-3 text-gray-900">Make</h4>
      <select 
        value={selectedMake}
        onChange={(e) => onMakeChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
      >
        <option value="">All Makes</option>
        {uniqueMakes.map(make => (
          <option key={make} value={make}>{make}</option>
        ))}
      </select>
    </div>
  );
};

export default MakeFilter;
