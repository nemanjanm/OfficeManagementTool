import { Component, EventEmitter, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/categories/services/category.service';
import { ItemService } from 'src/app/items/services/item.service';
import { Item } from 'src/app/models/Items';
import { Category } from 'src/app/models/category';
import { BusyLoaderComponent } from 'src/app/shared/busy-loader/busy-loader.component';
import { LoadRequest } from 'src/app/shared/models/load-request';
import { CartService } from '../../services/cart.service';
import { CartType, CartTypes } from 'src/app/models/CartType';
import { OrderRequest } from 'src/app/models/OrderRequest';
import { StorageService } from 'src/app/auth/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { OrderRequestViewModel } from 'src/app/models/OrderRequestViewModel';
import { RequestOrderFilter } from 'src/app/models/RequestOrderFilter';
import { SignalRService } from 'src/app/shared/signal-r.service';
import { Router } from '@angular/router';
import { Role } from 'src/app/shared/enum/role';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  items: Item[] = [];
  orderRequests: OrderRequestViewModel[] = [];
  totalRecords: number = 0;
  ref: DynamicDialogRef | undefined;
  searchTerm: string = "";
  lastLazyLoadEvent!: TableLazyLoadEvent;

  isloading: boolean = false;
  busyLoader!: BusyLoaderComponent
  itemLoadingSubscription!: Subscription;
  reconnectionEmitter: EventEmitter<any> = new EventEmitter();

  @Input() tableType!: number;
  
  itemType: number = CartType.Snacks;
  myCartType: number = CartType.MyCart;
  officeCartType: number = CartType.OfficeCart;
  
  openUpdate: number = -1;

  currentPage: number = 1;
  rows: number = 10;

  categoryType!: any;
  
  categoryName!: any;
  cartTypes: any[] = CartTypes;
  openedCart: number = CartType.MyCart;

  amount?: number;

  categories: Category[] = [];

  stateOptions: any[] = [
    this.cartTypes[CartType.MyCart],
    this.cartTypes[CartType.OfficeCart]
  ];

  loadRequest: LoadRequest = {
    sortCategory: this.categoryType,
    sortField: 'name',
    sortOrder: 1
  }
  constructor(
    private categoryService: CategoryService,
    private itemService: ItemService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private cartService: CartService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private signalRService: SignalRService,
    private router: Router
  ){}

  ngOnInit(): void{

    this.loadCategories();
    this.reconnectionEmitter.subscribe((connId) => {
      this.signalRService.JoinGroups();
    })    
    this.signalRService.addReconnectedEventEmitter(this.reconnectionEmitter);
    this.signalRService.addDeletedOrderListener((data:any) => {this.deleteFunction(data)});
    this.signalRService.addNewOrderListener((data:any) => {this.newFunction(data)});
  }

  deleteFunction(data: any){
    var order = this.orderRequests?.findIndex(o => o.itemId == data.itemId);
    if(order != -1){
      if(this.orderRequests[order].amount == data.amount)
        delete this.orderRequests[order];
      else
        this.orderRequests[order].amount -= data.amount;
    }
  }

  newFunction(data: any){
    if(this.openedCart == this.officeCartType || (data.userId == this.storageService.getUserInfo()?.id)){
      this.loadOrderRequests();
    }
  }

  ngOnDestroy(): void {
    this.reconnectionEmitter.unsubscribe();
    this.signalRService.removeDeletedOrderListener();
    this.signalRService.removeNewOrderListener();
  }
  loadCategories(): void {
    this.categoryService.getAllCategories(this.loadRequest).subscribe({
      
      next: (response: any) => {
        if(response){
          this.categories = response.data;
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error')
        });
      }
    });
  }

  loadSnacks(event: TableLazyLoadEvent): void {
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
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error')
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
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error')
        });
      }
    });
  }

  loadOrderRequests(event?: TableLazyLoadEvent){
    let loadRequest: RequestOrderFilter = {
      pageIndex: event? event.first! / this.rows + 1 : 1,
      pageSize: this.rows,
      byOffice: this.openedCart == this.officeCartType? this.storageService.getUserInfo()?.office.id : -1,
      byUser: this.openedCart == this.myCartType? this.storageService.getUserInfo()?.id: -1
    }

    this.itemLoadingSubscription = this.cartService.getOrderRequests(loadRequest).subscribe({
      next: (response: any) => {
        if(response != null){
          this.orderRequests = response.data;
          this.totalRecords = response.totalRecords;
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error')
        });
      }
    });
  }

  loadItems(event: TableLazyLoadEvent){
    if(this.tableType == this.itemType){
      this.loadSnacks(event);
    }
    else{
      this.loadOrderRequests(event);
    }
  }

  openUpdateFields(row: number){
    this.openUpdate = row;
    if(this.tableType == this.myCartType){
      this.amount = this.orderRequests[row].amount;
    }
  }

  closeUpdate(row: number) {
    this.openUpdate = -1;
  }

  update(row: number) {
    let req: OrderRequest = {
      itemId: this.orderRequests[row].itemId,
      id: this.orderRequests[row].id,
      amount: this.amount!,
      officeId: this.orderRequests[row].officeId,
      userId: this.orderRequests[row].userId
    }
    this.cartService.updateCart(req).subscribe(res =>{
      this.orderRequests[row].amount = this.amount!;
      this.closeUpdate(row);
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('Common.Success')
      });
    })
  }

  addToCart(itemId: number, row: number) {
    if(this.amount != null && this.amount > 0){
      let req: OrderRequest = {
        itemId: itemId,
        amount: this.amount,
        userId: this.storageService.getUserInfo()!.id,
        officeId: this.storageService.getUserInfo()!.office.id
      }
      this.cartService.addToCart(req).subscribe((res)=>{
        if(res.status){
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Common.Success')
          });
          this.closeUpdate(row);
        }
      })
    }
  }

  delete(row:number){
    this.cartService.deleteOrder(this.orderRequests[row].id).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('Common.Success')
      });
      delete this.orderRequests[row];
    })
    
  }

  acceptOrder(){
    this.router.navigate(["/accept-order"],{queryParams: {email: this.storageService.getUserInfo()?.email, officeId: this.storageService.getUserInfo()?.office.id}});
  }
  userHR(){
    return this.storageService.getUserInfo()?.role == Role.HR;
  }
}
