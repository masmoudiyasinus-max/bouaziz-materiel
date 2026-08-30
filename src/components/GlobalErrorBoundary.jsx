import React from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { storageService } from "../services/storage";

export default class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[GlobalErrorBoundary] Uncaught application error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    storageService.clearAll();
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">
                Une erreur inattendue est survenue
              </h1>
              <p className="text-sm font-semibold text-slate-400">
                Nous nous excusons pour ce désagrément temporaire.
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Vous pouvez recharger la page ou réinitialiser les données locales pour continuer votre navigation en toute fluidité.
            </p>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-red-300 text-left overflow-x-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition active:scale-95 border border-zinc-700"
              >
                <RefreshCw className="h-4 w-4 text-[#38bdf8]" />
                <span>Recharger la page</span>
              </button>

              <button
                onClick={this.handleResetAndReload}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
                <span>Réinitialiser les données</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
