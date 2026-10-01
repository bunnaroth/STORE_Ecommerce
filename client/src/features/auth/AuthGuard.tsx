import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

interface AuthGuardProps { 
    children: React.ReactNode; 
    allowedRoles?: ('customer' | 'admin')[]; 
}

export const AuthGuard: React.FC<AuthGuardProps> = ({children, allowedRoles}) => { 
    const { isAuthenticated, user, isLoading} = useAuth(); 
    const navigate = useNavigate(); 
    const location = useLocation();

    useEffect(() => {
        // If the system finishes reading storage keys and finding no user token session exists
        if (!isLoading && !isAuthenticated) { 
            const from = `${location.pathname}${location.search}${location.hash}`;
            navigate('/login', { replace: true, state: { from } }); 
            return; 
        }
        
        // Role-based verification 
        if (!isLoading && isAuthenticated && user && allowedRoles) { 
            if (!allowedRoles.includes(user.role)) { 
                navigate('/', {replace: true});
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, navigate, location]);

    if (isLoading) { 
        return ( 
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <LoadingSpinner/>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null; 
}