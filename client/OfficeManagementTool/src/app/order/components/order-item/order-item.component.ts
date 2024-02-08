import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subscription } from 'rxjs';
import { States } from 'src/app/models/State';
import { OrderService } from '../../services/order.service';
import { OrderItemService } from '../../services/order-item.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderItemResponse } from 'src/app/models/OrderItemResponse';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { OrderItemRequest } from 'src/app/models/OrderItemRequest';
import { OrderFormComponent } from '../order-form/order-form.component';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentResponse } from 'src/app/models/AttachmentResponse';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent {

  ref: DynamicDialogRef | undefined;
  orderItemResponse: OrderItemResponse[] = [];
  attachmentResponse: AttachmentResponse [] = []
  lastLazyLoadEvent!: TableLazyLoadEvent;
  orderLoadingSubscription!: Subscription;

  states = States;
  public orderId: number = 0;
  public stateId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private router: Router,
    private attachmentService: AttachmentService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParam => {
      this.orderId = queryParam['id'];
      this.stateId = queryParam['state']
    })
    this.loadOrderItems(this.orderId)
    this.loadAttachments(this.orderId)
  }

  loadOrderItems(id: number): void {
    this.orderLoadingSubscription = this.orderItemService.getAllOrders(id).subscribe({
      next: (response: any) => {
        if (response) {
          this.orderItemResponse = response;
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

  loadAttachments(id: number): void {
    this.orderLoadingSubscription = this.attachmentService.getAllAttachments(id).subscribe({
      next: (response: any) => {
        if (response) {
          this.attachmentResponse = response;
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

  downloadAttachment(attachment: AttachmentResponse): void {
    this.attachmentService.downloadAttachment(attachment.id!).subscribe({
      next: (res: any) => {
        let blob: Blob = res;
        let anchor = document.createElement('a');
        anchor.download = attachment.name!;
        anchor.href = window.URL.createObjectURL(blob);
        anchor.click();
      },
      error: (err: any) =>{
        console.log(err)
      }
    })
  }

  deleteAttachment(id: number): void{
    this.confirmationService.confirm({
      header: "Delete Item",
      message: `Are you sure you want to delete Item form order`,
      dismissableMask: true,
      accept: () => {
        this.attachmentService.deleteAttachment(id).subscribe({
          next: (res: ActionResultResponse) => {
            if (res && res.status) {
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
            this.loadOrderItems(this.orderId);
            this.loadAttachments(this.orderId)
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update Order.'
            });
            this.loadOrderItems(this.orderId);
            this.loadAttachments(this.orderId)
          }
        })
      }
    })
  }

  deleteOrderItem(id: number): void {
    this.confirmationService.confirm({
      header: "Delete Item",
      message: `Are you sure you want to delete Item form order`,
      dismissableMask: true,
      accept: () => {
        this.orderItemService.deleteOrderItem(id).subscribe({
          next: (res: ActionResultResponse) => {
            if (res && res.status) {
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
            this.loadOrderItems(this.orderId);
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update Order.'
            });
            this.loadOrderItems(this.orderId);
          }
        })
      }
    })
  }

  onUpload(event: any) {   
    let formData: FormData = new FormData();
    formData.append("file", event.currentFiles[0])
    formData.append("id", ""+this.orderId);

    this.attachmentService.addAttachment(formData).subscribe({
      next: (res: ActionResultResponse) => {
        if (res && res.status) {
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
        this.loadOrderItems(this.orderId);
        this.loadAttachments(this.orderId)
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update Order.'
        });
        this.loadOrderItems(this.orderId);
        this.loadAttachments(this.orderId)
      }
    })

  }

  Back(): void {
    this.router.navigate(["/order"]);
  }

  updateOrderItem(orderItemResponse: OrderItemResponse) {
    const ref = this.dialogService.open(OrderFormComponent, {
      header: 'Update Order',
      width: '400px',
      data: { orderItem: orderItemResponse }
    });

    ref.onClose.subscribe((updatedOrderItem: OrderItemRequest) => {
      console.log(updatedOrderItem)
      if (updatedOrderItem) {
        updatedOrderItem.id = orderItemResponse.id;
        console.log(updatedOrderItem)
        this.orderItemService.updateOrderItem(updatedOrderItem).subscribe({
          next: (res: ActionResultResponse) => {
            if (res && res.status) {
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
            this.loadOrderItems(this.orderId);
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update Order.'
            });
            this.loadOrderItems(this.orderId);
          }
        });
      }
    })
  }
}
