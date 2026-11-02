import { IRawProduct, ProductModel } from "../types/product";
import { API_BASE_URL } from "./config";

const BASE_URL = `${API_BASE_URL}/products`;

export const productApi = { 
    getFeatured: async (): Promise<ProductModel[]> => {
        const response = await fetch(`${BASE_URL}/featured`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Featured products retrieval failed: HTTP ${response.status}`);
        }

        return (data as IRawProduct[]).map((raw) => new ProductModel(raw));
    },

    getAll: async (category?: string, search?: string): Promise<ProductModel[]> => { 
        const queryParams = new URLSearchParams(); 

        if (category) queryParams.append('category', category); 
        if (search) queryParams.append('search', search); 

        const queryString = queryParams.toString(); 
        const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL; 

        const response = await fetch(url, { 
            method: 'GET', 
            headers: { 'Content-Type' : 'application/json'}, 
        }); 

        const data = await response.json(); 
        

        if (!response.ok) { 
            throw new Error(data.error || `Catelog retrieval failed: HTTP ${response.status}`); 
        }

        const rawProducts = data as IRawProduct[]; 
        return rawProducts.map((raw) => new ProductModel(raw)); 
    }, 

    getById: async (id: number): Promise<ProductModel> => { 
        const response = await fetch(`${BASE_URL}/${id}`, { 
            method: 'GET', 
            headers: { 'Content-Type' : 'application/json'}, 
        }); 

        const data = await response.json(); 

        if (!response.ok) { 
            throw new Error(data.error || `Product lookup failed: HTTP ${response.status}`); 
        }

        return new ProductModel(data as IRawProduct);
    }, 

}; 