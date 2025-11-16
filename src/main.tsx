import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/common.css' // Common styles cached across all pages

createRoot(document.getElementById("root")!).render(<App />);
