
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Car, User, Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { timeSlots } from '@/data/chatMockData';
import { Car as CarType } from '@/types/car';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarType;
  onScheduled: (booking: any) => void;
}

const TestDriveModal = ({ isOpen, onClose, car, onScheduled }: TestDriveModalProps) => {
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'confirmation'>('date');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [contactDetails, setContactDetails] = useState({
    name: 'John Doe',
    phone: '+91 98765 43210',
    alternatePhone: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const booking = {
        date: formatDate(selectedDate),
        timeSlot: selectedTime,
        ...contactDetails
      };
      
      onScheduled(booking);
      setStep('confirmation');
      setIsSubmitting(false);
      
      // Close modal after showing confirmation
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    }, 1000);
  };

  const resetForm = () => {
    setStep('date');
    setSelectedDate(undefined);
    setSelectedTime('');
    setContactDetails({
      name: 'John Doe',
      phone: '+91 98765 43210',
      alternatePhone: '',
      specialRequests: ''
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Schedule Test Drive</DialogTitle>
        </DialogHeader>

        {/* Car Info Header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
              <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{car.title}</h3>
              <p className="text-xs text-gray-600">₹{car.price.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {car.seller.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{car.seller.name}</span>
              {car.seller.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{car.seller.rating}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{car.location}</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'date' && (
          <div>
            <h4 className="font-semibold mb-3">Select Date</h4>
            <div className="grid grid-cols-1 gap-2">
              {getNextSevenDays().map((date, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleDateSelect(date)}
                  className="justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{formatDate(date)}</div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 'time' && selectedDate && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Select Time</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('date')}
                className="text-xs"
              >
                Change Date
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{formatDate(selectedDate)}</p>
            
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={slot.available ? "outline" : "secondary"}
                  disabled={!slot.available}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  className="h-12"
                >
                  <div className="text-center">
                    <div className="font-medium text-sm">{slot.time}</div>
                    <div className="text-xs text-gray-500">
                      {slot.available ? 'Available' : 'Booked'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 'details' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Contact Details</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('time')}
                className="text-xs"
              >
                Change Time
              </Button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{selectedDate && formatDate(selectedDate)} at {selectedTime}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={contactDetails.name}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={contactDetails.phone}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="altPhone">Alternate Number (Optional)</Label>
                <Input
                  id="altPhone"
                  value={contactDetails.alternatePhone}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, alternatePhone: e.target.value }))}
                  placeholder="Backup contact number"
                />
              </div>

              <div>
                <Label htmlFor="requests">Special Requests (Optional)</Label>
                <Textarea
                  id="requests"
                  value={contactDetails.specialRequests}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Any specific requirements or questions..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setStep('time')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Booking...' : 'Request Test Drive'}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Test Drive Requested!</h3>
            <p className="text-gray-600 mb-4">
              Your request has been sent to {car.seller.name}. They will contact you to confirm the details.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <div className="font-medium mb-2">Booking Details:</div>
              <div>📅 {selectedDate && formatDate(selectedDate)}</div>
              <div>🕐 {selectedTime}</div>
              <div>📞 {contactDetails.phone}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TestDriveModal;
