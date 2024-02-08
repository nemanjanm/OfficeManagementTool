import { Component } from '@angular/core';
import { CartType } from 'src/app/models/CartType';

@Component({
  selector: 'app-cart-main',
  templateUrl: './cart-main.component.html',
  styleUrls: ['./cart-main.component.scss']
})
export class CartMainComponent {

  cartType: number = CartType.MyCart;
  itemType:number = CartType.Snacks;

}
