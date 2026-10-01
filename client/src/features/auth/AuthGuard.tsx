import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({children}) => {
    const { isAuthenticated, isLoading} = useAuth();
    const navigate = useNavigate(); 
    const location = useLocation();

    useEffect(() => {
        // If the system finishes reading storage keys and finding no user token session exists
        if (!isLoading && !isAuthenticated) { 
            const from = `${location.pathname}${location.search}${location.hash}`;
            const state = location.state as { dismissTo?: string } | null;
            const dismissTo = state?.dismissTo ?? (location.pathname === '/checkout' ? '/cart' : '/');
            navigate('/login', { replace: true, state: { from, dismissTo } });
            return; 
        }
        
    }, [isLoading, isAuthenticated, navigate, location]);

    if (isLoading) { 
        return ( 
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <LoadingSpinner/>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null; 
}