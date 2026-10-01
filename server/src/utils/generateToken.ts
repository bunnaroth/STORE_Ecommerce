import jsonwebtoken from 'jsonwebtoken'; 

// short lived jwt for user identity 
export const generateToken = (userId: number, role: string): string => { 
    const secret = process.env.JWT_SECRET; 

    if(!secret) { 
        throw new Error('Critical Configuration Fault: Missing enviornment parameter JWT_SECRET'); 
    }

    // signs the payload
    return jsonwebtoken.sign(
        {id: userId, role}, 
        secret, 
        {expiresIn: '7d'}
    );
}; 
