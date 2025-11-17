import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './layout.css';
import App from './App';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { UserProvider } from './context/UserContext';
import { B2BProvider } from './context/B2BContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <B2BProvider>
          <CartWishlistProvider>
            <App />
          </CartWishlistProvider>
        </B2BProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
