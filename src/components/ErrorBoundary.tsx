import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);

    if (error.message.includes('Failed to fetch dynamically imported module')) {
      if (!sessionStorage.getItem('chunk-error-reloaded')) {
        sessionStorage.setItem('chunk-error-reloaded', 'true');
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem('chunk-error-reloaded');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">เกิดข้อผิดพลาด</h1>
              <p className="text-muted-foreground">
                ระบบมีการอัปเดตใหม่ กรุณารีเฟรชหน้าเว็บ
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={this.handleReload} className="w-full" size="lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                รีเฟรชหน้าเว็บ
              </Button>
              <p className="text-xs text-muted-foreground">
                หากยังมีปัญหา กรุณาล้างแคชเบราว์เซอร์
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
