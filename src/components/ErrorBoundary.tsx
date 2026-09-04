import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('QuickSurfaces ErrorBoundary caught an unexpected error:', error, errorInfo);
  }

  handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDomMutationError =
        this.state.error?.message?.includes('removeChild') ||
        this.state.error?.message?.includes('insertBefore') ||
        this.state.error?.name === 'NotFoundError';

      return (
        <div
          translate="no"
          className="notranslate w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white border border-[#E2E8F0] rounded-3xl shadow-xl text-center font-sans"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center text-[#FF8407]">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-[#0F172A] mb-2">
            {this.props.fallbackTitle || 'Hubo un detalle temporal en la visualización'}
          </h3>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
            {isDomMutationError
              ? 'Se detectó una alteración externa en el contenido (posible traducción automática del navegador). Puedes restaurar la vista haciendo clic en reintentar.'
              : this.props.fallbackDescription ||
                'Un componente experimentó un error inesperado al actualizar la vista. Haz clic en reintentar para recuperar el cotizador.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar / Try Again</span>
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Recargar Página / Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
