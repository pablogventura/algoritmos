import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { clearLegacyServiceWorkerWithTimeout } from './lib/clearLegacySw';
import './i18n';
import './index.css';
import { App } from './App';
import { AppErrorBoundary } from './components/AppErrorBoundary';

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
}

// Never block first paint on service worker cleanup (Firefox can hang here).
void clearLegacyServiceWorkerWithTimeout().finally(renderApp);
