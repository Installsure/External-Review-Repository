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
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
          <div className="max-w-md w-full bg-[#18191B] border border-[#2C2D2F] rounded-lg p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-bricolage font-semibold text-lg text-[#F2F2F2] mb-2">
                  Something went wrong
                </h3>
                <p className="font-inter text-sm text-[#A8ADB4] mb-4">
                  An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={this.handleRetry}
                    className="bg-[#F2F2F2] text-[#18191B] font-inter font-medium text-sm px-4 py-2 rounded-lg hover:bg-white transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="bg-[#2C2D2F] border border-[#414243] text-[#F2F2F2] font-inter font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#414243] transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4">
                    <summary className="font-inter text-sm text-[#A8ADB4] cursor-pointer hover:text-[#F2F2F2]">
                      Error Details
                    </summary>
                    <pre className="mt-2 font-mono text-xs text-red-400 bg-red-900/10 p-3 rounded overflow-auto max-h-40">
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
