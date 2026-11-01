import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AdminFotos } from './components/AdminFotos.tsx';
import './index.css';

// Panel de fotos: se abre en /#/admin-fotos (la pagina es estatica, sin router).
const isAdminFotos = window.location.hash.startsWith('#/admin-fotos');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminFotos ? <AdminFotos /> : <App />}
  </StrictMode>,
);
