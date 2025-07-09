import { useState } from 'react';
import { Calendar, Fuel, Settings, Gauge, Palette, Users, FileText, MapPin, Shield, CheckCircle, AlertTriangle, Percent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatKilometersDriven } from '@/utils/carHelpers';
import { Car } from '@/types/car';

interface CarDetailTabsProps {
  car: Car;
}

type TabType = 'specifications' | 'registration' | 'condition' | 'insurance' | 'offers';

const CarDetailTabs = ({ car }: CarDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('specifications');

  const tabs = [
    { id: 'specifications', label: 'Specifications', icon: Settings },
    { id: 'registration', label: 'Registration', icon: FileText },
    { id: 'condition', label: 'Condition', icon: Shield },
    { id: 'insurance', label: 'Insurance', icon: CheckCircle },
    { id: 'offers', label: 'Offers', icon: Percent }
  ] as const;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric' 
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'specifications':
        return (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-gray-600">Year</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-gray-600">Fuel</div>
                    <div className="font-medium">{car.fuelType}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-gray-600">Transmission</div>
                    <div className="font-medium">{car.transmission}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-gray-600">Kilometers Driven</div>
                    <div className="font-medium">{formatKilometersDriven(car.kilometersDriven)}</div>
                  </div>
                </div>
                
                {car.color && (
                  <div className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-gray-600">Color</div>
                      <div className="font-medium">{car.color}</div>
                    </div>
                  </div>
                )}
                
                {car.seatingCapacity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-gray-600">Seating</div>
                      <div className="font-medium">{car.seatingCapacity} Seater</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'registration':
        return (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Model Year:</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  
                  {car.registrationYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Registration:</span>
                      <span className="font-medium">{car.registrationYear}</span>
                    </div>
                  )}
                  
                  {car.registrationState && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">State:</span>
                      <Badge variant="outline" className="text-xs">
                        {car.registrationState}
                      </Badge>
                    </div>
                  )}
                  
                  {car.seatingCapacity && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Seating:</span>
                      <span className="font-medium">{car.seatingCapacity} Seater</span>
                    </div>
                  )}
                </div>

                {car.variant && (
                  <div>
                    <span className="text-sm text-gray-600">Variant: </span>
                    <Badge variant="secondary" className="text-sm">
                      {car.variant}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'condition':
        return (
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Accident History */}
              <div className="flex items-center gap-2">
                {car.noAccidentHistory ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">No Accident History</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                      Clean Record
                    </Badge>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-700">Accident history available</span>
                  </>
                )}
              </div>

              {/* Service History */}
              {(car.lastServiceDate || car.serviceAtAuthorized !== undefined) && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-sm text-purple-800">Service History</span>
                  </div>
                  <div className="space-y-1 text-sm text-purple-700">
                    {car.lastServiceDate && (
                      <p>Last Service: {formatDate(car.lastServiceDate)}</p>
                    )}
                    {car.serviceAtAuthorized !== undefined && (
                      <p>Service Center: {car.serviceAtAuthorized ? 'Authorized' : 'Local'}</p>
                    )}
                  </div>
                </div>
              )}

              {/* RTO Transfer */}
              {car.rtoTransferSupport && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">RC Transfer Support Available</span>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'insurance':
        return (
          <Card>
            <CardContent className="p-4">
              {(car.insuranceValid && car.insuranceValidTill && car.insuranceType) ? (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm text-blue-800">Insurance Details</span>
                  </div>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>Type: {car.insuranceType}</p>
                    <p>Valid until: {formatDate(car.insuranceValidTill)}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No insurance information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'offers':
        return (
          <Card>
            <CardContent className="p-4">
              {car.acceptOffers && car.offerPercentage ? (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm text-green-800">
                      Accepting offers from {car.offerPercentage}% of asking price
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Percent className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No offers accepted</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation - Fixed mobile spacing */}
      <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center justify-center gap-1 px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 min-w-0 flex-shrink-0 ${
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

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CarDetailTabs;
