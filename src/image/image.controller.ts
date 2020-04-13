import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from './image.entity';

// TODO: Protect route
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
