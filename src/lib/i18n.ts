import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpApi) // Load translation files
    .use(LanguageDetector) // Detect browser language
    .use(initReactI18next)
    .init({
        supportedLngs: ['en', 'fr', 'es'], // Add your supported languages   
        lng: 'fr',
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/i18n/locales/{{lng}}.json', // Load JSON dynamically
        },
    });

export default i18n;
