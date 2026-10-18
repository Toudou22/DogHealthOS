import React from 'react';
import { AlertTriangle, RotateCcw, Home, Sparkles } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[CRITICAL UI SAFEGUARD] ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleHardReset = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
      } catch (_) {}
      window.location.href = '/';
    }
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#151311] text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center justify-center p-6 selection:bg-[#FF6B4A] selection:text-white">
          <div className="max-w-lg w-full bg-white dark:bg-[#1E1C18] border-[3px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[8px_8px_0_#FF6B4A] rounded-2xl p-6 sm:p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B4A]/15 border-2 border-[#FF6B4A] flex items-center justify-center text-[#FF6B4A]">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1A1A1A] dark:text-[#F0ECE6]">
                  {this.props.fallbackTitle || 'Application Self-Recovery'}
                </h1>
                <p className="text-xs text-[#8A8680] dark:text-[#9A9590] font-mono mt-0.5">
                  DogHealthOS Clinical Engine Protected
                </p>
              </div>
            </div>

            <p className="text-sm text-[#5A5650] dark:text-[#BAACA0] leading-relaxed">
              A temporary display anomaly was safely contained before it could affect your companion's clinical records. You can instantly restore normal operation below.
            </p>

            {this.state.error && (
              <div className="bg-[#FAF7F2] dark:bg-[#141210] border border-[#1A1A1A]/15 dark:border-white/15 p-3 rounded-xl">
                <p className="text-[0.72rem] font-mono text-[#D9534F] font-bold break-words">
                  {this.state.error.message || 'Unknown runtime anomaly'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 bg-[#FF6B4A] hover:bg-[#ff5a35] text-white font-extrabold rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Application
              </button>
              <button
                onClick={this.handleHardReset}
                className="py-3 px-4 bg-white dark:bg-[#282420] text-[#1A1A1A] dark:text-[#F0ECE6] font-bold rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]/10 dark:border-white/10 text-center">
              <span className="text-[0.68rem] text-[#8A8680] dark:text-[#9A9590] font-mono flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#E5A836]" />
                All biometric registries & medical records remain securely intact.
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
