
import React from 'react';
import { Label } from '@/components/ui/label';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomTextarea } from '@/components/ui/CustomTextarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInput } from '@/components/ui/phone-input';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle } from 'lucide-react';
import { updateFormField } from '@/utils/formHelpers';
import { useCities } from '@/hooks/useCities';
import type { SellCarFormData } from '@/hooks/useSellCarForm';
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface LocationContactStepProps {
  formData: SellCarFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellCarFormData>>;
  updateFormData: (updates: Partial<SellCarFormData>) => void;
  onPhoneVerification: () => void;
}

// City autocomplete component (refactored to use cities and isLoading from parent)
const CityAutocomplete = ({ value, onChange, cities, isLoading }: { value: string; onChange: (value: string) => void; cities: string[]; isLoading: boolean }) => {
  const [search, setSearch] = useState(value || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (search.length > 1 && cities.length > 0) {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [search, cities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(true);
    onChange(value);
  };

  const selectCity = (city: string) => {
    setSearch(city);
    onChange(city);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={search}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Type city name (e.g., Chennai, Mumbai)"
      />
      {showSuggestions && (
        <>
          {isLoading && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md p-2 text-sm text-gray-500">
              Loading cities...
            </div>
          )}
          {!isLoading && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto z-50"
            >
              {suggestions.map((city, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => selectCity(city)}
                >
                  {city}
                </div>
              ))}
              {search.length > 2 && !suggestions.some(city => 
                city.toLowerCase() === search.toLowerCase()
              ) && (
                <div className="px-3 py-2 text-sm text-gray-500 italic">
                  Using: "{search}" (custom location)
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const LocationContactStep = ({ formData, setFormData, updateFormData, onPhoneVerification }: LocationContactStepProps) => {
  const { cities, isLoading: citiesLoading } = useCities();
  const [phoneError, setPhoneError] = useState('');

  // Helper to clean phone for validation/storage
  const cleanPhone = (phone: string) => phone.replace(/^\+91\s?/, '').replace(/\D/g, '');
  const isValidPhone = (phone: string) => cleanPhone(phone).length === 10;

  // On change, always store only 10 digits (no +91)
  const handlePhoneChange = (value: string) => {
    const digits = cleanPhone(value).slice(0, 10);
    console.log('[SellCar] Raw input:', value);
    console.log('[SellCar] Cleaned phone:', digits);
    const valid = isValidPhone(digits);
    console.log('[SellCar] Is valid phone:', valid);
    setFormData(prev => updateFormField(prev, 'phone', digits));
    if (!valid) {
      setPhoneError('Please enter a valid 10-digit phone number');
    } else {
      setPhoneError('');
    }
    console.log('[SellCar] Stored phone in formData:', digits);
  };

  return (
    <div className="space-y-6">
      {/* Location Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Location Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              City <span className="text-red-500">*</span>
            </label>
            <CityAutocomplete
              value={formData.city}
              onChange={(value) => {
                updateFormData({ city: value });
              }}
              cities={cities.map(city => city.state ? `${city.name}, ${city.state}` : city.name)}
              isLoading={citiesLoading}
            />
          </div>
          <div>
            <Label htmlFor="area">Area/Locality</Label>
            <CustomInput
              id="area"
              placeholder="e.g., Andheri East, Koramangala"
              value={formData.area}
              onChange={(e) => {
                updateFormData({ area: e.target.value });
              }}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="landmark">Landmark (Optional)</Label>
          <CustomInput
            id="landmark"
            placeholder="e.g., Near Metro Station, Mall"
            value={formData.landmark}
            onChange={(e) => setFormData(prev => updateFormField(prev, 'landmark', e.target.value))}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="address">Full Address</Label>
          <CustomTextarea
            id="address"
            placeholder="Enter complete address where the car can be inspected"
            value={formData.address}
            onChange={(e) => setFormData(prev => updateFormField(prev, 'address', e.target.value))}
            rows={3}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sellerName">Your Name *</Label>
            <CustomInput
              id="sellerName"
              placeholder="Enter your full name"
              value={formData.sellerName}
              onChange={(e) => setFormData(prev => updateFormField(prev, 'sellerName', e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <CustomInput
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => updateFormField(prev, 'email', e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <PhoneInput
                  id="phone"
                  value={formData.phone ? `+91 ${formData.phone}` : ''}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  disabled={false}
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>
            </div>
            {formData.phoneVerified && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Phone number verified successfully
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <CustomTextarea
            id="description"
            placeholder="Share any additional details about your car, special features, or selling reason..."
            value={formData.description}
            onChange={(e) => setFormData(prev => updateFormField(prev, 'description', e.target.value))}
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-1">
            A good description helps buyers understand your car better and can lead to faster sales.
          </p>
        </div>
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className="mt-6 flex items-center gap-2">
        <input
          type="checkbox"
          id="termsAccepted"
          checked={formData.termsAccepted}
          onChange={e => updateFormData({ termsAccepted: e.target.checked })}
          className="accent-primary"
        />
        <label htmlFor="termsAccepted" className="text-sm">
          I accept the <a href="/terms" target="_blank" className="underline">terms and conditions</a>
        </label>
      </div>
    </div>
  );
};

export default LocationContactStep;
