import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/categories/services/category.service';
import { OrderItemRequest } from 'src/app/models/OrderItemRequest';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent {
  order: OrderItemRequest = {
    id: this.config.data.id,
    amount: this.config.data.amount
  }

  orderForm!: FormGroup;
  amount: any;
  busy!: Subscription;
  isUpdate: boolean = true;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    public categoryService: CategoryService
  ){}

  ngOnInit(): void {
    if(this.config.data.orderItem.id) {
      this.order = this.config.data.orderItem
    }
    this.initForm();
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      amount: [this.order.amount, Validators.required]
    });
  }

  onSaveFormOrder(): void {
    if (this.orderForm.valid) {
      const updatedItem: OrderItemRequest = {
        ...this.orderForm.value
      };
      this.ref.close(updatedItem);
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  onCancelItemForm(): void {
    this.ref.close();
  }
}
