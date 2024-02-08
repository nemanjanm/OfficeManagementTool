import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Subscription } from 'rxjs';
import { CreateOrderRequest } from '../../models/create-order-request';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  isSuccessful: boolean = false;
  show: boolean = false;
  text: string = '';

  officeId: number = -1;
  orderId: number = -1;
  createdBy: string = '';

  orderLoadingSubscription!: Subscription;

  constructor( 
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private translateService: TranslateService
    ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParam =>{
      this.officeId = Number(queryParam['officeId']);
      this.createdBy = queryParam['email'];
    });
    this.createOrder();
  }

  private createOrder(): void
  {
    this.orderLoadingSubscription = this.orderService.createOrder(new CreateOrderRequest(this.officeId, this.createdBy)).subscribe({
      next:(res) => {
        this.orderId = res.data;
        if(this.orderId > 0)
        {
          this.isSuccessful = true;
          this.text = this.translateService.instant('Order.OrderSucc');
        }
        else if(this.orderId == -1)
        {
          this.isSuccessful = false;
          this.text = this.translateService.instant('Order.OrderExists');
        }
        else
        {
          this.isSuccessful = false;
          this.text = this.translateService.instant('Order.OrderOtherError');
        }
        this.show = true;
      },
      error:(err) => {
        this.isSuccessful = false;
        this.show = true;
        this.text = this.translateService.instant('Order.OrderOtherError');
      }
    })
  }

  public viewOrder(): void
  {
    this.router.navigate(["/order-item"], {queryParams: {id: this.orderId, state: 1}});
  }
}