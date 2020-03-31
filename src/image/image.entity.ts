import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
