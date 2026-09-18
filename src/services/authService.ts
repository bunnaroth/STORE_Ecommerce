import bcryptjs from 'bcryptjs'; 
import { UserModel } from '../models/User.js'; 
import bcrypt from 'bcryptjs';

export class AuthService { 

    // registration process 
    static async registerUser(email: string, passwordRaw: string, firstName?: string, lastName?: string) { 
        const existingUser = await UserModel.findByEmail(email); 
        if (existingUser) { 
            throw new Error('Registration failed: Email already registered'); 
        }

        // encrypt the plain text pw
        const salt = await bcryptjs.genSalt(10); 
        const passwordHash = await bcryptjs.hash(passwordRaw, salt); 

        const newUser = await UserModel.create(email, passwordHash, firstName, lastName); 
        return newUser;
    }   

    // validates login requests 
    static async loginUser(email:string, passwordRaw: string) { 
        const user = await UserModel.findByEmail(email); 
        if (!user) { 
            throw new Error('Authentication failed: Invalid credentials.'); 
        }

        const isMatch = await bcryptjs.compare(passwordRaw, user.passwordHash); 
        if(!isMatch) { 
            throw new Error('Authentication failed: Invalid creditials.');
        }

        // exclude the password before passing to the controller 
        const { passwordHash, ...userProfile } = user; 
        return userProfile;
    }
}