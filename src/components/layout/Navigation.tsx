
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, Moon, Sun, Globe, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

const Navigation: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'ar' | 'fr'>('en');
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
    
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['en', 'ar', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage as 'en' | 'ar' | 'fr');
    }
    
    // Setup PWA install prompt - Make sure the PWA install button is always visible for testing
    setIsInstallable(true); // Force show the install button for testing
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
    });
    
    // Check if app was successfully installed
    window.addEventListener('appinstalled', () => {
      // Hide the install button after successful installation
      setIsInstallable(false);
      // Log or notify that install was successful
      toast({
        title: "Installation successful!",
        description: "Life Guard has been added to your home screen.",
        variant: "default",
      });
    });
  }, [toast]);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    toast({
      title: newTheme === 'light' ? 'Light Mode Activated' : 'Dark Mode Activated',
      description: `The application theme has been changed to ${newTheme} mode.`,
      variant: "default",
    });
  };

  const changeLanguage = (lang: 'en' | 'ar' | 'fr') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Use i18next to change the language
    i18n.changeLanguage(lang).then(() => {
      // Force re-render by updating state
      setLanguage(lang);
      
      // Set RTL direction for Arabic
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      
      // Use safe fallbacks for translations that might not exist yet
      const translationKeys = {
        en: {
          changed: 'Language changed',
          updated: 'The application language has been updated.'
        },
        ar: {
          changed: 'تم تغيير اللغة',
          updated: 'تم تحديث لغة التطبيق.'
        },
        fr: {
          changed: 'Langue changée',
          updated: 'La langue de l\'application a été mise à jour.'
        }
      };
      
      toast({
        title: translationKeys[lang]?.changed || 'Language changed',
        description: translationKeys[lang]?.updated || 'The application language has been updated.',
        variant: "default",
      });
    });
  };
  
  const getLanguageName = (code: string) => {
    switch(code) {
      case 'en': return 'English';
      case 'ar': return 'العربية';
      case 'fr': return 'Français';
      default: return 'English';
    }
  };
  
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      // We no longer need the prompt. Clear it up
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        toast({
          title: "Installing Life Guard",
          description: "Thank you for installing our app!",
          variant: "default",
        });
      }
    } else {
      // If no install prompt is available, provide instructions
      toast({
        title: "Installation",
        description: "To install our app, use the install option in your browser menu.",
        variant: "default",
      });
    }
  };
  
  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about', 'About') },
    ...(isLoggedIn ? [{ to: '/dashboard', label: t('nav.dashboard') }] : []),
    { to: '/arduino', label: t('nav.arduino', 'Arduino') },
    { to: '/download', label: t('nav.download', 'Download') },
    { to: '/contact', label: t('nav.contact', 'Contact') }
  ];
  
  // RTL direction for Arabic language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">LG</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">Life Guard</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`text-sm font-medium ${
                  location.pathname === link.to 
                    ? 'text-blue-500' 
                    : 'text-gray-600 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400'
                } transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* PWA Install Button - Always visible for testing */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleInstallClick} 
              className="h-9 w-9 relative"
              title="Install App"
            >
              <Download className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">!</span>
            </Button>
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Globe className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DropdownMenuItem onClick={() => changeLanguage('en')} className={`${language === 'en' ? 'bg-blue-50 dark:bg-blue-900/20' : ''} text-gray-700 dark:text-gray-200`}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ar')} className={`${language === 'ar' ? 'bg-blue-50 dark:bg-blue-900/20' : ''} text-gray-700 dark:text-gray-200`}>
                  العربية
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('fr')} className={`${language === 'fr' ? 'bg-blue-50 dark:bg-blue-900/20' : ''} text-gray-700 dark:text-gray-200`}>
                  Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === 'light' ? <Moon className="h-5 w-5 text-gray-700" /> : <Sun className="h-5 w-5 text-gray-200" />}
            </Button>
            
            {/* Login/Logout buttons for desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                <Button onClick={handleLogout} variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-200">
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-200">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-800">
                <nav className="flex flex-col h-full py-6">
                  <div className="mb-8 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">Life Guard</span>
                  </div>
                  <div className="space-y-4">
                    {navLinks.map(link => (
                      <Link 
                        key={link.to} 
                        to={link.to} 
                        className={`block px-2 py-3 rounded-md text-sm font-medium ${
                          location.pathname === link.to 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' 
                            : 'text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-500'
                        } transition-colors duration-200`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      {isLoggedIn ? (
                        <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-left dark:border-gray-700 dark:text-gray-200">
                          Logout
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Link to="/login" className="w-full">
                            <Button variant="outline" className="w-full dark:border-gray-700 dark:text-gray-200">
                              Login
                            </Button>
                          </Link>
                          <Link to="/signup" className="w-full">
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
