
import { Settings, FileText, Shield, CheckCircle, Percent } from 'lucide-react';

export type TabType = 'specifications' | 'registration' | 'condition' | 'insurance' | 'offers';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: 'specifications', label: 'Specifications', icon: Settings },
    { id: 'registration', label: 'Registration', icon: FileText },
    { id: 'condition', label: 'Condition', icon: Shield },
    { id: 'insurance', label: 'Insurance', icon: CheckCircle },
    { id: 'offers', label: 'Offers', icon: Percent }
  ] as const;

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as TabType)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-3 w-3 flex-shrink-0" />
            <span className="hidden sm:inline text-xs sm:text-sm">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
