
import { Textarea } from '@/components/ui/textarea';

interface MessageSectionProps {
  message: string;
  onMessageChange: (value: string) => void;
}

const MessageSection = ({ message, onMessageChange }: MessageSectionProps) => {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block text-gray-700">Message (Optional)</label>
      <Textarea
        placeholder="Add a personal message to the seller..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        rows={3}
        className="border-2 rounded-xl"
      />
    </div>
  );
};

export default MessageSection;
