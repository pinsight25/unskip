
import { useState } from 'react';
import { Car } from '@/types/car';
import TabNavigation, { TabType } from './tabs/TabNavigation';
import SpecificationsTab from './tabs/SpecificationsTab';
import RegistrationTab from './tabs/RegistrationTab';
import ConditionTab from './tabs/ConditionTab';
import InsuranceTab from './tabs/InsuranceTab';
import OffersTab from './tabs/OffersTab';

interface CarDetailTabsProps {
  car: Car;
}

const CarDetailTabs = ({ car }: CarDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('specifications');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'specifications':
        return <SpecificationsTab car={car} />;
      case 'registration':
        return <RegistrationTab car={car} />;
      case 'condition':
        return <ConditionTab car={car} />;
      case 'insurance':
        return <InsuranceTab car={car} />;
      case 'offers':
        return <OffersTab car={car} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="transition-all duration-300">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CarDetailTabs;
