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
      'nav.about': 'About',
      'nav.arduino': 'Arduino',
      'nav.download': 'Download',
      'nav.contact': 'Contact',
      
      // Home page
      'home.title': 'Your Health',
      'home.subtitle': 'Monitored in',
      'home.realtime': 'Real-Time',
      'home.description': 'Life Guard provides continuous monitoring of your vital health metrics, giving you peace of mind and valuable insights.',
      'home.getStarted': 'Get Started',
      'home.learnMore': 'Learn More',
      'home.howItWorks': 'How Life Guard Works',
      'home.readyToMonitor': 'Ready to monitor your health?',
      'home.joinUsers': 'Join thousands of users who are taking control of their health with Life Guard\'s real-time monitoring solution.',
      
      // Vitals
      'vitals.heartRate': 'Heart Rate',
      'vitals.bpm': 'Beats per minute',
      'vitals.temperature': 'Temperature',
      'vitals.bodyTemp': 'Body temperature',
      'vitals.bloodOxygen': 'Blood Oxygen',
      'vitals.spo2': 'SpO2 Saturation',
      
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
      'nav.about': 'حول',
      'nav.arduino': 'أردوينو',
      'nav.download': 'تحميل',
      'nav.contact': 'اتصل بنا',
      
      // Home page
      'home.title': 'صحتك',
      'home.subtitle': 'تحت المراقبة',
      'home.realtime': 'في الوقت الحقيقي',
      'home.description': 'يوفر لايف جارد مراقبة مستمرة لمؤشراتك الصحية الحيوية، مما يمنحك راحة البال ورؤى قيمة.',
      'home.getStarted': 'ابدأ الآن',
      'home.learnMore': 'اعرف المزيد',
      'home.howItWorks': 'كيف يعمل لايف جارد',
      'home.readyToMonitor': 'هل أنت مستعد لمراقبة صحتك؟',
      'home.joinUsers': 'انضم إلى آلاف المستخدمين الذين يتحكمون في صحتهم مع حل المراقبة في الوقت الحقيقي من لايف جارد.',
      
      // Vitals
      'vitals.heartRate': 'معدل ضربات القلب',
      'vitals.bpm': 'نبضة في الدقيقة',
      'vitals.temperature': 'درجة الحرارة',
      'vitals.bodyTemp': 'حرارة الجسم',
      'vitals.bloodOxygen': 'أكسجين الدم',
      'vitals.spo2': 'تشبع الأكسجين',

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
      'nav.about': 'À propos',
      'nav.arduino': 'Arduino',
      'nav.download': 'Télécharger',
      'nav.contact': 'Contact',
      
      // Home page
      'home.title': 'Votre Santé',
      'home.subtitle': 'Surveillée en',
      'home.realtime': 'Temps Réel',
      'home.description': 'Life Guard fournit une surveillance continue de vos indicateurs de santé vitaux, vous donnant tranquillité d\'esprit et des informations précieuses.',
      'home.getStarted': 'Commencer',
      'home.learnMore': 'En savoir plus',
      'home.howItWorks': 'Comment fonctionne Life Guard',
      'home.readyToMonitor': 'Prêt à surveiller votre santé?',
      'home.joinUsers': 'Rejoignez des milliers d\'utilisateurs qui prennent le contrôle de leur santé avec la solution de surveillance en temps réel de Life Guard.',
      
      // Vitals
      'vitals.heartRate': 'Fréquence Cardiaque',
      'vitals.bpm': 'Battements par minute',
      'vitals.temperature': 'Température',
      'vitals.bodyTemp': 'Température corporelle',
      'vitals.bloodOxygen': 'Oxygène Sanguin',
      'vitals.spo2': 'Saturation SpO2',
            
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
      
      // Download page
      'download.title': 'Télécharger Life Guard',
      'download.subtitle': 'Accédez à vos données de santé n\'importe quand, n\'importe où avec notre application mobile.',
      'download.button': 'Télécharger l\'application Android',
      'download.starting': 'Téléchargement en cours...',
      'download.version': 'Dernière version: 1.2.3 | Publiée le: 15 mai 2023',
      'download.mobileApp': 'Application Mobile',
      'download.mobileDesc': 'Notre application Android offre une expérience optimisée pour les smartphones.',
      'download.tabletVersion': 'Version Tablette',
      'download.tabletDesc': 'Notre interface tablette fournit des visualisations étendues et une saisie de données plus facile.',
      'download.webApp': 'Application Web',
      'download.webDesc': 'Utilisez notre application web progressive pour une expérience complète sur n\'importe quel appareil.',
      'download.whyDownload': 'Pourquoi télécharger notre application?',
      'download.features': 'Fonctionnalités:',
      'download.requirements': 'Prérequis:',
      'download.feature1': 'Surveillance de santé en temps réel',
      'download.feature2': 'Alertes et notifications personnalisables',
      'download.feature3': 'Visualisation des données historiques',
      'download.feature4': 'Tendances et insights de santé',
      'download.feature5': 'Chiffrement sécurisé des données',
      'download.req1': 'Android 7.0 ou supérieur',
      'download.req2': 'Au moins 50MB d\'espace de stockage',
      'download.req3': 'Connexion internet pour la synchronisation des données',
      'download.req4': 'GPS pour les services de localisation d\'urgence (optionnel)',
      'download.useWebApp': 'Utiliser l\'application Web'
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