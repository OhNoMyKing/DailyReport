import { CACHE_MANAGER ,Cache} from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Product } from "src/modules/products/product.entity";
@Injectable()
export class RedisService{
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager : Cache,
    ){}
    //method
    async getAllProducts() : Promise<Product[] | null>{
        const key = 'all_products';
        const listProducts = await this.cacheManager.get<Product[]>(key);
        if(!listProducts){
            return null;
        }
        return listProducts;
    }
    //save 
    async saveAllProducts(listProducts : Product[]) : Promise<void>{
        const key = 'all_products';
        const resultProducts = await this.cacheManager.set(key,listProducts);
        return resultProducts;
    }
    //clear
    async clearCache(key: string) : Promise<void>{
        await this.cacheManager.del(key);
        console.log(`Cache with key ${key} cleared`);
    }
}
