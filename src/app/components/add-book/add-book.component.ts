import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/model/book';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  book = new Book();
  submitted = false;
  msgError = '';

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
  }

  existsPK (val:string): void {
    this.libraryService.get(val)
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  saveBook(): void {
    const data = {
      isbn: this.book.isbn,
      name: this.book.name,
      author: this.book.author
    };

    this.libraryService.create(data)
      .subscribe(
        data => {
          this.submitted=true;
          console.log(data);
        },
        error => {
          this.msgError  = error.message +' \n '+ error.error.message;
          console.log(error);
        });
  }

  newBook() {
    this.submitted = false;
    this.book.isbn = null;
    this.book.name = null;
    this.book.author = null;
  }

}
