import { Request, Response } from 'express'; 
import { AuthService } from '../services/authService.js';
import { generateToken } from '../utils/generateToken.js';

//handle user and admin registration 
export const registerController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const { email, password, firstName, lastName} = req.body; 

        // validation checks
        if (!email || !password) { 
            res.status(400).json({error: 'Payload requires explicit email and password fields.'}); 
            return;
        }

        const user = await AuthService.registerUser(email, password, firstName, lastName); 

        const token = generateToken(user.id, user.role); 

        res.status(201).json({user, token});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}; 

// handles identity verification and login 
export const loginController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const { email, password } = req.body; 

        if (!email || !password) { 
            res.status(400).json({error: 'Authentication payload requires both fields. populated'}); 
            return; 
        }

        const user = await AuthService.loginUser(email, password); 

        const token = generateToken(user.id, user.role); 

        res.status(200).json({user, token}); 
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


