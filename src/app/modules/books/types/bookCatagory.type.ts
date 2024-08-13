import { Book } from "../entities/book.entity";

export interface CategoryWithBooks {
    categoryId: string;
    categoryName: string;
    bookCount: number;
    books: Book[];
  }