import React from 'react';

const EmptyChatState = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-full">
    <div className="text-center p-8">
      <img
        src="/logo.svg"
        className="w-24 h-24 mx-auto mb-6"
        alt="Unskip Logo"
        onError={e => { (e.currentTarget as HTMLImageElement).src = '/favicon.ico'; }}
      />
      <h2 className="text-2xl font-semibold mb-4">Welcome to Unskip Chat</h2>
      <p className="text-gray-600 mb-6">
        Connect with car sellers and buyers instantly
      </p>
      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 text-left">
          <svg className="text-green-500 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>Real-time messaging</span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <svg className="text-green-500 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.306.835 2.417 2 2.83V17h2v-3.17c1.165-.413 2-1.524 2-2.83z" /></svg>
          <span>Secure conversations</span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <svg className="text-green-500 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2l.4 2M7 13h10l1.4-4H6.6M5 6h14l1 2H4l1-2zm2 13a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
          <span>Direct car inquiries</span>
        </div>
      </div>
    </div>
  </div>
);

export default EmptyChatState; 