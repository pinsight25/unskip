
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Calendar } from 'lucide-react';

interface ChatInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onQuickReply: (text: string) => void;
  onTestDrive: () => void;
  isBuyer: boolean;
}

const ChatInput = ({ 
  newMessage, 
  onMessageChange, 
  onSendMessage, 
  onQuickReply, 
  onTestDrive,
  isBuyer
}: ChatInputProps) => {
  const quickReplies = isBuyer ? [
    "Is this still available?",
    "What's your best price?",
    "Can I schedule a test drive?",
    "Are all documents complete?"
  ] : [
    "Yes, it's available",
    "Price is negotiable",
    "You can test drive this weekend",
    "All documents are ready"
  ];
  return (
    <div className="bg-white border-t border-gray-200 flex-shrink-0 shadow-sm fixed bottom-16 left-0 right-0 z-20 md:static md:bottom-0" style={{paddingBottom:'env(safe-area-inset-bottom,16px)'}}>
      {/* Quick Replies */}
      <div className="p-3 bg-gray-50/50 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 max-w-3xl mx-auto">
          {quickReplies.map((text, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => onQuickReply(text)}
              className="whitespace-nowrap text-xs flex-shrink-0 h-10 min-h-[44px] bg-white hover:bg-gray-50 border-gray-200"
              style={{minHeight:44}}
            >
              {text}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onTestDrive}
            className="whitespace-nowrap text-xs flex-shrink-0 h-10 min-h-[44px] bg-white hover:bg-gray-50 border-gray-200"
            style={{minHeight:44}}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Test Drive
          </Button>
        </div>
      </div>
      {/* Message Input */}
      <div className="p-4 pb-6 md:pb-4 bg-white">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="flex-1 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
              className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary h-12 min-h-[44px] text-base"
              style={{minHeight:44}}
            />
            <Button 
              onClick={onSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="px-5 flex-shrink-0 rounded-full h-12 min-h-[44px] bg-green-500 hover:bg-green-600 text-white"
              style={{minHeight:44}}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
