import React from 'react';
import { AlertTriangle, RefreshCw, Home, Trash2 } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    try {
      localStorage.removeItem('dmecs_mock_db');
      localStorage.removeItem('dmecs_token');
      localStorage.removeItem('dmecs_current_user');
    } catch (e) {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">Command Center Notice</h2>
                <p className="text-xs text-slate-400">An unexpected interface error was intercepted safely.</p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs text-red-400 overflow-x-auto">
              {this.state.error?.toString() || 'Unknown application runtime exception'}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-blue-600/30"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Interface</span>
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>

              <button
                onClick={this.handleResetState}
                className="flex items-center space-x-2 px-3 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded-lg text-xs font-medium transition"
                title="Reset mock store and cached state in browser"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Local Cache</span>
              </button>
            </div>

            {this.state.errorInfo?.componentStack && (
              <details className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                <summary className="cursor-pointer hover:text-slate-400">View component stack trace</summary>
                <pre className="mt-2 p-3 bg-slate-950 rounded-lg overflow-x-auto text-[10px] text-slate-400 leading-relaxed font-mono">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
