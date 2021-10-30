import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/model/book';
import { LibraryService } from 'src/app/services/library.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {

  bookSet: Book[];
  bookFil: Book[];
  isbnBook : string;
  collectionSize: number;
  searchTerm: string;
  closeModal: string;
  msgError = '';
  currentBook = null;
  currentIndex = -1;
  
  constructor(private libraryService: LibraryService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.refreshList();
  }

  triggerModal(content:any, val:Book) {
    this.currentBook = val
    this.retrieveBook(this.currentBook.isbn)
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  search(value: string): void {
    this.bookFil = this.bookSet.filter((val) => val.name.toLowerCase().includes(value));
    this.collectionSize = this.bookFil.length;
  }

  retrieveBooks(): void {
    this.libraryService.getAll()
      .subscribe(
        data => {
          this.bookSet = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  retrieveBook(val:string): void {
    this.libraryService.get(val)
      .subscribe(
        data => {
          this.currentBook = data;
          console.log(data);
        },
        error => {
          this.msgError =  error.message +' \n '+ error.error.message;
          console.log(error);
        });
  }

  updateBook(): void {
   this.libraryService.update(this.currentBook.isbn, this.currentBook)
      .subscribe(
        data => {
          this.refreshList();
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  deleteBook(val1:string): void {
    this.libraryService.delete(val1)
       .subscribe(
         data => {
           this.refreshList();
           console.log(data);
         },
         error => {
           console.log(error);
         });
   }

  setActiveBook(book : Book, index : number): void {
    this.currentBook = book;
    this.currentIndex = index
  }

  refreshList(): void {
    this.retrieveBooks();
  }



}
