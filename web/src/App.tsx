import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteHeader } from './components/SiteHeader';
import { HomePage } from './pages/HomePage';
import { AreaPage } from './pages/AreaPage';
import { AlgorithmPage } from './pages/AlgorithmPage';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <SiteHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/area/:slug" element={<AreaPage />} />
            <Route path="/algo/:id" element={<AlgorithmPage />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-600">
          AlgoViz
        </footer>
      </div>
    </BrowserRouter>
  );
}
