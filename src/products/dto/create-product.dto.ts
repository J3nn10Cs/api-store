import { 
  IsArray, 
  IsIn, 
  IsInt, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsString, 
  Min, 
  MinLength 
} from "class-validator";

export class CreateProductDto {

  @IsString()
  @MinLength(1)
  title : string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(0)
  price? : number;

  @IsString()
  @IsOptional()
  description? : string;

  @IsString()
  @IsOptional()
  slug? : string;

  @IsInt()
  @IsPositive()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes : string[];

  @IsIn(['men', 'women', 'kid','unisex'])
  gender : string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags? : string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images? : string[];
}
