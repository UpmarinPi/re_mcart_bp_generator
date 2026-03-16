import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorFallback from "./ErrorFallback.tsx";
import {ErrorBoundary} from "react-error-boundary";
import { AppInitializer } from "./Cores/AppInitializer";

// アプリケーション起動時の初期設定を実行
AppInitializer.initialize();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>,
)
