import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteHeader } from './components/SiteHeader';
import { PageLoader } from './components/PageLoader';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AreaPage = lazy(() => import('./pages/AreaPage').then((m) => ({ default: m.AreaPage })));
const AlgorithmPage = lazy(() => import('./pages/AlgorithmPage').then((m) => ({ default: m.AlgorithmPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then((m) => ({ default: m.ComparePage })));

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <SiteHeader />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/area/:slug" element={<AreaPage />} />
              <Route path="/algo/:id" element={<AlgorithmPage />} />
              <Route path="/compare" element={<ComparePage />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-600">
          AlgoViz
        </footer>
      </div>
    </BrowserRouter>
  );
}
