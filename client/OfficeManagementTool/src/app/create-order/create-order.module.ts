import { NgModule } from '@angular/core';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { SharedModule } from 'primeng/api';
import { NgBusyModule } from 'ng-busy';
import { OrderService } from './services/order.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    CreateOrderComponent
  ],
  imports: [
    NgBusyModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  exports:[
    CreateOrderComponent
  ],
  providers: [
    OrderService
  ]
})
export class CreateOrderModule { }