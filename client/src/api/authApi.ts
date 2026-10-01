import { clientFetch} from './client.js'; 
import { IRawAuthResponse, IRawUser } from '../types/user.js';

export interface RegisterPayload { 
    email: string; 
    password?: string; 
    firstName: string; 
    lastName: string; 
}

export interface LoginPayload { 
    email: string; 
    password?:string;
}   

export const authApi  = { 

    register: async (payload: RegisterPayload): Promise<IRawAuthResponse> => { 
        return clientFetch<IRawAuthResponse>('/auth/register', { 
            method: 'POST', 
            body: payload,
        });
    },

    login: async (payload: LoginPayload): Promise<IRawAuthResponse> => { 
        return clientFetch<IRawAuthResponse>('/auth/login', { 
            method: 'POST', 
            body: payload,
        });
    },

    updateProfile: async (payload: {
        firstName: string;
        lastName: string;
        email: string;
    }): Promise<{ user: IRawUser }> => {
        return clientFetch<{ user: IRawUser }>('/auth/profile', {
            method: 'PATCH',
            body: payload,
        });
    },
};