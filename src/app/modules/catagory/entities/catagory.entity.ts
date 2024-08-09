import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class Category extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
