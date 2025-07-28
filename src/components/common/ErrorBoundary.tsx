
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    // Store error in localStorage for debugging
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        errorInfo: {
          componentStack: errorInfo.componentStack
        },
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 10 errors
      if (existingLogs.length > 10) {
        existingLogs.splice(0, existingLogs.length - 10);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(existingLogs));
    } catch (e) {
      console.warn('Failed to store error log:', e);
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleGoBack = () => {
    window.history.back();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" role="alert" aria-live="assertive">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" aria-hidden="true" />
            </div>
            
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              The application encountered an unexpected error. This might be a temporary issue.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mb-4 p-3 bg-gray-100 rounded text-sm">
                <summary className="cursor-pointer font-medium flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Error Details (Development)
                </summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="text-xs overflow-auto mt-1 p-2 bg-gray-200 rounded">
                      {this.state.error?.message}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="text-xs overflow-auto mt-1 p-2 bg-gray-200 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleReset} 
                variant="outline" 
                className="flex items-center gap-2 w-full"
                aria-label="Try to recover from error"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleGoBack} 
                  variant="outline" 
                  className="flex-1 flex items-center gap-2"
                  aria-label="Go back to previous page"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
                
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline" 
                  className="flex-1 flex items-center gap-2"
                  aria-label="Go to home page"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </div>
              
              <Button 
                onClick={this.handleReload} 
                className="flex items-center gap-2 w-full"
                aria-label="Reload the entire page"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>If the problem persists, please contact support.</p>
              <p className="mt-1">Error ID: {this.state.error?.name || 'Unknown'}</p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
