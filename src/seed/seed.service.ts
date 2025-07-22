import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data_seed';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ){}
  
  async executeSeed(){

    await this.insertNewProducts();

  }

  private async insertNewProducts(){

    await this.productsService.deleteAllProducts();

    //insert products data
    const products = initialData.products;

    const inserPromise: Promise<any>[] = [];

    products.forEach( product => {
      inserPromise.push(this.productsService.create(product))
    })

    await Promise.all(inserPromise);

    return true
  }
}
