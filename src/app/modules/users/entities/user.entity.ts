import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';

import { Role } from '../enums/role.enum';
import { Permission, PermissionType } from '../../auth/autherization/permission.type';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class User extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;
  @Column({ length: 500, type: 'varchar' })
  password: string;

  @Column({ length:50 , type: 'varchar' , enum: Role, default: Role.Regular })
  role: Role;

  @Column({ enum: Permission, default: [], type: "json" })
  permissions: PermissionType[];

  @Column({ length: 50, type: 'varchar' ,nullable:true , unique:true})
  phone: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ length: 50, type: 'varchar', nullable:true , unique:true })
  email: string;

  @Column({ length: 50, type: 'varchar', nullable:true , unique:true })
  telegramUser: string;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @Column({  type: 'varchar', nullable:true  })
  profilePicture: string;


}
