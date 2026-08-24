export type Lending = {
  _id?: string;
  bookId: string;
  bookTitle?: string;
  readerId: string;
  readerName?: string;
  borrowDate?: string;
  dueDate: string;
  returnDate?: string;
  status?: "borrowed" | "returned" | "overdue";
  createdAt?: string;
  updatedAt?: string;
};

