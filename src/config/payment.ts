import Stripe from 'stripe'; 

const secretKey = process.env.STRIPE_API_KEY; 

if(!secretKey) { 
    throw new Error('Critical Configuration Error: Missing enviornment parameter.')
}

// Instantiate the singleton Stripe API client instance
export const stripe = new Stripe(secretKey, { 
    apiVersion: '2023-10-16' as any, // Stable core transactional version footprint
});