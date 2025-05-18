import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      'app.name': 'Life Guard',
      'app.tagline': 'Real-time Health Monitoring',
      
      // Navigation
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.devices': 'Devices',
      'nav.reports': 'Reports',
      'nav.settings': 'Settings',
      'nav.login': 'Login',
      'nav.signup': 'Sign Up',
      'nav.logout': 'Logout',
      
      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.welcome': 'Welcome to Life Guard',
      'dashboard.summary': 'Health Summary',
      
      // Settings
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.notifications': 'Notifications',
      'settings.profile': 'Profile',
      
      // Auth
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.login': 'Login',
      'auth.signup': 'Sign Up',
      'auth.forgotPassword': 'Forgot Password?',
    }
  },
  ar: {
    translation: {
      // Common
      'app.name': 'لايف جارد',
      'app.tagline': 'مراقبة صحية في الوقت الحقيقي',
      
      // Navigation
      'nav.home': 'الرئيسية',
      'nav.dashboard': 'لوحة التحكم',
      'nav.devices': 'الأجهزة',
      'nav.reports': 'التقارير',
      'nav.settings': 'الإعدادات',
      'nav.login': 'تسجيل الدخول',
      'nav.signup': 'إنشاء حساب',
      'nav.logout': 'تسجيل الخروج',
      
      // Dashboard
      'dashboard.title': 'لوحة التحكم',
      'dashboard.welcome': 'مرحبًا بك في لايف جارد',
      'dashboard.summary': 'ملخص الصحة',
      
      // Settings
      'settings.language': 'اللغة',
      'settings.theme': 'المظهر',
      'settings.notifications': 'الإشعارات',
      'settings.profile': 'الملف الشخصي',
      
      // Auth
      'auth.email': 'البريد الإلكتروني',
      'auth.password': 'كلمة المرور',
      'auth.login': 'تسجيل الدخول',
      'auth.signup': 'إنشاء حساب',
      'auth.forgotPassword': 'نسيت كلمة المرور؟',
    }
  },
  fr: {
    translation: {
      // Common
      'app.name': 'Life Guard',
      'app.tagline': 'Surveillance de santé en temps réel',
      
      // Navigation
      'nav.home': 'Accueil',
      'nav.dashboard': 'Tableau de bord',
      'nav.devices': 'Appareils',
      'nav.reports': 'Rapports',
      'nav.settings': 'Paramètres',
      'nav.login': 'Connexion',
      'nav.signup': 'Inscription',
      'nav.logout': 'Déconnexion',
      
      // Dashboard
      'dashboard.title': 'Tableau de bord',
      'dashboard.welcome': 'Bienvenue sur Life Guard',
      'dashboard.summary': 'Résumé de santé',
      
      // Settings
      'settings.language': 'Langue',
      'settings.theme': 'Thème',
      'settings.notifications': 'Notifications',
      'settings.profile': 'Profil',
      
      // Auth
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.login': 'Connexion',
      'auth.signup': 'Inscription',
      'auth.forgotPassword': 'Mot de passe oublié?',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    }
  });

export default i18n;