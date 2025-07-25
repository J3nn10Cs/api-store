import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNameHelper } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,

    //acces env
    private readonly configService : ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImages(
    @Res() res : Response,
    @Param('imageName') imageName : string
  ){
    const path = this.filesService.getStaticProductImage(imageName); 

    //obtener la imagen
    res.sendFile(path)
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter : fileFilter,
    // limits : { fileSize : 100}
    storage : diskStorage({
      destination : './static/uploads/products',
      filename : fileNameHelper
    })
  }))
  uploadProductImageFile(
    @UploadedFile() file : Express.Multer.File
  ){

    if(!file) throw new BadRequestException('Make sure that the file is an image');

    const securedUrl = `${this.configService.get('API_HOST')}/files/product/${file.filename}` 

    return {
      securedUrl
    }
  }
}
