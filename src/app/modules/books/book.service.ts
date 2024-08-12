import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Category } from '../catagory/entities/catagory.entity';
import { User } from '../users/entities/user.entity';
import { last } from 'rxjs';
import { PublishBookDto } from './dto/publish-book.dto';

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
    files?.forEach((file: { mimetype: string; path: string; }) => {
      if (file.mimetype === "application/pdf") {
        pdfPath = file.path.replace(/\\/g, "/");
      } else if (file.mimetype.startsWith("image/")) {
        coverPath = file.path.replace(/\\/g, "/");
      }
    });

    createBookDto.coverImageUrl =  coverPath ? `${process.env.IMG_URL}${coverPath}`:null;
    createBookDto.pdfUrl = pdfPath ? `${process.env.IMG_URL}${pdfPath}` : null;

  const lastBook = await this.bookRepository.find({
    order: { bookNumber: 'DESC' },
    take: 1
});

const lastBookNumber = lastBook.length > 0 ? lastBook[0].bookNumber : 0;
createBookDto.bookNumber = lastBookNumber + 1;

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
  async publishBook(
    bookId: string,
    updateBookDto: PublishBookDto,
    files:Express.Multer.File[],
    currentUser:User
): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where:{id:bookId}
    });
    if (!book) {
        throw new NotFoundException('Book not found');
    }

    let coverPath: string;
    files.forEach((file: { mimetype: string; path: string; }) => {
      if (file.mimetype.startsWith("image/")) {
        coverPath = file.path.replace(/\\/g, "/");
      }
    });

    updateBookDto.coverImageUrl =  coverPath ? `${process.env.IMG_URL}${coverPath}`:null;


    if (updateBookDto.bookQuantity) {
      book.bookQuantity = parseInt(updateBookDto.bookQuantity, 10);
  }
  if (updateBookDto.coverImageUrl) {
      book.coverImageUrl = updateBookDto.coverImageUrl;
  }
  if (updateBookDto.price) {
      book.price = parseFloat(updateBookDto.price);
  }
  book.status = true; 

    return this.bookRepository.save(book);
}
  
async approveBook(bookId: string): Promise<Book> {
  const book = await this.bookRepository.findOne({
    where:{
      id:bookId
    }
  });
  if (!book) {
      throw new NotFoundException('Book not found');
  }

  book.approved = true;

  return this.bookRepository.save(book);
}

  findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['user', 'category'] });
  }


  async getLiveBookStatus(currentUser:User){
    const books =await this.bookRepository.find({ relations: ['user'] })
    return books?.filter(item=>currentUser.role == "admin" ? item : item.user.id == currentUser.id)
  }
async getAllBookForAdmin(user:User): Promise<Book[]> {

     const book =await this.bookRepository.find( { relations: ['user', 'category'] });

     return book.filter((item)=> item?.user?.id == user?.id) 
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id }, relations: ['user', 'category'] });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async booksByCategory(): Promise<{ categoryId: string, categoryName: string, bookCount: number, books: Book[] }[]> {
    const booksWithCategory = await this.bookRepository.find({ relations: ['category'] });

    const categoryMap: { [key: string]: { name: string, books: Book[] } } = {};

    booksWithCategory.forEach(book => {
        const categoryId = book.category.id;
        if (!categoryMap[categoryId]) {
            categoryMap[categoryId] = { name: book.category.name, books: [] };
        }
        categoryMap[categoryId].books.push(book);
    });

    const result = Object.keys(categoryMap).map(categoryId => ({
        categoryId,
        categoryName: categoryMap[categoryId].name,
        bookCount: categoryMap[categoryId].books.length,
        books: categoryMap[categoryId].books
    }));

    return result;
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

