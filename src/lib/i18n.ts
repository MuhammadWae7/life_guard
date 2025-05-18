import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      'app.name': 'Life Guard',
      'app.tagline': 'Real-time Health Monitoring',
      
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.arduino': 'Arduino',
      'nav.download': 'Download',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'nav.signup': 'Sign Up',
      
      // Contact page
      'contact.title': 'Contact Us',
      'contact.subtitle': 'Have questions about your health monitor? Send us a message.',
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.subject': 'Subject',
      'contact.message': 'Message',
      'contact.send': 'Send Message',
      'contact.response': 'We typically respond to inquiries within 24-48 hours.',
      'contact.name.placeholder': 'Your name',
      'contact.email.placeholder': 'name@example.com',
      'contact.subject.placeholder': 'How can we help?',
      'contact.message.placeholder': 'Your message...',
      
      // Language
      'language.changed': 'Language changed to English',
      'language.updated': 'The application language has been updated.',
    }
  },
  ar: {
    translation: {
      // Common
      'app.name': 'لايف جارد',
      'app.tagline': 'مراقبة الصحة في الوقت الحقيقي',
      
      // Navigation
      'nav.home': 'الرئيسية',
      'nav.about': 'حول',
      'nav.arduino': 'أردوينو',
      'nav.download': 'تحميل',
      'nav.contact': 'اتصل بنا',
      'nav.login': 'تسجيل الدخول',
      'nav.signup': 'إنشاء حساب',
      
      // Contact page
      'contact.title': 'اتصل بنا',
      'contact.subtitle': 'هل لديك أسئلة حول جهاز مراقبة صحتك؟ أرسل لنا رسالة.',
      'contact.name': 'الاسم',
      'contact.email': 'البريد الإلكتروني',
      'contact.subject': 'الموضوع',
      'contact.message': 'الرسالة',
      'contact.send': 'إرسال الرسالة',
      'contact.response': 'نحن عادة نرد على الاستفسارات في غضون 24-48 ساعة.',
      'contact.name.placeholder': 'اسمك',
      'contact.email.placeholder': 'name@example.com',
      'contact.subject.placeholder': 'كيف يمكننا المساعدة؟',
      'contact.message.placeholder': 'رسالتك...',
      
      // Language
      'language.changed': 'تم تغيير اللغة إلى العربية',
      'language.updated': 'تم تحديث لغة التطبيق.',
    }
  },
  fr: {
    translation: {
      // Common
      'app.name': 'Life Guard',
      'app.tagline': 'Surveillance de santé en temps réel',
      
      // Navigation
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.arduino': 'Arduino',
      'nav.download': 'Télécharger',
      'nav.contact': 'Contact',
      'nav.login': 'Connexion',
      'nav.signup': 'S\'inscrire',
      
      // Contact page
      'contact.title': 'Contactez-nous',
      'contact.subtitle': 'Vous avez des questions sur votre moniteur de santé? Envoyez-nous un message.',
      'contact.name': 'Nom',
      'contact.email': 'Email',
      'contact.subject': 'Sujet',
      'contact.message': 'Message',
      'contact.send': 'Envoyer le message',
      'contact.response': 'Nous répondons généralement aux demandes dans les 24 à 48 heures.',
      'contact.name.placeholder': 'Votre nom',
      'contact.email.placeholder': 'nom@exemple.com',
      'contact.subject.placeholder': 'Comment pouvons-nous vous aider?',
      'contact.message.placeholder': 'Votre message...',
      
      // Language
      'language.changed': 'Langue changée en français',
      'language.updated': 'La langue de l\'application a été mise à jour.',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;