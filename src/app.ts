import express from 'express'; 
import cors from 'cors'; 
import authRoutes from './routes/authRoutes.js'; 
import productRoutes from './routes/productRoutes.js'; 
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; 
import paymentRoutes from './routes/paymentRoutes.js';

const app = express(); 

app.use(cors({origin: process.env.CLIENT_URL || 'http://localhost:5173'})); 
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 

app.use('/api/auth', authRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => { 
    res.status(200).json({status: 'OK'}); 
}); 

export default app; 