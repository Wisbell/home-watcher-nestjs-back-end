import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Image } from '../image/image.entity';
import { IncidentDto } from './incident.dto';

@Entity()
export class Incident extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateCreated: string; // TODO: Change to date

  @Column()
  text: string;

  @Column({ type: "int", nullable: false })
  imageId: number;

  @OneToOne(type => Image, image => image.incident)
  @JoinColumn({ name: "imageId" })
  image: Image;

  toDto(): IncidentDto {
    return new IncidentDto(
      this.id.toString(),
      this.text,
      this.dateCreated,
      this.image.id.toString()
    );
  }
}
