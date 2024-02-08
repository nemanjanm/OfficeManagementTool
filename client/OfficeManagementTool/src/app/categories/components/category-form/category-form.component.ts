import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Category } from 'src/app/models/category';
import { CategoryType, CategoryTypes } from 'src/app/models/CategoryType';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  providers: [DialogService, MessageService]
})
export class CategoryFormComponent {
  category: Category = {
    name: this.config.data.name,
    categoryType: this.config.data.type
  }

  categoryTypes = CategoryTypes;

  categoryType!: any;
  
  onChangeInput = new EventEmitter<any>();
  valid: boolean = false;

  categoryForm!: FormGroup;
  isUpdate: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    if(this.config.data.id) {
      this.category.name = this.config.data.name
      this.category.categoryType = this.config.data.categoryType;
      this.categoryType = this.categoryTypes[this.category.categoryType].value;
    }
    this.initForm();
    this.populateForm();
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      categoryType: ['', Validators.required]
    });
  }

  private populateForm(): void {
    const category: Category = this.config.data;
    if (category.id) {
      this.isUpdate = true;
      this.categoryForm.patchValue(category);
    }
  }

  onSaveCategory(): void {
    if (this.categoryForm.valid) {
      const updatedCategory: Category = {
        ...this.categoryForm.value
      };
      this.ref.close(updatedCategory);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  onCancelCategoryForm(): void {
    this.ref.close();
  }
  
  get name() {
    return this.categoryForm.get('name');
  }

  get type() {
    return this.categoryForm.get('type');
  }
}