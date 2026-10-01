import { NextFunction, Request, Response } from 'express'; 
import jsonwebtoken from 'jsonwebtoken'; 

export const authMiddleware = async ( 
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => { 
    try { 
        const authHeader = req.headers['authorization']; 

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.writeHead(401, { 'Content-Type' : 'application/json'}); 
            res.end(JSON.stringify({error: 'Access Denied: Missing or malformed authorization header.'})); 
            return; 
        }

        const token = authHeader.split(' ')[1]; 
        const secret = process.env.JWT_SECRET; 

        if (!secret) { 
            res.writeHead(500, { 'Content-Type':'application/json'}); 
            res.end(JSON.stringify({error: 'Internal configuration validation fault.'})); 
            return;
        }
        const decoded = jsonwebtoken.verify(token, secret) as { id: number };

        req.user = { 
            id: decoded.id, 
        }; 

        await next(); 
    } catch (error) { 
        res.writeHead(403, { 'Content-Type': 'application/json'}); 
        res.end(JSON.stringify({error: 'Access Denied: Session token expired or invalid.'})); 
    }
};