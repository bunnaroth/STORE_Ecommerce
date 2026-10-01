import { CartItemModel, IRawCartItem } from "../types/cart";
import { productApi } from "./productApi";

const BASE_URL = 'http://127.0.0.1:5000/api/cart'; 

// helper function for  attach the JWT header into requests
const getAuthHeaders = () => { 
    const token = localStorage.getItem('token'); 
    return { 
        'Content-Type' : 'application/json', 
        ...(token ? { 'Authorization' :`Bearer ${token}`} : {}),
    };
};

export const cartApi = { 
    getCart: async (): Promise<CartItemModel[]> => { 
        const response = await fetch(BASE_URL, { 
            method: 'GET',  
            headers: getAuthHeaders(),
            cache: 'no-store',
        }); 

        const data = await response.json(); 

        if (!response.ok) { 
            throw new Error(data.error || `Failed to fetch basket items: HTTP ${response.status}`);
        }

        const rawItems = data as IRawCartItem[]; 
        return rawItems.map((raw) => new CartItemModel(raw));
    }, 

    addToCart: async (productId: number, quantity: number): Promise<{message: string}> => { 
        const response = await fetch(`${BASE_URL}/add`, { 
            method: 'POST', 
            headers: getAuthHeaders(), 
            body: JSON.stringify({productId, quantity}),
        });

        const data = await response.json(); 

        if (!response.ok) { 
            throw new Error(data.error || `Failed to add product to basket: HTTP ${response.status}`); 
        }

        return data; 
    }, 

    updateQuantity: async (productId: number, quantity: number): Promise<{message: string}> => { 
        const response = await fetch(`${BASE_URL}/update/${productId}`, { 
            method: 'PUT', 
            headers: getAuthHeaders(), 
            body: JSON.stringify({quantity}),
        });

        const data = await response.json(); 

        if (!response.ok) { 
            throw new Error(data.error || `Failed to modify quantity layout values: HTTP ${response.status}`);  
        }

        return data; 
    }, 
    
    removeFromCart: async (productId: number): Promise<{message: string}> => { 
        const response = await fetch(`${BASE_URL}/remove/${productId}`, { 
            method: 'DELETE', 
            headers: getAuthHeaders(), 
        });

        const data = await response.json(); 

        if (!response.ok) { 
            throw new Error(data.error || `Failed to erase product selection: HTTP ${response.status}`);
        }

        return data;
    },

    clearCart: async (): Promise<{message: string}> => { 
        const response = await fetch(`${BASE_URL}/clear`, { 
            method: 'DELETE', 
            headers: getAuthHeaders(),
        });

        const data = await response.json(); 
        if (!response.ok) { 
            throw new Error(data.error || `Failed to flush shopping basket fields: HTTP ${response.status}`);
        }

        return data; 
    },
};