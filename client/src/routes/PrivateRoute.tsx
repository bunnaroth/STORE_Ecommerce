import React from "react";
import { AuthGuard } from "../features/auth/AuthGuard";

interface PrivateRouteProps {
    element: React.ReactElement; 
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({element}) => {
    return <AuthGuard>{element}</AuthGuard>;
}