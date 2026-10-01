export interface IRawCartItem { 
    cartItemId: number; 
    productId: number; 
    name: string; 
    price: number; 
    quantity: number; 
    images: string[]; 
    stock: number; 
}

export class CartItemModel { 
    public readonly cartItemId: number; 
    public readonly productId: number; 
    public readonly name: string; 
    public readonly price: number; 
    public readonly quantity: number;
    public readonly images: string[]; 
    public readonly stock: number; 

    constructor(raw: IRawCartItem) { 
        this.cartItemId = raw.cartItemId; 
        this.productId = raw.productId; 
        this.name = raw.name; 
        this.price = typeof raw.price === 'string' ? parseFloat(raw.price) : raw.price; 
        this.quantity = raw.quantity;
        this.images = raw.images && raw.images.length > 0 ? raw.images : ['placeholder-product.png']; 
        this.stock = raw.stock;
    }

    get subtotal(): number { 
        return this.price * this.quantity;
    }

    get formattedSubtotal(): string { 
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
        }).format(this.subtotal);
    }

    get isExceedingStock(): boolean { 
        return this.quantity > this.stock;
    }
}