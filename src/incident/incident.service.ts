import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { Incident } from './incident.entity';
import { IncidentDto } from './incident.dto';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    private imageService: ImageService
  ) {}

  async getAll(): Promise<Incident[]> {
    return await this.incidentRepository.find({ relations: ["image"] });
  }

  async get(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne(id, { relations: ["image"] });

    if(!incident)
      throw new HttpException('Incident not found', HttpStatus.NOT_FOUND);

    return incident;
  }

  async getDto(id: string): Promise<IncidentDto> {
    const incident: Incident = await this.get(id);

    return new IncidentDto(
      incident.id.toString(),
      incident.text,
      incident.dateCreated,
      incident.image.id.toString()
    );
  }

  async create(newIncident: IncidentDto): Promise<Incident> {
    newIncident.dateCreated = new Date().toString();

    const incidentToSave = IncidentDto.toIncident(
      newIncident,
      await this.imageService.getImage(newIncident.imageId)
    );

    return await this.incidentRepository.save(incidentToSave);
  }

  async update(id: string, updatedIncidentDto: IncidentDto): Promise<Incident> {

    if (id !== updatedIncidentDto.id)
      throw new HttpException('Endpoint incident id does not match incident entity id', HttpStatus.CONFLICT);

    let incidentToUpdate: Incident = await this.incidentRepository.findOne(id);

    if (!incidentToUpdate)
      throw new HttpException('Incident not found', HttpStatus.NOT_FOUND);

    incidentToUpdate.text = updatedIncidentDto.text;

    return await this.incidentRepository.save(incidentToUpdate);
  }

  async delete(id: string): Promise<void> {
    const incidentToRemove = await this.incidentRepository.findOne(id);

    if(!incidentToRemove)
      throw new HttpException('Incident not found', HttpStatus.NOT_FOUND);

    await this.incidentRepository.remove(incidentToRemove);
  }
}
