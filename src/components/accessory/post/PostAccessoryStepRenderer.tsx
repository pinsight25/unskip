
import { AccessoryFormData } from '@/hooks/useAccessoryForm';
import BasicInformationStep from './BasicInformationStep';
import DetailsCompatibilityStep from './DetailsCompatibilityStep';
import PhotosContactStep from './PhotosContactStep';
import { updateFormField } from '@/utils/formHelpers';

interface PostAccessoryStepRendererProps {
  currentStep: number;
  formData: AccessoryFormData;
  onUpdate: (updates: Partial<AccessoryFormData>) => void;
  onPhoneVerification: () => void;
}

const PostAccessoryStepRenderer = ({
  currentStep,
  formData,
  onUpdate,
  onPhoneVerification
}: PostAccessoryStepRendererProps) => {
  switch (currentStep) {
    case 1:
      return (
        <BasicInformationStep
          formData={formData}
          onUpdate={(field, value) => onUpdate(updateFormField(formData, field, value))}
        />
      );
    case 2:
      return (
        <DetailsCompatibilityStep
          formData={formData}
          onUpdate={(field, value) => onUpdate(updateFormField(formData, field, value))}
        />
      );
    case 3:
      return (
        <PhotosContactStep
          formData={formData}
          onUpdate={onUpdate}
          onPhoneVerification={onPhoneVerification}
        />
      );
    default:
      return null;
  }
};

export default PostAccessoryStepRenderer;
