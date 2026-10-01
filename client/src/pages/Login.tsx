import React from 'react'; 
import { LoginForm } from '../features/auth/LoginForm';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: React.FC = () => { 
    const navigate = useNavigate(); 
    const location = useLocation();
    const dismissTo = (location.state as { dismissTo?: string } | null)?.dismissTo ?? '/';

    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDivElement>
    ) => { 
        if (event.target === event.currentTarget) { 
            navigate(dismissTo, { replace: true });
        }
    };

    return ( 
        <div className='flex min-h-[80vh] w-full items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8' onClick={handleBackdropClick}>
            <LoginForm/>
        </div>
    );
};