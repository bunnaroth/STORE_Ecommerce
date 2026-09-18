import { Request, Response, NextFunction } from "express";

export const stripeWebhookMiddleware = ( 
    req: Request, 
    _res: Response,
    next: NextFunction
): void => { 
    let data = ''; 

    req.setEncoding('utf8'); 

    // Collect raw text bytes straight from the request data stream
    req.on('data', (chunk) => { 
        data += chunk; 
    });

    req.on('end', () => { 

        req.rawBody = Buffer.from(data); 
        next();
    });
};
export default stripeWebhookMiddleware;