import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserModel, IRawUser, IRawAuthResponse } from '../types/user.js'; 

export interface AuthContextType { 
    user: UserModel | null; 
    token: string | null; 
    isAuthenticated: boolean; 
    isLoading: boolean; 
    login: (authData: IRawAuthResponse) => void; 
    logout: () => void;
    updateUser: (updatedUser: IRawUser) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => { 
    const [user, setUser] = useState<UserModel | null>(null); 
    const [token, setToken] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState<boolean>(true); 

    useEffect(() => { 
        const storedToken = localStorage.getItem('token'); 
        const storedUser = localStorage.getItem('user'); 

        if (storedToken && storedUser) { 
        try { 
            const rawUserData: IRawUser = JSON.parse(storedUser);
            setToken(storedToken); 
            setUser(new UserModel(rawUserData)); 
        } catch {
            localStorage.removeItem('token'); 
            localStorage.removeItem('user');
        }
    }

    setIsLoading(false);
}, []);

    const login = (authData: IRawAuthResponse) => { 
        const mappedUserModel = new UserModel(authData.user);

        setToken(authData.token); 
        setUser(mappedUserModel); 
        
        localStorage.setItem('token', authData.token); 

        const serializedUser: IRawUser = {
        id: mappedUserModel.id,
        email: mappedUserModel.email,
        first_name: mappedUserModel.firstName, 
        last_name: mappedUserModel.lastName,   
        created_at: '',
        updated_at: ''
        };
        
        localStorage.setItem('user', JSON.stringify(serializedUser));
    }; 

    const logout = () => { 
        setToken(null); 
        setUser(null); 
        localStorage.removeItem('token'); 
        localStorage.removeItem('user');
    }; 

    const updateUser = (updatedUser: IRawUser) => {
        const mappedUserModel = new UserModel(updatedUser);

        setUser(mappedUserModel);

        localStorage.setItem(
            'user',
            JSON.stringify(updatedUser)
        );
    };

    return ( 
        <AuthContext.Provider value={{
            user, 
            token, 
            isAuthenticated: !!token, 
            isLoading, 
            login, 
            logout,
            updateUser,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};
