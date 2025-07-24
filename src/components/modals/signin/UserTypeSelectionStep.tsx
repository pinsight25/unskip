import { Button } from '@/components/ui/button';
import { Car, Building2 } from 'lucide-react';

interface UserTypeSelectionStepProps {
  userType: 'regular' | 'dealer' | null;
  setUserType: (type: 'regular' | 'dealer') => void;
  onContinue: () => void;
}

const options = [
  {
    value: 'regular',
    icon: <Car className="h-8 w-8 text-orange-500 mb-2" />,
    label: 'Car Owner',
    desc: 'Buy and sell personal vehicles',
  },
  {
    value: 'dealer',
    icon: <Building2 className="h-8 w-8 text-orange-500 mb-2" />,
    label: 'Car Dealer',
    desc: 'Manage dealership inventory',
  },
];

const UserTypeSelectionStep = ({ userType, setUserType, onContinue }: UserTypeSelectionStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center mb-2">Let's get started! I am a...</h2>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setUserType(opt.value as 'regular' | 'dealer')}
            className={`flex-1 border rounded-2xl p-5 flex flex-col items-center shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${userType === opt.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}
            style={{ minWidth: 0 }}
          >
            {opt.icon}
            <span className="font-semibold text-lg mb-1">{opt.label}</span>
            <span className="text-sm text-gray-600 text-center">{opt.desc}</span>
          </button>
        ))}
      </div>
      <Button
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 font-semibold shadow-lg mt-2"
        disabled={!userType}
        onClick={onContinue}
      >
        Continue
      </Button>
    </div>
  );
};

export default UserTypeSelectionStep; 