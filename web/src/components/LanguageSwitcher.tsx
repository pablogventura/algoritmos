import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex rounded-lg border border-slate-600 overflow-hidden text-xs font-medium">
      {(['en', 'es'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => {
            i18n.changeLanguage(lng);
            localStorage.setItem('locale', lng);
          }}
          className={`px-3 py-1.5 uppercase ${
            i18n.language.startsWith(lng)
              ? 'bg-sky-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
