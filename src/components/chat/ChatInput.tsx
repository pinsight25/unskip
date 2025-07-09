
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Calendar } from 'lucide-react';
import { quickReplies } from '@/data/chatMockData';

interface ChatInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onQuickReply: (text: string) => void;
  onTestDrive: () => void;
}

const ChatInput = ({ 
  newMessage, 
  onMessageChange, 
  onSendMessage, 
  onQuickReply, 
  onTestDrive 
}: ChatInputProps) => {
  return (
    <div className="bg-white border-t border-gray-200 flex-shrink-0 shadow-sm">
      {/* Quick Replies */}
      <div className="p-3 bg-gray-50/50 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 max-w-3xl mx-auto">
          {quickReplies.map((reply) => (
            <Button
              key={reply.id}
              variant="outline"
              size="sm"
              onClick={() => onQuickReply(reply.text)}
              className="whitespace-nowrap text-xs flex-shrink-0 h-8 bg-white hover:bg-gray-50 border-gray-200"
            >
              {reply.text}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onTestDrive}
            className="whitespace-nowrap text-xs flex-shrink-0 h-8 bg-white hover:bg-gray-50 border-gray-200"
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
              className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
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
    </div>
  );
};

export default ChatInput;
