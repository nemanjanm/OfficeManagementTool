import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/categories/services/category.service';
import { OrderItemRequest } from 'src/app/models/OrderItemRequest';
import { OrderStatusRequest } from 'src/app/models/OrderStatusRequest';
import { States } from 'src/app/models/State';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent {
  order: OrderStatusRequest = {
    id: this.config.data.id,
    state: this.config.data.state
  }

  states = States;
  statusForm!: FormGroup;
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
    this.initForm();
  }

  private initForm(): void {
    this.statusForm = this.fb.group({
      id: [this.order.id, Validators.required],
      state: [this.order.state, Validators.required]
    });
  }

  onSaveFormStatus(): void {
    if (this.statusForm.valid) {
      const updatedItem: OrderItemRequest = {
        ...this.statusForm.value
      };
      this.ref.close(updatedItem);
    } else {
      this.statusForm.markAllAsTouched();
    }
  }

  onCancelItemForm(): void {
    this.ref.close();
  }
}
