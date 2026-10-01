import React from "react";
import { AuthGuard } from "../features/auth/AuthGuard";

interface PrivateRouteProps { 
    element: React.ReactElement; 
    allowedRoles?: ('customer' | 'admin')[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({element, allowedRoles}) => { 
    return <AuthGuard allowedRoles={allowedRoles}>{element}</AuthGuard>;
}