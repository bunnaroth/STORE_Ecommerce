export interface IRawProduct { 
    id: number; 
    name: string; 
    description: string | null; 
    price: number; 
    stock: number; 
    images: string[]; 
    category: string; 
    is_featured: boolean;
    created_at: string; 
    updated_at: string; 
}

// frontend domain 
export class ProductModel { 
    public readonly id: number; 
    public readonly name: string; 
    public readonly description: string; 
    public readonly price: number; 
    public readonly stock: number; 
    public readonly images: string[]; 
    public readonly category: string; 
    public readonly isFeatured: boolean;

    constructor(raw: IRawProduct) { 
        this.id = raw.id; 
        this.name = raw.name; 
        this.description = raw.description || 'No description provided';
        this.price = typeof raw.price === 'string' ? parseFloat(raw.price): raw.price; 
        this.stock = raw.stock; 
        this.images = raw.images && raw.images.length > 0 ? raw.images : ['/placeholder-product.png']; 
        this.category = raw.category; 
        this.isFeatured = raw.is_featured;
    }

    // Evaluate if item inventory threholds hit zero 
    get isOutOfStock(): boolean { 
        return this.stock <= 0; 
    }

    // Instantly formats unit decimals into standard US dollar 
    get formattedPrice(): string { 
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
        }).format(this.price);
    }
}