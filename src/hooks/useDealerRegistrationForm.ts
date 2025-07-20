import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { updateFormField } from '@/utils/formHelpers';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/utils/uploadHelpers';

const STORAGE_KEY = 'dealerRegistrationFormData';

export interface DealerFormData {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessCategory: string;
  brandsDealWith: string[];
  specialization: string;
  shopAddress: string;
  pincode: string;
  establishmentYear: string;
  about: string; // New field
  panNumber: string;
  aadhaarNumber: string;
  businessDocType: 'gst_certificate' | 'msme_certificate' | 'shop_license' | 'trade_license' | 'other';
  businessDocNumber: string;
  documents: {
    businessDocument: File | null;
    panCard: File | null;
    shopLicense: File | null;
    shopPhotos: File[];
  };
  agreeToTerms: boolean;
}

export const useDealerRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormDataState] = useState<DealerFormData>(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Files cannot be persisted, so reset them
        if (parsed.documents) {
          parsed.documents.businessDocument = null;
          parsed.documents.panCard = null;
          parsed.documents.shopLicense = null;
          parsed.documents.shopPhotos = [];
        }
        return parsed;
      } catch (e) {
        return {
          businessName: '',
          contactPerson: '',
          phone: '',
          email: '',
          businessCategory: '',
          brandsDealWith: [],
          specialization: '',
          shopAddress: '',
          pincode: '',
          establishmentYear: '',
          about: '',
          panNumber: '',
          aadhaarNumber: '',
          businessDocType: 'gst_certificate',
          businessDocNumber: '',
          documents: {
            businessDocument: null,
            panCard: null,
            shopLicense: null,
            shopPhotos: [],
          },
          agreeToTerms: false,
        };
      }
    }
    return {
      businessName: '',
      contactPerson: '',
      phone: '',
      email: '',
      businessCategory: '',
      brandsDealWith: [],
      specialization: '',
      shopAddress: '',
      pincode: '',
      establishmentYear: '',
      about: '',
      panNumber: '',
      aadhaarNumber: '',
      businessDocType: 'gst_certificate',
      businessDocNumber: '',
      documents: {
        businessDocument: null,
        panCard: null,
        shopLicense: null,
        shopPhotos: [],
      },
      agreeToTerms: false,
    };
  });

  // Save to localStorage on every change (except files)
  useEffect(() => {
    const { documents, ...rest } = formData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, documents: { ...documents, businessDocument: null, panCard: null, shopLicense: null, shopPhotos: [] } }));
  }, [formData]);

  // Helper to update form data and persist
  const setFormData = (updater: (prev: DealerFormData) => DealerFormData) => {
    setFormDataState(prev => {
      const updated = updater(prev);
      // Save to localStorage (except files)
      const { documents, ...rest } = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, documents: { ...documents, businessDocument: null, panCard: null, shopLicense: null, shopPhotos: [] } }));
      return updated;
    });
  };

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const businessNameRef = useRef<HTMLInputElement>(null);
  const contactPersonRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const businessCategoryRef = useRef<HTMLDivElement>(null);
  const specializationRef = useRef<HTMLDivElement>(null);
  const brandsDealWithRef = useRef<HTMLDivElement>(null);
  const shopAddressRef = useRef<HTMLInputElement>(null);
  const pincodeRef = useRef<HTMLInputElement>(null);
  const establishmentYearRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const gstCertRef = useRef<HTMLInputElement>(null);
  const shopLicenseRef = useRef<HTMLInputElement>(null);
  const shopPhotosRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Generate dealer slug from business name
  const generateDealerSlug = (businessName: string) => {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const validateGST = (gst: string) => {
    if (!gst || gst.length === 0) return false;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const handleInputChange = (field: keyof DealerFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'shopPhotos') {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: Array.from(files),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: files[0],
        },
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.businessName) errors.businessName = 'Business name is required';
    if (!formData.contactPerson) errors.contactPerson = 'Contact person is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.businessCategory) errors.businessCategory = 'Business category is required';
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (!formData.brandsDealWith || formData.brandsDealWith.length === 0) errors.brandsDealWith = 'Select at least one brand';
    if (!formData.about) errors.about = 'About is required';
    if (!formData.documents.businessDocument) errors.businessDocument = 'Business document is required';
    if (!formData.documents.panCard) errors.panCard = 'PAN card is required';
    if (!formData.documents.shopPhotos || formData.documents.shopPhotos.length === 0) errors.shopPhotos = 'At least one shop photo is required';
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms';
    setFieldErrors(errors);
    // Focus the first invalid field
    if (errors.businessName) businessNameRef.current?.focus();
    else if (errors.contactPerson) contactPersonRef.current?.focus();
    else if (errors.phone) phoneRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.businessCategory) businessCategoryRef.current?.focus();
    else if (errors.specialization) specializationRef.current?.focus();
    else if (errors.brandsDealWith) brandsDealWithRef.current?.focus();
    else if (errors.about) aboutRef.current?.focus();
    else if (errors.businessDocument) gstCertRef.current?.focus();
    else if (errors.panCard) shopLicenseRef.current?.focus();
    else if (errors.shopPhotos) shopPhotosRef.current?.focus();
    else if (errors.agreeToTerms) termsRef.current?.focus();
    return Object.keys(errors).length === 0;
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.businessName) errors.businessName = 'Business name is required';
      if (!formData.contactPerson) errors.contactPerson = 'Contact person is required';
      if (!formData.phone) errors.phone = 'Phone number is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.businessCategory) errors.businessCategory = 'Business category is required';
      if (!formData.specialization) errors.specialization = 'Specialization is required';
      if (!formData.brandsDealWith || formData.brandsDealWith.length === 0) errors.brandsDealWith = 'Select at least one brand';
      if (!formData.about || formData.about.trim().length === 0) errors.about = 'About is required';
    } else if (currentStep === 2) {
      if (!formData.panNumber || !formData.panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) errors.panNumber = 'Valid PAN number is required';
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) errors.aadhaarNumber = 'Valid 12-digit Aadhaar number is required';
      if (!formData.businessDocType) errors.businessDocType = 'Business document type is required';
      if (!formData.businessDocNumber) errors.businessDocNumber = 'Business document number is required';
      if (!formData.shopAddress) errors.shopAddress = 'Shop address is required';
      if (!formData.pincode) errors.pincode = 'Pincode is required';
      if (!formData.establishmentYear) errors.establishmentYear = 'Establishment year is required';
    } else if (currentStep === 3) {
      if (!formData.documents.businessDocument) errors.businessDocument = 'Business document is required';
      if (!formData.documents.panCard) errors.panCard = 'PAN card is required';
      if (!formData.documents.shopPhotos || formData.documents.shopPhotos.length < 1) errors.shopPhotos = 'At least one shop photo is required';
      if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Get specific missing fields for better error message
      const missingFields = [];
      if (currentStep === 1) {
        if (!formData.businessName) missingFields.push('Business Name');
        if (!formData.contactPerson) missingFields.push('Contact Person');
        if (!formData.phone) missingFields.push('Phone Number');
        if (!formData.email) missingFields.push('Email Address');
        if (!formData.businessCategory) missingFields.push('Business Category');
        if (!formData.specialization) missingFields.push('Specialization');
        if (!formData.brandsDealWith || formData.brandsDealWith.length === 0) missingFields.push('Brands Dealt With');
        if (!formData.about || formData.about.trim().length === 0) missingFields.push('About Your Dealership');
      } else if (currentStep === 2) {
        if (!formData.panNumber) missingFields.push('PAN Number');
        if (!formData.aadhaarNumber) missingFields.push('Aadhaar Number');
        if (!formData.businessDocType) missingFields.push('Business Document Type');
        if (!formData.businessDocNumber) missingFields.push('Business Document Number');
        if (!formData.shopAddress) missingFields.push('Shop Address');
        if (!formData.pincode) missingFields.push('Pincode');
        if (!formData.establishmentYear) missingFields.push('Establishment Year');
      } else if (currentStep === 3) {
        if (!formData.documents.businessDocument) missingFields.push('Business Document');
        if (!formData.documents.panCard) missingFields.push('PAN Card');
        if (!formData.documents.shopPhotos || formData.documents.shopPhotos.length === 0) missingFields.push('Shop Photos');
        if (!formData.agreeToTerms) missingFields.push('Terms Agreement');
      }

      const missingFieldsText = missingFields.join(', ');
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFieldsText}`,
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register as a dealer.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if dealer already exists for this user
      const { data: existing } = await supabase
        .from('dealers')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();
      if (existing) {
        setErrorMessage('You have already registered as a dealer.');
        setIsSubmitting(false);
        return;
      }

      // Generate slug from business name
      const slug = formData.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Upload documents to Cloudinary
      const businessDocUrl = await uploadToCloudinary(formData.documents.businessDocument!, 'unskip/dealers/documents');
      const panCardUrl = await uploadToCloudinary(formData.documents.panCard!, 'unskip/dealers/documents');
      const shopPhotosUrls = await uploadMultipleToCloudinary(formData.documents.shopPhotos, 'unskip/dealers/photos');

      // Insert into dealers table
      const dealerData = {
        user_id: user?.id,
        slug: slug,
        business_name: formData.businessName,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        business_category: formData.businessCategory,
        specialization: formData.specialization,
        brands_deal_with: formData.brandsDealWith,
        shop_address: formData.shopAddress,
        pincode: formData.pincode,
        establishment_year: formData.establishmentYear ? Number(formData.establishmentYear) : null,
        about: formData.about,
        pan_number: formData.panNumber,
        aadhaar_last_four: formData.aadhaarNumber.slice(-4),
        business_doc_type: formData.businessDocType,
        business_doc_number: formData.businessDocNumber,
        business_doc_url: businessDocUrl,
        pan_card_url: panCardUrl,
        shop_photos_urls: shopPhotosUrls,
        verification_status: 'pending' as 'pending',
        verified: false
      };

      const { data: dealer, error } = await supabase
        .from('dealers')
        .insert([dealerData])
        .select()
        .single();
      if (error) {
        alert(JSON.stringify(error, null, 2));
      }
      if (error) throw error;

      // Update user as dealer
      await supabase
        .from('users')
        .update({ user_type: 'dealer' })
        .eq('id', user.id);

      toast({
        title: "Registration successful!",
        description: "Your dealer profile has been created and is pending verification. You can start posting cars immediately.",
      });

      // Clear saved form data
      localStorage.removeItem(STORAGE_KEY);

      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      if (error?.code === '23505' || (error?.message && error.message.includes('unique_user_dealer'))) {
        toast({
          title: 'Dealer profile already exists',
          description: 'You already have a dealer profile. Only one dealer profile is allowed per user.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: "Registration failed",
          description: error?.message || 'Failed to register. Please try again.',
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    totalSteps,
    progress,
    formData,
    isSubmitting,
    validateGST,
    handleInputChange,
    handleFileUpload,
    validateForm,
    nextStep,
    prevStep,
    handleSubmit,
    setFormData,
    errorMessage,
    businessNameRef,
    contactPersonRef,
    phoneRef,
    emailRef,
    businessCategoryRef,
    specializationRef,
    brandsDealWithRef,
    shopAddressRef,
    pincodeRef,
    establishmentYearRef,
    aboutRef,
    gstCertRef,
    shopLicenseRef,
    shopPhotosRef,
    termsRef,
    fieldErrors,
  };
};
