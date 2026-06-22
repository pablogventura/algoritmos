import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight text-slate-100">
          {t('siteName')}
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-200">
            {t('nav.home')}
          </Link>
          <Link to="/compare" className="text-sm text-slate-400 hover:text-slate-200">
            {t('compareNav')}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
