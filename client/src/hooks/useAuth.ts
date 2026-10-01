import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

export const useAuth = (): AuthContextType => { 
    const context = useContext(AuthContext); 

    if (context === undefined) { 
        throw new Error('useAuth must be executed within an explicit <AuthProvider> wrap container.'); 
    }

    return context;
}