import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/categories/services/category.service';
import { CategoryTypes } from 'src/app/models/CategoryType';
import { Item } from 'src/app/models/Items';
import { Category } from 'src/app/models/category';
import { LoadRequest } from 'src/app/shared/models/load-request';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  providers: [DialogService, MessageService]
})
export class ItemFormComponent {
  item: Item = {
    categoryName: this.config.data.categoryName,
    categoryType: this.config.data.categoryType,
    categoryId: this.config.data.categoryId
  } 

  categoryTypes = CategoryTypes;

  categoryName: any;
  busy!: Subscription;
  onChangeInput = new EventEmitter<any>();
  valid: boolean = false;

  itemForm!: FormGroup;
  isUpdate: boolean = false;

  categories: Category [] = [];

  loadRequest: LoadRequest = {
    sortCategory: this.item.categoryType,
    sortField: 'name',
    sortOrder: 1
  }
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    public categoryService: CategoryService
  ){}

  ngOnInit(): void {
    if(this.config.data.categoryType) {
      this.item = this.config.data;
      this.loadRequest.sortCategory = this.item.categoryType
    }
    this.initForm();
    this.loadCategories();
  }

  private initForm(): void {
    this.itemForm = this.fb.group({
      name: [this.item.name, Validators.required],
      categoryId: [this.item.categoryId, Validators.required]
    });
  }
  
  loadCategories(): void {
    this.busy = this.categoryService.getAllCategories(this.loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.categories = response.data;
        }
      }
    });
  }

  onSaveFormItem(): void {
    if (this.itemForm.valid) {
      const updatedItem: Item = {
        ...this.itemForm.value
      };
      this.ref.close(updatedItem);
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  onCancelItemForm(): void {
    this.ref.close();
  }
  
  get name() {
    return this.itemForm.get('name');
  }
}