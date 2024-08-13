import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';


@Entity()
export class Sale extends BaseModel {
  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @Column({ type: 'float' })
  salePrice: number;

  @Column({ type: 'date' })
  saleDate: Date;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;


  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

}
