
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      about: 'About',
      arduino: 'Arduino',
      download: 'Download',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      logout: 'Logout',
      
      // Common
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      install: 'Install App',
      
      // Home Page
      heroTitle: 'Life Guard',
      heroSubtitle: 'Real-Time Vital Signs Monitoring',
      heroDescription: 'Professional health monitoring using Arduino devices for real-time temperature, heart rate, and SpO2 tracking.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      
      // Features
      features: 'Features',
      realTimeMonitoring: 'Real-Time Monitoring',
      realTimeDesc: 'Continuous vital signs tracking with instant updates',
      secureData: 'Secure Data',
      secureDataDesc: 'End-to-end encryption and secure data storage',
      multiDevice: 'Arduino Integration',
      multiDeviceDesc: 'Professional-grade Arduino sensor integration',
      
      // Dashboard
      vitals: 'Vital Signs',
      temperature: 'Temperature',
      heartRate: 'Heart Rate',
      spo2: 'SpO2',
      lastReading: 'Last Reading',
      noData: 'No data available',
      connecting: 'Connecting...',
      
      // Auth
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      
      // About
      ourTeam: 'Our Team',
      teamDesc: 'Meet the dedicated professionals behind Life Guard',
      
      // Arduino
      arduinoTitle: 'Arduino Components',
      arduinoDesc: 'Required components for your Life Guard monitoring device',
      
      // Download
      downloadTitle: 'Download App',
      downloadDesc: 'Get the Life Guard mobile application',
      androidApp: 'Android App',
      
      // Contact
      contactTitle: 'Contact Us',
      contactDesc: 'Get in touch with our team',
      sendMessage: 'Send Message',
      message: 'Message',
      
      // Units
      celsius: '°C',
      fahrenheit: '°F',
      bpm: 'BPM',
      percent: '%'
    }
  },
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      about: 'حول',
      arduino: 'أردوينو',
      download: 'تحميل',
      contact: 'اتصال',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      dashboard: 'لوحة التحكم',
      logout: 'تسجيل الخروج',
      
      // Common
      language: 'اللغة',
      darkMode: 'الوضع المظلم',
      lightMode: 'الوضع المضيء',
      install: 'تثبيت التطبيق',
      
      // Home Page
      heroTitle: 'لايف جارد',
      heroSubtitle: 'مراقبة العلامات الحيوية في الوقت الفعلي',
      heroDescription: 'مراقبة صحية احترافية باستخدام أجهزة الأردوينو لتتبع درجة الحرارة ومعدل ضربات القلب ومستوى الأكسجين في الوقت الفعلي.',
      getStarted: 'ابدأ الآن',
      learnMore: 'اعرف المزيد',
      
      // Features
      features: 'المميزات',
      realTimeMonitoring: 'المراقبة في الوقت الفعلي',
      realTimeDesc: 'تتبع مستمر للعلامات الحيوية مع التحديثات الفورية',
      secureData: 'البيانات الآمنة',
      secureDataDesc: 'تشفير شامل وتخزين آمن للبيانات',
      multiDevice: 'تكامل الأردوينو',
      multiDeviceDesc: 'تكامل احترافي مع أجهزة استشعار الأردوينو',
      
      // Dashboard
      vitals: 'العلامات الحيوية',
      temperature: 'درجة الحرارة',
      heartRate: 'معدل ضربات القلب',
      spo2: 'مستوى الأكسجين',
      lastReading: 'آخر قراءة',
      noData: 'لا توجد بيانات متاحة',
      connecting: 'جاري الاتصال...',
      
      // Auth
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      dontHaveAccount: 'ليس لديك حساب؟',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      
      // About
      ourTeam: 'فريقنا',
      teamDesc: 'تعرف على المهنيين المتفانين وراء لايف جارد',
      
      // Arduino
      arduinoTitle: 'مكونات الأردوينو',
      arduinoDesc: 'المكونات المطلوبة لجهاز مراقبة لايف جارد الخاص بك',
      
      // Download
      downloadTitle: 'تحميل التطبيق',
      downloadDesc: 'احصل على تطبيق لايف جارد للهاتف المحمول',
      androidApp: 'تطبيق أندرويد',
      
      // Contact
      contactTitle: 'اتصل بنا',
      contactDesc: 'تواصل مع فريقنا',
      sendMessage: 'إرسال رسالة',
      message: 'الرسالة',
      
      // Units
      celsius: '°م',
      fahrenheit: '°ف',
      bpm: 'نبضة/د',
      percent: '%'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
