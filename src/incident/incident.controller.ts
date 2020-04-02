import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { Incident } from './incident.entity';
import { AuthGuard } from '@nestjs/passport';
import { IncidentDto } from './incident.dto';

@UseGuards(AuthGuard())
@Controller('incidents')
export class IncidentController {
  constructor(
    private readonly incidentService: IncidentService
  ) {}

  @Get()
  getAll(): Promise<Incident[]> {
    return this.incidentService.getAll();
  }

  @Get(':id')
  getIncident(@Param('id') id: string) {
    return this.incidentService.getDto(id);
  }

  @Post()
  createIncident(@Body() newIncident: IncidentDto): Promise<IncidentDto> {
    console.log('controller incident', newIncident)
    return this.incidentService.create(newIncident);
  }

  @Put(':id')
  async updateIncident(@Param('id') id: string, @Body() updatedIncidentDto: IncidentDto): Promise<IncidentDto> {
    // Note: Returned updated incident does not include image relationship.
    //       A get is done to retrieve a model with the relationship,
    //        so a proper dto can be created and sent to front end.
    await this.incidentService.update(id, updatedIncidentDto);

    return (
      await this.incidentService.get(id)
    ).toDto();
  }

  @Delete(':id')
  deleteIncident(@Param('id') id: string) {
    return this.incidentService.delete(id);
  }
}
