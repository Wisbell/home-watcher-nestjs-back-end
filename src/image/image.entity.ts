import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Incident } from '../incident/incident.entity';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateCreated: string; // TODO: Change to date

  @Column()
  name: string; // TODO: Change to fileName?

  @Column()
  image: string; // TODO: Change to imageBase64

  @OneToOne(type => Incident, incident => incident.image)
  incident: Incident;
}
