import React from "react";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AppRoutes } from "./routes/AppRoutes";
import { Navbar } from './components/layout/Navbar.js'
import { Footer } from "./components/layout/Footer";

function App() { 
  return ( 
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-indigo-100 selection:text-idgo-900">
            <Navbar />
            <main className="grow">
              <AppRoutes/>
            </main>
            <Footer/>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 