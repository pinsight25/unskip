
import MakeModelSelector from '@/components/sell-car/car-details/MakeModelSelector';
import YearSelector from '@/components/sell-car/car-details/YearSelector';
import VehicleSpecsSelector from '@/components/sell-car/car-details/VehicleSpecsSelector';
import RegistrationDetailsSelector from '@/components/sell-car/car-details/RegistrationDetailsSelector';
import VehicleConditionSelector from '@/components/sell-car/car-details/VehicleConditionSelector';
import { SellCarFormData } from '@/hooks/useSellCarForm';

interface CarDetailsStepProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
  validateKilometersDriven: (km: string) => { valid: boolean; message: string };
}

const CarDetailsStep = ({ formData, setFormData, validateKilometersDriven }: CarDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Car Details</h2>
        <p className="text-gray-600 text-sm mb-6">
          Tell us about your car's basic information
        </p>
      </div>

      {/* Make, Model, Variant */}
      <MakeModelSelector 
        formData={formData} 
        setFormData={setFormData} 
      />

      {/* Year Selection */}
      <YearSelector 
        formData={formData} 
        setFormData={setFormData} 
      />

      {/* Vehicle Specifications */}
      <VehicleSpecsSelector 
        formData={formData} 
        setFormData={setFormData} 
      />

      {/* Registration Details */}
      <RegistrationDetailsSelector 
        formData={formData} 
        setFormData={setFormData} 
      />

      {/* Vehicle Condition */}
      <VehicleConditionSelector 
        formData={formData} 
        setFormData={setFormData} 
        validateKilometersDriven={validateKilometersDriven}
      />
    </div>
  );
};

export default CarDetailsStep;
