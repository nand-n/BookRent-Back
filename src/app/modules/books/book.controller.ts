import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/autherization/decorators/role.decorator';
import { Role } from '../users/enums/role.enum';
import { RolesGuard } from '../auth/autherization/guards/roles.guard';
import { REQUEST_USER } from '../auth/auth.constants';
import { User } from '../users/entities/user.entity';
import { PublishBookDto } from './dto/publish-book.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('books')
@ApiTags('Books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post()
  @Roles(Role.Admin,Role.Regular)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor("files"))
  create(@Body() createBookDto: CreateBookDto , 
  @UploadedFiles() files: Express.Multer.File[],
  @Req() req: Request
){
  const currentUser = req[REQUEST_USER] as User;
    try {
      return this.bookService.create(createBookDto, files , currentUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/by-category')
  @Roles(Role.Admin,Role.Regular,Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async getBooksByCategory(@Req() req: Request): Promise<{ categoryId: string, categoryName: string, bookCount: number, books: Book[] }[]> {
    const currentUser = req[REQUEST_USER] as User;
      return this.bookService.booksByCategory(currentUser);
  }
  
  @Get()
  findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }
  @Get('live-book-status')
  @Roles(Role.Admin , Role.Regular , Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async getLiveBookStatus(  @Req() req: Request): Promise<any> {
    const currentUser = req[REQUEST_USER] as User;
    return this.bookService.getLiveBookStatus(currentUser);
  }
  @Get('all-books-by-admin')
  @Roles(Role.Admin , Role.Regular,Role.SuperAdmin)
  @UseGuards(RolesGuard)
  getAllBookForAdmin( @Req() req: Request): Promise<Book[]> {
    const currentUser = req[REQUEST_USER] as User;
    return this.bookService.getAllBookForAdmin(currentUser);
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Promise<Book> {
    return this.bookService.update(id, updateBookDto);
  }

  @Patch('/:id/publish')
  @UseInterceptors(FilesInterceptor("files"))
  async publishBook(
      @Param('id') bookId: string,
      @Body() publishBookDto: PublishBookDto,
      @UploadedFiles() files: Express.Multer.File[],
      @Req() req: Request
  ) {
    const currentUser = req[REQUEST_USER] as User;
      return this.bookService.publishBook(bookId, publishBookDto , files , currentUser);
  }

  @Patch('/:id/approve')
  async approveBook(@Param('id') bookId: string) {
      return this.bookService.approveBook(bookId);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.bookService.remove(id);
  }
}
