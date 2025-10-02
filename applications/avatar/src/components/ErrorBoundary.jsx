import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 px-4">
          <div className="max-w-md w-full bg-[#1E1E1E] dark:bg-[#18191B] border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center ring-2 ring-purple-500/50">
                  <AlertTriangle className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-inter font-bold text-lg text-white mb-2">
                  AI Avatar Error
                </h3>
                <p className="font-inter text-sm text-gray-300 mb-4">
                  An unexpected error occurred in the Avatar system. Please try refreshing or contact support if the problem persists.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={this.handleRetry}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-inter font-medium text-sm px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="bg-[#2C2D2F] border border-purple-500/30 text-white font-inter font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#414243] transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4">
                    <summary className="font-inter text-sm text-gray-400 cursor-pointer hover:text-white">
                      Error Details
                    </summary>
                    <pre className="mt-2 font-mono text-xs text-red-400 bg-red-900/20 p-3 rounded overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
