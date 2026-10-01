export interface IRawUser {
    id: number;
    email: string;
    first_name: string | null; 
    last_name: string | null;  
    created_at: string;
    updated_at: string;
}

export interface IRawAuthResponse {
    user: IRawUser;
    token: string;
}

export class UserModel {
    public readonly id: number;
    public readonly email: string;
    public readonly firstName: string; 
    public readonly lastName: string;  

    constructor(raw: IRawUser) {
        this.id = raw.id;
        this.email = raw.email;
        this.firstName = raw.first_name || ''; 
        this.lastName = raw.last_name || '';   
    }


    get fullName(): string {
        if (!this.firstName && !this.lastName) return this.email;
        return `${this.firstName} ${this.lastName}`.trim();
    }

}
