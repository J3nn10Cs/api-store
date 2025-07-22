import { 
  BadRequestException,
  Injectable, 
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUid } from 'uuid';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository : Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepoitory : Repository<ProductImage>,

    private readonly dataSource : DataSource

  ){}

  async create(createProductDto: CreateProductDto) {

    try {

      const { images = [], ...productData } = createProductDto;

      //create a new product instance
      const product = this.productRepository.create({
        ...productData,
        images : images.map(image => this.productImageRepoitory.create({ url : image }))
      });

      //save the product to the database
      await this.productRepository.save(product);

      return {...product, images};

    } catch (error) {
      
      this.handleDBExceptions(error);
    }

  }

  async findAll(paginationDto : PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      //saltar
      skip : offset,
      //cant 
      take : limit,
      relations : {
        images : true
      }

    });

    return products.map(product => ({
      ...product,
      images : product.images?.map(image => image.url)
    }))
  }

  async findOne(term: string) {

    let product : Product | null;

    if(isUUid(term)) {
      product = await this.productRepository.findOneBy({ id : term });
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title : term.toLocaleUpperCase(),
          slug : term
        })
        //leftJoin - alias
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }

    if(!product){
      throw new NotFoundException(`Product ${term} not found`);
    }

    return product
  }

  async findOnePlain(term : string) {
    const { images = [], ...data } = await this.findOne(term);

    return {
      ...data,
      images : images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images , ...updateData } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...updateData });

    if (!product)  throw new NotFoundException(`Product with id ${id} not found`);

    //controlar transaction
    const queryRunner = this.dataSource.createQueryRunner();

    //conection
    await queryRunner.connect();
    //start transaction
    await queryRunner.startTransaction();

    try {

      if(images){

        //delete images olds manager
        await queryRunner.manager.delete(ProductImage , {product : {id} });

        //assign new images
        product.images = images.map(image => this.productImageRepoitory.create(
          {url : image}
        ))
      }

      await queryRunner.manager.save(product);
      // await this.prod  uctRepository.save(product);

      //commit transaction confirmation
      await queryRunner.commitTransaction();

      //release the queryRunner - close the connection
      await queryRunner.release();
      
      return this.findOnePlain(id);

    } catch (error) {

      //revert transaction
      await queryRunner.rollbackTransaction();

      //close the connection
      await queryRunner.release();

      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);

  }

  private handleDBExceptions(error: any) {
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(`Error creating product: ${error.message}`, error.stack);

    throw new InternalServerErrorException(`Unexpected error, check server logs`);
  }

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      await query
        .delete()
        .where({})
        .execute()
        .then(() => {
          this.logger.log('All products deleted');
        });
    } catch (error) {
      this.handleDBExceptions(error);
      
    }
  }

}
