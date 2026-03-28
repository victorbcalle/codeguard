import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Forzamos el modo oscuro por defecto en el contenedor principal */}
    <div className="dark"> 
      <Home />
    </div>
  </React.StrictMode>
);