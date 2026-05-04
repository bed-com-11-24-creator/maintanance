import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string; // e.g., "Tool", "Spare Part"

  @Column({ type: 'number', precision: 10, scale: 0 })
  quantity!: number;

  @Column()
  location!: string; // e.g., "Main Store", "Block A Utility Room"

  @Column({ default: 'In Stock' })
  status!: string; // e.g., "In Stock", "Out of Stock", "Maintenance"

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
