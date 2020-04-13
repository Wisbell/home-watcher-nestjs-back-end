import { IsString } from "class-validator";
import { Incident } from "./incident.entity";
import { Image } from "../image/image.entity";

export class IncidentDto {
  constructor()
  constructor(
    id: string,
    text: string,
    dateCreated: string,
    imageId: string,
  )
  constructor(
    id?: string,
    text?: string,
    dateCreated?: string,
    imageId?: string,
  ) {
    this.id = id;
    this.text = text;
    this.dateCreated = dateCreated;
    this.imageId = imageId;
  }

  @IsString()
  id: string;

  @IsString()
  text: string;

  @IsString()
  dateCreated: string; // TODO: Change to date

  @IsString()
  imageId: string;

  static toIncident(incidentDto: IncidentDto, image: Image): Incident {
    const incident = new Incident();
    incident.id = incidentDto.id ? parseInt(incidentDto.id) : undefined;
    incident.text = incidentDto.text;
    incident.dateCreated = incidentDto.dateCreated;
    incident.image = image || undefined;
    return incident;
  }

  static toIncidentUpdated(incidentDto: IncidentDto): Incident {
    console.log('toIncidentUpdated before', incidentDto);
    const incident = new Incident();
    incident.id = incidentDto.id ? parseInt(incidentDto.id) : undefined;
    incident.text = incidentDto.text;
    incident.dateCreated = incidentDto.dateCreated;
    incident.imageId = parseInt(incidentDto.imageId);

    console.log('toIncidentUpdated after', incident);
    return incident;
  }
}