import React from "react";
import { Home } from "../pages/Home";
import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "../pages/Login"
import { Register } from "../pages/Register";
import { ProductBrowse } from "../pages/ProductBrowse";
import { ProductDetail } from "../pages/ProductDetail";
import { PrivateRoute } from "./PrivateRoute";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { CheckoutSuccess } from "../pages/CheckoutSuccess";
import { Profile } from "../pages/Profile";
import { AboutUs } from "../pages/AboutUs";
import { Contact } from "../pages/Contact";

export const AppRoutes: React.FC = () => { 
    return ( 
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about-us" element={<AboutUs/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/products" element={<ProductBrowse />}/>
            <Route path="/products/:id"element={<ProductDetail/>}/>

            {/* protected customer routes */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />
            <Route path="/checkout/success" element={<PrivateRoute element={<CheckoutSuccess />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile/>}/>}/>

            {/* fallback catch-all redirect  */}
            <Route path="*" element={<Navigate to="/" replace/>}/>
            
        </Routes>
    );
};