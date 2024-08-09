import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Category } from '../catagory/entities/catagory.entity';
import { User } from '../users/entities/user.entity';
import { last } from 'rxjs';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createBookDto: CreateBookDto , files:any , currentUser:User): Promise<Book> {
    let pdfPath: string;
    let coverPath: string;
    files.forEach((file: { mimetype: string; path: string; }) => {
      if (file.mimetype === "application/pdf") {
        pdfPath = file.path.replace(/\\/g, "/");
      } else if (file.mimetype.startsWith("image/")) {
        coverPath = file.path.replace(/\\/g, "/");
      }
    });

    createBookDto.coverImageUrl =  coverPath ? `${process.env.IMG_URL}${coverPath}`:null;
    createBookDto.pdfUrl = pdfPath ? `${process.env.IMG_URL}${pdfPath}` : null;

   const lastBook = await this.bookRepository.find()
    console.log(lastBook[lastBook?.length -1].bookNumber + 1 );
    createBookDto.bookNumber = Number(lastBook[lastBook?.length -1].bookNumber + 1 )

    const user = await this.userRepository.findOne({ where: { id: currentUser.id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const category = await this.categoryRepository.findOne({ where: { id: createBookDto.categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const book = this.bookRepository.create({ ...createBookDto, user, category });

    return this.bookRepository.save(book);
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['user', 'category'] });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id }, relations: ['user', 'category'] });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.preload({ id, ...updateBookDto });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return this.bookRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    await this.bookRepository.remove(book);
  }
}

