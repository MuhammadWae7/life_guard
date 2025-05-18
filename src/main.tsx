import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n';
import i18n from './lib/i18n';

// Set initial language from localStorage if available
const savedLanguage = localStorage.getItem('language');
if (savedLanguage && ['en', 'ar', 'fr'].includes(savedLanguage)) {
  i18n.changeLanguage(savedLanguage);
  // Set RTL for Arabic
  document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
}

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
