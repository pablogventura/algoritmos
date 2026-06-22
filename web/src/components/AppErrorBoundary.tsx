import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('AlgoViz render error', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-slate-100">
          <h1 className="text-xl font-semibold">AlgoViz failed to load</h1>
          <p className="max-w-md text-sm text-slate-400">
            Try a hard refresh (Ctrl+Shift+R) or clear site data for this page in your browser settings.
          </p>
          <button
            type="button"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
