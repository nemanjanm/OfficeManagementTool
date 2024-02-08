import { ChangeDetectorRef, Component, EventEmitter, Input } from '@angular/core';
import { Category } from 'src/app/models/category';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BusyLoaderComponent } from 'src/app/shared/busy-loader/busy-loader.component';
import { Subscription } from 'rxjs';
import { LoadRequest } from 'src/app/shared/models/load-request';
import { CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { CategoryType, CategoryTypes } from 'src/app/models/CategoryType';
import { TableLazyLoadEvent } from 'primeng/table';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService, DynamicDialogConfig]
})
export class CategoriesComponent {
  @Input() categoryChanged = new EventEmitter<any>();
  categories: Category[] = [];
  totalRecords: number = 0;
  ref: DynamicDialogRef | undefined;
  searchTerm: string = "";
  config: DynamicDialogConfig | undefined;
  lastLazyLoadEvent!: TableLazyLoadEvent;

  currentPage: number = 1;
  rows: number = 10;

  isloading: boolean = false;
  busyLoader!: BusyLoaderComponent
  categoryLoadingSubscription!: Subscription;

  categoryTypes = CategoryTypes;

  categoryType!: any;
  
  constructor(
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ){}

  ngOnInit(): void{
    this.categoryService.refreshRequired.subscribe(response =>{
      this.loadCategories(this.lastLazyLoadEvent);
    })
  }

  loadCategories(event: TableLazyLoadEvent): void {
    this.lastLazyLoadEvent = event;
    let loadRequest: LoadRequest = {
      sortCategory: this.categoryType,
      searchTerm: this.searchTerm,
      currentPage: event!['first']! / this.rows + 1,
      sortField: (event.sortField as string) ?? 'name',
      sortOrder: (event.sortOrder as -1 | 1),
      pageSize: this.rows
    }

    this.categoryLoadingSubscription = this.categoryService.getAllCategories(loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.categories = response.data;
          this.totalRecords = response.totalRecords;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch categories.'
        });
      }
    });
  }
  
  loadCategoriesByType(event: any): void {
    let loadRequest: LoadRequest = {
      sortCategory: event.value,
      sortField: event?event.sortField:'name',
      sortOrder: event?event.sortOrder: 1
    }
    this.categoryType = event.value,
    this.categoryLoadingSubscription = this.categoryService.getAllCategories(loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.categories = response.data;
          this.totalRecords = response.totalRecords;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch categories.'
        });
      }
    });
  }

  addCategory(): void {
    const ref = this.dialogService.open(CategoryFormComponent, {
      header: 'Add Category',
      width: '400px',
      data: this.categoryChanged
    });

    ref.onClose.subscribe((category: Category) => {
      if(category) {
        this.categoryService.createCategory(category).subscribe({
          next: (res: ActionResultResponse) => {
            if (res && res.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Category added successfully.'
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add category. ' + res.errors.join(', ')
              });
            }
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add category.'
            })
          }
      });
      }
    })
  }

  deleteCategory(category: Category){
    this.confirmationService.confirm({
      header: "Delete category",
      message: `Are you sure you want to delete ${category.name}`,
      dismissableMask: true,
      accept: () => {
        this.categoryService.deleteCategory(category.id!).subscribe({
          next: (res : ActionResultResponse) => {
            if(res && res.status){
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Office delete successfully.'
              });
              this.loadCategories(this.lastLazyLoadEvent);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete category. ' + res.errors.join(", ")
              });
            }
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to fetch categories.'
            })
          }
      });
      }
    })
  }

  public updateCategory(category: Category){
    const ref = this.dialogService.open(CategoryFormComponent, {
      header: 'Update Category',
      width: '400px',
      data: {id: category.id, name: category.name, categoryType: category.categoryType}
    });

    ref.onClose.subscribe((updatedCategory: Category) => {
      if(updatedCategory) {
        updatedCategory.id = category.id;
        this.categoryService.updateCategory(updatedCategory).subscribe({
          next: (res: ActionResultResponse)  => {
            if(res && res.status){
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Category updated successfully.'
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update category. ' + res.errors.join(', ')
              });
            }
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update category.'
            });
          }
      });
      }
    });
  }
}