import { Outlet } from 'react-router-dom';
import Chats from './Chats';

const ChatPage = () => {
  return (
    <div className="w-full h-screen flex bg-gray-100">
      <aside className="flex flex-col w-[380px] max-w-[400px] border-r border-gray-200 bg-white h-full overflow-y-auto">
        <Chats />
      </aside>
      <main className="flex-1 flex flex-col h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatPage; 