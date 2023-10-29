import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { SearchProvider } from './context/search';
import { CartProvider } from './context/cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
          <ToastContainer
            position="bottom-right"
            autoClose={1000}
            hideProgressBar={false}
            closeOnClick={true}
            pauseOnHover={true}
            draggable={true}
            progress={undefined}
          />
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>
);
