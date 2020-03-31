import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { Image } from './image.entity';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService
  ) {}

  @Get()
  getAll() {
    return this.imageService.getAllImages();
  }

  @Get(':id')
  getImage(@Param('id') id: string) {
    return this.imageService.getImage(id);
  }

  @Post()
  saveImage(@Body() newImage: Image) {
    return this.imageService.saveImage(newImage);
  }

  @Delete(':id')
  deleteImage(@Param('id') id: string) {
    return this.imageService.deleteImage(id);
  }
}
