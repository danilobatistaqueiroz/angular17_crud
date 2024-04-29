import { ConfirmationDialogService } from './../../shared/services/confirmation-dialog.service';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../../shared/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CardComponent } from './components/card/card.component';
import { Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent, RouterLink, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  products: Product[] = [];
  productsService = inject(ProductsService);
  router = inject(Router);
  confirmationDialogService = inject(ConfirmationDialogService);

  carregaProdutos(){
    this.productsService.getAll().subscribe((products:Product[])=>{
      this.products = products;
    })
  }

  ngOnInit() {
    this.carregaProdutos();
  }

  onEdit(product: Product){
    this.router.navigate(['/edit-product',product.id]);
  }

  onDelete(product: Product){
    this.confirmationDialogService
    .openDialog()
    .pipe(filter(answer=>answer===true))
    .subscribe(()=>{
      this.productsService.delete(product.id)
      .subscribe(() => {
        this.carregaProdutos();
      });
    });
    // ######################  ou  ######################
    // this.confirmationDialogService
    // .openDialog().subscribe((anwser) => {
    //   if(anwser){
    //     this.productsService.delete(product.id)
    //     .subscribe(() => {
    //        this.carregaProdutos();
    //     });
    //   }
    // });
  }
}
