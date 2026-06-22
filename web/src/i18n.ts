import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';
import enAreas from './locales/en/areas.json';
import esAreas from './locales/es/areas.json';
import enLegend from './locales/en/legend.json';
import esLegend from './locales/es/legend.json';
import enPlayback from './locales/en/playback.json';
import esPlayback from './locales/es/playback.json';
import enSteps from './locales/en/steps.json';
import esSteps from './locales/es/steps.json';
import enAlgorithms from './locales/en/algorithms.json';
import esAlgorithms from './locales/es/algorithms.json';

const saved = localStorage.getItem('locale');
const urlLang = new URLSearchParams(window.location.search).get('lang');

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      areas: enAreas,
      legend: enLegend,
      playback: enPlayback,
      steps: enSteps,
      algorithms: enAlgorithms,
    },
    es: {
      common: esCommon,
      areas: esAreas,
      legend: esLegend,
      playback: esPlayback,
      steps: esSteps,
      algorithms: esAlgorithms,
    },
  },
  lng: urlLang === 'es' ? 'es' : urlLang === 'en' ? 'en' : saved ?? 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'areas', 'legend', 'playback', 'steps', 'algorithms'],
  interpolation: { escapeValue: false },
});

export default i18n;
