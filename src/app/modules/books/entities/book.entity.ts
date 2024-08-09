import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../catagory/entities/catagory.entity';
import { BookStatus } from '../enums/book.enum';

@Entity()
export class Book extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @Column({ length: 500, type: 'varchar' })
  authorName: string;

  @Column({  type: 'bigint', unique: true })
  bookNumber: number;

  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.FREE })
  bookAvailablitystatus: BookStatus;

  @Column({ type: 'boolean', default: false })
  status: boolean;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  user: User;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category' })
  category: Category;

  @Column({ type:'bigint',nullable: true })
  bookQuantity: number;

  @Column({ type: 'float', default: 0.0 })
  price: number;
  
  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ nullable: true })
  pdfUrl: string;

}