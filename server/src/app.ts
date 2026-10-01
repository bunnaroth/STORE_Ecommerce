import express from 'express'; 
import cors from 'cors'; 
import authRoutes from './routes/authRoutes.js'; 
import productRoutes from './routes/productRoutes.js'; 
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express(); 

const configuredClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

const isLocalhostOrigin = (origin: string): boolean => {
    try {
        const { hostname } = new URL(origin);
        return hostname === 'localhost' || hostname === '127.0.0.1';
    } catch {
        return false;
    }
};

app.use(cors({
    origin: (origin, callback) => {
        const allowed = !origin || origin === configuredClientUrl || (
            process.env.NODE_ENV !== 'production' && isLocalhostOrigin(origin)
        );
        callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
    },
}));
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 

app.use('/api/auth', authRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes); 
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);

app.get('/health', (req, res) => { 
    res.status(200).json({status: 'OK'}); 
}); 

export default app; 