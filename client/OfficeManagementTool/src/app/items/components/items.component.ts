import { ChangeDetectorRef, Component, EventEmitter, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/categories/services/category.service';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { CategoryTypes } from 'src/app/models/CategoryType';
import { Item } from 'src/app/models/Items';
import { BusyLoaderComponent } from 'src/app/shared/busy-loader/busy-loader.component';
import { LoadRequest } from 'src/app/shared/models/load-request';
import { ItemFormComponent } from './item-form/item-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../services/item.service';
import { Category } from 'src/app/models/category';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  items: Item[] = [];
  totalRecords: number = 0;
  ref: DynamicDialogRef | undefined;
  searchTerm: string = "";
  config: DynamicDialogConfig | undefined;
  lastLazyLoadEvent!: TableLazyLoadEvent;

  isloading: boolean = false;
  busyLoader!: BusyLoaderComponent
  itemLoadingSubscription!: Subscription;

  currentPage: number = 1;
  rows: number = 10;

  categoryTypes = CategoryTypes;

  categoryType!: any;
  
  categoryName!: any;

  categories: Category[] = [];

  loadRequest: LoadRequest = {
    sortCategory: this.categoryType,
    sortField: 'name',
    sortOrder: 1
  }
  constructor(
    private categoryService: CategoryService,
    private itemService: ItemService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private router: ActivatedRoute,
    private translateService: TranslateService
  ){}

  ngOnInit(): void{
    this.router.data.subscribe( x => {
      this.categoryType = x["CategoryType"];
      this.loadRequest.sortCategory = x["CategoryType"];
    });

    this.loadCategories();
    
    this.itemService.refreshRequired.subscribe(response =>{
      this.loadItems(this.lastLazyLoadEvent);
    })
  }

  loadCategories(): void {
    this.categoryService.getAllCategories(this.loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.categories = response.data;
        }
        else
        {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Common.Error'),
            detail: this.translateService.instant('Items.FailedToFetch')
          });
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error'),
          detail: this.translateService.instant('Items.FailedToFetch')
        });
      }
    });
  }

  loadItems(event: TableLazyLoadEvent): void {
    this.lastLazyLoadEvent = event;
    let loadRequest: LoadRequest = {
      sortCategory: this.categoryType,
      searchTerm: this.searchTerm,
      currentPage: event!['first']! / this.rows + 1,
      sortField: (event.sortField as string) ?? 'name',
      sortOrder: (event.sortOrder as -1 | 1),
      pageSize: this.rows
    }

    this.itemLoadingSubscription = this.itemService.getAllItems(loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.items = response.data.data;
          this.totalRecords = response.data.totalRecords;
          this.changeDetectorRef.detectChanges();
        }
        else
        {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Common.Error'),
            detail: this.translateService.instant('Items.FailedToFetchItems')
          });
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error'),
          detail: this.translateService.instant('Items.FailedToFetchItems')
        });
      }
    });
  }

  loadItemsCategoriesByType(event: any): void {
    let loadRequest: LoadRequest = {
      sortCategoryName: event.value,
      sortField: event?event.sortField:'name',
      sortOrder: event?event.sortOrder: 1
    }
    this.itemLoadingSubscription = this.itemService.getAllItems(loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.items = response.data.data;
          this.totalRecords = response.totalRecords;
          this.changeDetectorRef.detectChanges();
        }
        else
        {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Common.Error'),
            detail: this.translateService.instant('Items.FailedToFetchItems')
          });
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error'),
          detail: this.translateService.instant('Items.FailedToFetchItems')
        });
      }
    });
  }

  addItem(): void {
    const ref = this.dialogService.open(ItemFormComponent, {
      header: this.translateService.instant('Items.AddItem'),
      width: '400px',
      data: { categoryType: this.categoryType }
    });

    ref.onClose.subscribe((category: Item) => {
      if(category) {
        this.itemService.createItem(category).subscribe({
          next: (res: ActionResultResponse) => {
            if (res && res.status) {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('Items.AddItemSucc')
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant('Items.AddItemFail')
              });
            }
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Common.Error'),
              detail: this.translateService.instant('Items.AddItemFail')
            })
          }
      });
      }
    })
  }

  deleteItem(item: Item){
    this.confirmationService.confirm({
      header: this.translateService.instant('Items.DeleteItem'),
      message: `${this.translateService.instant('Items.DeleteItemConfirmDialog')} ${item.name}`,
      dismissableMask: true,
      accept: () => {
        this.itemService.deleteItem(item.id!).subscribe(
          (response) => {
            if(response && response.status){
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('Items.DeleteItemSucc')
              });
              this.loadItems(this.lastLazyLoadEvent);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant('Items.DeleteItemFail')
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Common.Error'),
              detail: this.translateService.instant('Items.DeleteItemFail')
            })
          }
        )
      }
    })
  }

  public updateItem(item: Item){
    const ref = this.dialogService.open(ItemFormComponent, {
      header: this.translateService.instant('Items.UpdateItem'),
      width: '400px',
      data: {id: item.id, name: item.name, categoryName: item.categoryName, categoryType: item.categoryType, categoryId: item.categoryId}
    });

    ref.onClose.subscribe((updatedCategory: Item) => {
      if(updatedCategory) {
        updatedCategory.id = item.id;
        this.itemService.updateItem(updatedCategory).subscribe({
          next: (res: ActionResultResponse)  => {
            if(res && res.status){
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('Items.UpdateItemSucc')
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant('Items.UpdateItemFail')
              });
            }
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant('Items.UpdateItemFail')
            });
          }
      });
      }
    });
  }
}
