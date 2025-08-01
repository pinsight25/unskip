import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { performanceMonitor } from './utils/performance.ts'
import { debugChatIssues } from './utils/chatDebug.ts'

// Initialize performance monitoring
performanceMonitor;

// Add chat debug to window for testing
if (typeof window !== 'undefined') {
  (window as any).debugChatIssues = debugChatIssues;
}



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
