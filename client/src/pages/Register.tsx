import React from "react";
import { RegisterForm } from "../features/auth/RegisterForm";
import { useNavigate } from "react-router";

export const Register: React.FC = () => { 

    const navigate = useNavigate(); 

    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDivElement>
    ) => { 
        if (event.target === event.currentTarget) { 
            navigate("/");
        }
    };

    return( 
        <div className="flex min-h-[80vh] w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8" onClick={handleBackdropClick}>
            <RegisterForm/>
        </div>
    );
};