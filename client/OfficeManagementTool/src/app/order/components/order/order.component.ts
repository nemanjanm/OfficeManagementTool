import { ChangeDetectorRef, Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderResponse } from 'src/app/models/OrderResponse';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subscription } from 'rxjs';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { OrderItemRequest } from 'src/app/models/OrderItemRequest';
import { ItemFormComponent } from 'src/app/items/components/item-form/item-form.component';
import { States } from 'src/app/models/State';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderStatusComponent } from '../order-status/order-status.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

  ref: DynamicDialogRef | undefined;
  orderResponse: OrderResponse[] = [];
  lastLazyLoadEvent!: TableLazyLoadEvent;
  orderLoadingSubscription!: Subscription;
  
  states = States;

  constructor(
    private orderService: OrderService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private router: ActivatedRoute,
    private route: Router
  ){}

  ngOnInit(): void{
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderLoadingSubscription = this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        if(response){
          this.orderResponse = response;
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch Orders.'
        });
      }
    })
  }

  addOrder(): void {
        this.orderService.createOrder().subscribe({
          next: (res: ActionResultResponse) => {
            if (res && res.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order added successfully.'
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add Order. ' + res.errors.join(', ')
              });
            }
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add Order.'
            })
          }
      });
  }

  deleteOrder(id: number): void {
    this.confirmationService.confirm({
      header: "Delete Order",
      message: `Are you sure you want to delete Order`,
      dismissableMask: true,
      accept: () => {
        this.orderService.deleteOrder(id).subscribe({
          next: (res: ActionResultResponse)  => {
            if(res && res.status){
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order updated successfully.'
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update Order. ' + res.errors.join(', ')
              });
            }
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update Order.'
            });
          }
        })
      }
    })
  }

  public updateOrder(order: OrderResponse){
    const ref = this.dialogService.open(OrderStatusComponent, {
      header: 'Update Order',
      width: '400px',
      data: {state: order.state, id: order.id}
    });
    ref.onClose.subscribe((updatedOrder: OrderResponse) => {
      if(updatedOrder) {
        updatedOrder.id = order.id;
        this.orderService.updateOrder(updatedOrder).subscribe({
          next: (res: ActionResultResponse)  => {
            if(res && res.status){
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order updated successfully.'
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update Order. ' + res.errors.join(', ')
              });
            }
            this.loadOrders();
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update Order.'
            });
            this.loadOrders();
          }
      });
      }
    });
  }

  public showItems(order: OrderResponse): void{
    this.route.navigate(["/order-item"], {queryParams: {id: order.id, state: order.state}});
  }
}
