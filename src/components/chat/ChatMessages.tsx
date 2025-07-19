
import { useRef, useEffect } from 'react';
import { Calendar, MessageCircle, Check } from 'lucide-react';

interface ChatMessagesProps {
  messages: any[];
  isTyping: boolean;
  user: any;
  otherUser: any;
}

const ChatMessages = ({ messages, isTyping, user, otherUser }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 border-t border-b border-gray-200">
      <div className="p-4 space-y-4 min-h-[300px] md:min-h-[400px] max-w-3xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="bg-white rounded-full p-4 mb-4 shadow-sm">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-500 max-w-sm">
              Send a message to the seller about this car. Ask questions, negotiate price, or schedule a test drive.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isSeller = message.senderId === user?.id;
              const senderName = isSeller ? user?.name : otherUser?.name;
              return (
                <div key={message.id} className={`flex ${isSeller ? 'justify-end' : 'justify-start'} w-full`}>
                  <div className={`max-w-[75%] ${isSeller ? 'order-2' : 'order-1'}`}>
                    {/* Sender Name */}
                    <div className="text-xs text-gray-500 mb-1 ml-2">{senderName}</div>
                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-2 shadow-sm ${
                        isSeller
                          ? 'bg-green-500 text-white rounded-br-md'
                          : 'bg-white border border-gray-100 rounded-bl-md text-gray-900'
                      } relative`}
                    >
                      {message.type === 'test_drive' && (
                        <Calendar className="h-4 w-4 inline mr-2" />
                      )}
                      <span className="text-sm leading-relaxed break-words block">{message.content}</span>
                    </div>
                    {/* Time and Checkmarks */}
                    <div className={`flex items-center gap-1 mt-1 px-2 ${isSeller ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                      {isSeller && (
                        <span className="ml-1 text-gray-200">
                          {message.seen ? <><Check className="inline w-4 h-4 text-white" /> <Check className="inline w-4 h-4 text-white -ml-2" /></> : <Check className="inline w-4 h-4 text-white" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Typing indicator */}
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
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
