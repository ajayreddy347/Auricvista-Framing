import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AuricVista ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#070707] text-[#f5f3eb] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#12110c] border border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <ShieldAlert className="w-8 h-8 text-[#fae69e]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37] font-semibold">
                Connection & Runtime Resilience
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fcfbf7] tracking-tight">
                Something encountered a momentary hiccup
              </h1>
              <p className="text-sm text-[#a8a396] font-sans max-w-md mx-auto leading-relaxed">
                The direct farm network safely intercepted a runtime exception. Your saved listings, cart data, and session are intact.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-2xl bg-[#090805] border border-[#d4af37]/20 text-left overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-mono text-[#fae69e] mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span className="font-semibold truncate">
                    {this.state.error.name || 'Runtime Error'}: {this.state.error.message}
                  </span>
                </div>
                {this.state.errorInfo?.componentStack && (
                  <p className="text-[10px] font-mono text-[#737067] max-h-24 overflow-y-auto whitespace-pre-wrap leading-tight mt-2">
                    {this.state.errorInfo.componentStack.trim()}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                id="error-boundary-reload-btn"
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#0a0a0a]" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                id="error-boundary-home-btn"
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#1a1710] border border-[#d4af37]/40 text-[#fae69e] font-serif font-bold text-xs uppercase tracking-widest hover:bg-[#252014] hover:border-[#fae69e] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-[#fae69e]" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
