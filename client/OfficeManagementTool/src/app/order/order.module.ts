import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './components/order/order.component';
import { SharedModule } from '../shared/shared.module';
import { OrderItemComponent } from './components/order-item/order-item.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { CartComponent } from './components/cart/cart.component';
import { CartMainComponent } from './components/cart-main/cart-main.component';


@NgModule({
  declarations: [
    OrderComponent,
    OrderItemComponent,
    OrderFormComponent,
    OrderStatusComponent,
    CartComponent,
    CartMainComponent
  ],
  imports: [
    SharedModule
  ]
})
export class OrderModule { }
