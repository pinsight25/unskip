import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Chats from './Chats';
import ChatDetail from './ChatDetail';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatPage = () => {
  const isMobile = useIsMobile();
  const { chatId } = useParams();
  const navigate = useNavigate();

  if (isMobile) {
    if (chatId) {
      return <ChatDetail onBack={() => navigate('/chats')} />;
    }
    return <Chats onBack={() => navigate('/')} />;
  }

  // Desktop: split view
  return (
    <div className="w-full h-screen flex bg-gray-100">
      <aside className="flex flex-col w-[380px] max-w-[400px] border-r border-gray-200 bg-white h-full overflow-y-auto">
        <Chats />
      </aside>
      <main className="flex-1 flex flex-col h-full">
        {chatId ? <ChatDetail /> : <Outlet />}
      </main>
    </div>
  );
};

export default ChatPage; 