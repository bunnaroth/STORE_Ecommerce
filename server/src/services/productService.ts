import { ProductModel, ProductRow} from '../models/Product.js'; 

export class ProductService { 
    static async getFeaturedProducts(): Promise<ProductRow[]> {
        return await ProductModel.getFeatured();
    }

    static async getAllProducts(category?: string, search?: string): Promise<ProductRow[]> { 
        return await ProductModel.findAll(category, search); 
    }
    
    static async getProductById(id: number): Promise<ProductRow> { 

        const product = await ProductModel.findById(id); 

        if (!product) { 
            throw new Error('Product lookup failed: Requested item does not exist.'); 
        }
        return product;
    }
}