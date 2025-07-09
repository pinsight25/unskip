
import { useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

const ChatMessages = ({ messages, isTyping }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4 space-y-4 min-h-full max-w-3xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 'buyer1' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.senderId === 'buyer1' ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  message.senderId === 'buyer1'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white border border-gray-100 rounded-bl-md'
                } ${message.type === 'test_drive' ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
              >
                {message.type === 'test_drive' && (
                  <Calendar className="h-4 w-4 inline mr-2" />
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">
                {formatTime(message.timestamp)}
                {message.senderId === 'buyer1' && (
                  <span className="ml-1 text-gray-400">{message.seen ? '✓✓' : '✓'}</span>
                )}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm max-w-[75%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
