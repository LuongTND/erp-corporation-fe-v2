import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import viCommon from '../../public/locales/vi/common.json'
import enCommon from '../../public/locales/en/common.json'

import viError from '../../public/locales/vi/error.json'
import enError from '../../public/locales/en/error.json'

import viAuth from '../../public/locales/vi/auth.json'
import enAuth from '../../public/locales/en/auth.json'

import viPortal from '../../public/locales/vi/portal.json'
import enPortal from '../../public/locales/en/portal.json'

import viLand from '../../public/locales/vi/landing.json'
import enLand from '../../public/locales/en/landing.json'

const resources = {
  vi: { common: viCommon, error: viError, auth: viAuth, portal: viPortal, landing: viLand },
  en: { common: enCommon, error: enError, auth: enAuth, portal: enPortal, landing: enLand },
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'vi',
    lng: 'vi', // Mặc định vi để tránh mismatch
    defaultNS: 'common',
    ns: ['common', 'error', 'auth', 'portal', 'landing'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Tránh Suspense boundary issue
    },
  })
}

export default i18n
