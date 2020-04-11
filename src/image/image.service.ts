import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>
  ) {}

  async getAllImages(): Promise<Image[]> {
    return await this.imageRepository.find({ relations: [ "incident" ]});
  }

  async getImage(id: string): Promise<Image> {
    const imageToGet = await this.imageRepository.findOne(id, { loadRelationIds: true });

    if(!imageToGet)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return imageToGet;
  }

  async saveImage(image: Image): Promise<Image> {
    return await this.imageRepository.save(image);
  }

  async deleteImage(id: string): Promise<void> {
    const imageToRemove = await this.imageRepository.findOne(id);

    if(!imageToRemove)
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);

    await this.imageRepository.remove(imageToRemove);
  }
}
