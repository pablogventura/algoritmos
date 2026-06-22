import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { clearLegacyServiceWorker } from './lib/clearLegacySw';
import './i18n';
import './index.css';
import { App } from './App';
import { AppErrorBoundary } from './components/AppErrorBoundary';

async function bootstrap() {
  await clearLegacyServiceWorker();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
}

void bootstrap();
