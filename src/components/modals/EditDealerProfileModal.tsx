import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/utils/uploadHelpers';
import { supabase } from '@/lib/supabase';

const availableBrands = [
  'Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra',
  'Kia', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Skoda',
  'Ford', 'Renault', 'Nissan', 'MG', 'Jeep', 'Citroen'
];

const EditDealerProfileModal = ({ isOpen, onClose, dealer, onSave }) => {
  const [formData, setFormData] = useState({
    businessName: dealer.business_name || '',
    contactPerson: dealer.contact_person || '',
    phone: dealer.phone || '',
    email: dealer.email || '',
    businessCategory: dealer.business_category || '',
    brandsDealWith: dealer.brands_deal_with || [],
    specialization: dealer.specialization || '',
    gstNumber: dealer.gst_number || '',
    shopAddress: dealer.shop_address || '',
    pincode: dealer.pincode || '',
    establishmentYear: dealer.establishment_year ? dealer.establishment_year.toString() : '',
    about: dealer.about || '',
    shopPhotos: [], // new uploads
    shopPhotosUrls: dealer.shop_photos_urls || [], // existing
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (files) => {
    if (!files) return;
    if (files.length > 3) {
      setError('You can upload up to 3 shop photos.');
      return;
    }
    setFormData(prev => ({ ...prev, shopPhotos: Array.from(files) }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      let shopPhotosUrls = formData.shopPhotosUrls;
      if (formData.shopPhotos.length > 0) {
        shopPhotosUrls = await uploadMultipleToCloudinary(formData.shopPhotos, 'unskip/dealers/photos');
      }
      const { error: updateError } = await supabase
        .from('dealers')
        .update({
          business_name: formData.businessName,
          contact_person: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
          business_category: formData.businessCategory,
          brands_deal_with: formData.brandsDealWith,
          specialization: formData.specialization,
          gst_number: formData.gstNumber,
          shop_address: formData.shopAddress,
          pincode: formData.pincode,
          establishment_year: parseInt(formData.establishmentYear),
          about: formData.about,
          shop_photos_urls: shopPhotosUrls,
        })
        .eq('id', dealer.id);
      if (updateError) throw updateError;
      onSave && onSave();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update dealer profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Dealer Profile</DialogTitle>
          <DialogDescription>Update your dealership details, photos, and about text.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Business Name *</label>
              <Input value={formData.businessName} onChange={e => setFormData(f => ({ ...f, businessName: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Contact Person *</label>
              <Input value={formData.contactPerson} onChange={e => setFormData(f => ({ ...f, contactPerson: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <Input value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Business Category *</label>
              <Select value={formData.businessCategory} onValueChange={v => setFormData(f => ({ ...f, businessCategory: v }))}>
                <SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-cars">New Cars Only</SelectItem>
                  <SelectItem value="used-cars">Used Cars Only</SelectItem>
                  <SelectItem value="new-used">New & Used Cars</SelectItem>
                  <SelectItem value="specialized">Specialized (Luxury/Vintage/Electric)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Specialization *</label>
              <Select value={formData.specialization} onValueChange={v => setFormData(f => ({ ...f, specialization: v }))}>
                <SelectTrigger><SelectValue placeholder="Select specialization" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-brands">All Brands</SelectItem>
                  <SelectItem value="luxury-cars">Luxury Cars</SelectItem>
                  <SelectItem value="budget-cars">Budget Cars</SelectItem>
                  <SelectItem value="electric">Electric Vehicles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Brands Dealt With *</label>
              <MultiSelect
                options={availableBrands}
                selected={formData.brandsDealWith}
                onChange={selected => setFormData(f => ({ ...f, brandsDealWith: selected }))}
                placeholder="Select brands (multiple allowed)"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Shop Address *</label>
              <Input value={formData.shopAddress} onChange={e => setFormData(f => ({ ...f, shopAddress: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Pincode *</label>
              <Input value={formData.pincode} onChange={e => setFormData(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '') }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Establishment Year *</label>
              <Input value={formData.establishmentYear} onChange={e => setFormData(f => ({ ...f, establishmentYear: e.target.value.replace(/\D/g, '') }))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">About (max 150 chars)</label>
            <textarea
              value={formData.about}
              onChange={e => setFormData(f => ({ ...f, about: e.target.value.slice(0, 150) }))}
              maxLength={150}
              rows={3}
              className="w-full border rounded p-2 text-sm"
            />
            <div className="text-xs text-gray-500 mt-1">{formData.about.length}/150 characters</div>
          </div>
          <div>
            <label className="text-sm font-medium">Shop Photos (up to 3)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={e => handleFileUpload(e.target.files)}
              className="block mt-2"
            />
            <div className="flex gap-2 mt-2">
              {formData.shopPhotosUrls.slice(0, 3).map((url, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <img src={url} alt={`Shop photo ${idx + 1}`} className="w-16 h-16 object-cover rounded border" />
                  {idx !== 0 && (
                    <Button size="xs" className="mt-1 text-xs px-2 py-1" variant="outline" onClick={() => {
                      // Move this photo to the first position
                      setFormData(f => {
                        const arr = [...f.shopPhotosUrls];
                        const [selected] = arr.splice(idx, 1);
                        arr.unshift(selected);
                        return { ...f, shopPhotosUrls: arr };
                      });
                    }}>Set as Cover</Button>
                  )}
                  {idx === 0 && <span className="text-xs text-primary mt-1">Cover</span>}
                </div>
              ))}
              {formData.shopPhotos.length > 0 && formData.shopPhotos.map((file, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="inline-block w-16 h-16 bg-gray-100 border rounded text-xs flex items-center justify-center overflow-hidden">
                    {file.name.length > 10 ? file.name.slice(0, 10) + '...' : file.name}
                  </span>
                  {formData.shopPhotosUrls.length === 0 && idx === 0 && <span className="text-xs text-primary mt-1">Cover</span>}
                </div>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 h-12" disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1 h-12">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDealerProfileModal; 