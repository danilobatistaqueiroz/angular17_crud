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
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Deletar produto</h2>
    <mat-dialog-content>
      Tem certeza que quer deletar esse produto?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNot()">Não</button>
      <button mat-raised-button color="accent" (click)="onYes()" cdkFocusInitial>Sim</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  standalone: true,
})
export class ConfirmationDialogComponent {
  matDialogRef = inject(MatDialogRef)
  onNot(){
    this.matDialogRef.close(false);
  }
  onYes(){
    this.matDialogRef.close(true);
  }
}

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
  matDialog = inject(MatDialog)

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
    this.matDialog.open(ConfirmationDialogComponent)
    .afterClosed().pipe(filter(answer=>answer===true)).subscribe(() => {
        this.productsService.delete(product.id)
        .subscribe(() => {
          this.carregaProdutos();
        })
    });
    // ######################  ou  ######################
    // this.matDialog.open(ConfirmationDialogComponent)
    // .afterClosed().subscribe((anwser) => {
    //   if(anwser){
    //     this.productsService.delete(product.id)
    //     .subscribe(() => {

    //     });
    //   }
    // });
  }
}
