import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 text-center text-white">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-gold-300">Application error</p>
            <h1 className="mt-4 text-3xl font-semibold">Something went wrong while loading the site.</h1>
            <p className="mt-3 text-sm text-white/70">Refresh the page or check the Firebase configuration.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}