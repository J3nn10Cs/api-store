import { BeforeInsert, 
  BeforeUpdate, 
  Column, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { ProductImage } from "./product_image.entity";

@Entity({
  name : 'products'
})
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  title       : string;

  @Column('float', {
    default: 0,
  })
  price       : number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description : string

  @Column('text',{
    unique: true
  })
  slug : string

  @Column('numeric', {
    default: 0,
  })
  stock      : number

  //array of strings
  @Column('text', {
    array: true,
  })
  sizes      : string[]

  @Column('text')
  gender : string

  @Column('text', {
    array: true,
    default: []
  })
  tags       : string[];

  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    //eager relationships id
    { cascade : true, eager : true }
  )
  images?    : ProductImage[]

  @BeforeInsert()
  checkSlugInsert(){
    if(!this.slug){
      this.slug = this.title
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }
    
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate(){

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
