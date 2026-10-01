interface FetchOptions extends RequestInit { 
    body?: any; 
}

const BASE_URL = 'http://localhost:5000/api'; 

export const clientFetch = async <T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> => { 
    const url = `${BASE_URL}${endpoint}`; 
    
    const headers = new Headers(options.headers); 

    if (!(options.body instanceof FormData)) { 
        headers.set('Content-Type', 'application/json');
    }

    const token = localStorage.getItem('token'); 

    if (token) { 
        headers.set('Authorization', `Bearer ${token}`); 
    }

    const config: RequestInit = { 
        ...options, 
        headers, 
        body: options.body && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body
    }; 

    const response = await fetch(url, config); 

    let data: any = null; 
    const contentType = response.headers.get('content-type'); 
    if (contentType && contentType.includes('application/json')) { 
        data = await response.json();
    }

    if (!response.ok) { 
        const errorMessage = data?.error || `HTTP Network Error: Status ${response.status}`;
        throw new Error(errorMessage); 
    }

    return data as T; 
}; 
