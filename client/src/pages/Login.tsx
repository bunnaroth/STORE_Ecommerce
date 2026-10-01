import React from 'react'; 
import { LoginForm } from '../features/auth/LoginForm';
import { useNavigate } from 'react-router';

export const Login: React.FC = () => { 
    const navigate = useNavigate(); 

    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDivElement>
    ) => { 
        if (event.target === event.currentTarget) { 
            navigate("/");
        }
    };

    return ( 
        <div className='flex min-h-[80vh] w-full items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8' onClick={handleBackdropClick}>
            <LoginForm/>
        </div>
    );
};