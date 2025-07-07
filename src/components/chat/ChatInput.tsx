
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Calendar } from 'lucide-react';
import { quickReplies } from '@/data/chatMockData';

interface ChatInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onQuickReply: (text: string) => void;
  onShowTestDrive: () => void;
}

const ChatInput = ({ 
  newMessage, 
  onMessageChange, 
  onSendMessage, 
  onQuickReply, 
  onShowTestDrive 
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 flex-shrink-0">
      {/* Quick Replies */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {quickReplies.map((reply) => (
            <Button
              key={reply.id}
              variant="outline"
              size="sm"
              onClick={() => onQuickReply(reply.text)}
              className="whitespace-nowrap text-xs flex-shrink-0 h-8"
            >
              {reply.text}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onShowTestDrive}
            className="whitespace-nowrap text-xs flex-shrink-0 h-8"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Test Drive
          </Button>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 pb-6 md:pb-4">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-full border-gray-300"
          />
          <Button 
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="px-4 flex-shrink-0 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
