import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button'; // Assuming button exists, fallback to standard HTML button if needed

export const LandingHeader = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="flex w-full items-center justify-between p-4 bg-white shadow-sm border-b">
      <div className="text-xl font-bold">
        ERP Corporation
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-slate-100 rounded-md font-medium hover:bg-slate-200 transition-colors"
        >
          {i18n.language === 'vi' ? '🇻🇳 VN' : '🇬🇧 EN'}
        </button>
      </div>
    </header>
  );
};
