
interface FuelTypeFilterProps {
  selectedFuel: string[];
  onFuelToggle: (fuel: string) => void;
}

const FuelTypeFilter = ({ selectedFuel, onFuelToggle }: FuelTypeFilterProps) => {
  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];

  return (
    <div>
      <h4 className="font-medium mb-3 text-gray-900">Fuel Type</h4>
      <div className="space-y-3">
        {fuelTypes.map((fuel) => (
          <label key={fuel} className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="mr-3 rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              checked={selectedFuel.includes(fuel)}
              onChange={() => onFuelToggle(fuel)}
            />
            <span className="text-sm text-gray-700">{fuel}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FuelTypeFilter;
