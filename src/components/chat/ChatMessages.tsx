
import { useRef, useEffect } from 'react';
import { Calendar, MessageCircle, Check, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessagesProps {
  messages: any[];
  isTyping: boolean;
  user: any;
  otherUser: any;
  car?: any;
}

const ChatMessages = ({ messages, isTyping, user, otherUser, car }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesEnd = document.getElementById('messages-end');
    messagesEnd?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 border-t border-b border-gray-200 pt-16 pb-24 md:pt-0 md:pb-0 messages-container" style={{minHeight:'300px',maxHeight:'calc(100dvh - 56px - 96px)'}}>
      {/* MOBILE CHAT MESSAGES (block md:hidden) */}
      <div className="block md:hidden">
        <div className="p-4 space-y-0 max-w-3xl mx-auto">
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
              {(messages as any[]).map((message) => {
                const senderId = message.sender_id || message.senderId;
                const isOwnMessage = senderId === user?.id;
                const senderName = !isOwnMessage ? (otherUser?.name || 'Seller') : (user?.name || 'You');
                const time = message.created_at ? format(new Date(message.created_at), 'HH:mm') : '';
                return (
                  <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`max-w-[70%] flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      {/* Sender name - only for received messages */}
                      {!isOwnMessage && (
                        <div className="text-xs text-gray-600 mb-1 ml-2">{senderName}</div>
                      )}
                      {/* Message bubble */}
                      <div className={`rounded-lg px-4 py-2 ${isOwnMessage ? 'bg-green-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'} ${message.pending ? 'opacity-70' : ''} ${message.failed ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-1">
                          {message.content}
                          {message.pending && <Clock className="w-3 h-3 ml-1" />}
                          {message.failed && <AlertCircle className="w-3 h-3 ml-1 text-red-500" />}
                        </div>
                        {/* Time inside bubble (WhatsApp style) */}
                        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-green-100' : 'text-gray-500'} text-right`}>
                          {time}
                          {isOwnMessage && !message.pending && !message.failed && ' ✓✓'}
                        </div>
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
      {/* DESKTOP CHAT MESSAGES (md:block) */}
      <div className="hidden md:block">
        <div className="p-4 space-y-4 max-w-3xl mx-auto">
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
              {(messages as any[]).map((message) => {
                const senderId = message.sender_id || message.senderId;
                const isOwnMessage = senderId === user?.id;
                const senderName = !isOwnMessage ? (otherUser?.name || 'Seller') : (user?.name || 'You');
                const time = message.created_at ? format(new Date(message.created_at), 'HH:mm') : '';
                return (
                  <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`max-w-[70%] flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      {/* Sender name - only for received messages */}
                      {!isOwnMessage && (
                        <div className="text-xs text-gray-600 mb-1 ml-2">{senderName}</div>
                      )}
                      {/* Message bubble */}
                      <div className={`rounded-lg px-4 py-2 ${isOwnMessage ? 'bg-green-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'} ${message.pending ? 'opacity-70' : ''} ${message.failed ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-1">
                          {message.content}
                          {message.pending && <Clock className="w-3 h-3 ml-1" />}
                          {message.failed && <AlertCircle className="w-3 h-3 ml-1 text-red-500" />}
                        </div>
                        {/* Time inside bubble (WhatsApp style) */}
                        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-green-100' : 'text-gray-500'} text-right`}>
                          {time}
                          {isOwnMessage && !message.pending && !message.failed && ' ✓✓'}
                        </div>
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
      <div className="h-20" />
      <div id="messages-end" />
    </div>
  );
};

export default ChatMessages;