import { ChangeDetectorRef, Component, EventEmitter, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { BusyLoaderComponent } from 'src/app/shared/busy-loader/busy-loader.component';
import { Equipment } from 'src/app/shared/models/equipment';
import { EquipmentService } from '../../services/equipment.service';
import { TranslateService } from '@ngx-translate/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { EquipmentPagingFilter } from 'src/app/shared/models/equipment-paging-filter';
import { EquipmentFormComponent } from '../equipment-form/equipment-form.component';
import { UserService } from 'src/app/user-administration/services/user.service';
import { UserPagingFilters } from 'src/app/shared/models/user-paging-filters';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/models/user';
import { ActionResultResponse } from 'src/app/shared/models/action-result-response';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent {
  @Input() EquipmentChanged = new EventEmitter<any>();
  assignedEquipment:Equipment[] = [];
  unassignedEquipment:Equipment[] = [];
  ref: DynamicDialogRef | undefined;
  assignedsearchTerm: string = "";
  unassignedsearchTerm: string = "";
  assignedLastLazyLoadEvent: TableLazyLoadEvent | undefined ;
  unassignedLastLazyLoadEvent: TableLazyLoadEvent | undefined;
  busyLoader!: BusyLoaderComponent;

  unassignedEquipmentLoadingSubscription!: Subscription;
  assignedEquipmentLoadingSubscription!: Subscription

  assignedTotalRecords!: number;
  unassignedTotalRecords!: number;
  loading: boolean = false;
  assignedrows: number = 5;
  unassignedrows: number = 5;
  assignedcurrentPage: number = 1;
  unassignedcurrentPage: number = 1;
  assignedsortField: any = '';
  unassignedsortField: any = '';
  assignedsortOrder: any = 'asc';
  unassignedsortOrder: any = 'asc';
  selectedUser: User | null | undefined;
  userPagingFilter: UserPagingFilters | undefined;
  users: User[] | undefined;
  private subscription: Subscription;

  constructor(
    private equipmentService:EquipmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private translateService: TranslateService,
    private userService: UserService
  ){
    this.subscription = this.equipmentService.selectedUser$.subscribe(
      (user: User | null | undefined) => {
        this.selectedUser = user;
      }
    );
  }

  ngOnInit(): void{
    this.equipmentService.refreshRequired.subscribe(respone => {
      this.loadEquipment();
    })

    this.loadUsers();
  }

  onUserSelectionChange(user: User | null | undefined) {
    this.equipmentService.updateSelectedUser(user);
  }

  loadEquipment(event?: TableLazyLoadEvent): void {
    this.loading = true;
    
    if(event) {
      this.unassignedLastLazyLoadEvent = event;
    } else {
      event = this.unassignedLastLazyLoadEvent as TableLazyLoadEvent;
    }

    this.unassignedcurrentPage = event ? event!['first']! / this.unassignedrows + 1 : 1;
    this.unassignedsortField = event ? event!['sortField'] == undefined ? 'item' : event!['sortField'] : 'item';
    this.unassignedsortOrder = event ? event!['sortOrder'] : 'asc';

    let loadRequest = new EquipmentPagingFilter(
      this.unassignedcurrentPage, 
      this.unassignedrows, 
      this.unassignedsearchTerm, 
      0, 
      this.unassignedsortField!, 
      this.unassignedsortOrder,
      false)

    this.unassignedEquipmentLoadingSubscription = this.equipmentService.getAllPagedEquipment(loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.unassignedEquipment = response.data;
          this.unassignedTotalRecords = response.totalRecords;
          this.loading = false;
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch equipment.'
        });
      }
    });
  }

  loadAssignedEquipment(event: TableLazyLoadEvent | undefined): void {
    this.loading = true;
    
    if(event) {
      this.assignedLastLazyLoadEvent = event;
    } else {
      event = this.assignedLastLazyLoadEvent as TableLazyLoadEvent;
    }

    this.assignedcurrentPage = event ? event!['first']! / this.assignedrows + 1 : 1;
    this.assignedsortField = event ? event!['sortField'] == undefined ? 'item' : event!['sortField'] : 'item';
    this.assignedsortOrder = event ? event!['sortOrder'] : 'asc';

    let loadRequest = new EquipmentPagingFilter(
      this.assignedcurrentPage, 
      this.assignedrows, 
      this.assignedsearchTerm, 
      this.selectedUser?this.selectedUser.id:0, 
      this.assignedsortField!, 
      this.assignedsortOrder,
      true)

    this.assignedEquipmentLoadingSubscription = this.equipmentService.getAllPagedAssignedEquipment(loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          if(response.data[0].id!=null){
            this.assignedEquipment = response.data;
            this.assignedTotalRecords = response.totalRecords;
            this.loading = false;
          }
          
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.translateService.instant('Equipment.FailedToFetchEquipment')
        });
      }
    });
  }

  getAssignedItemsForUser(userId: number,user: User | null | undefined) {
    let loadRequest = new EquipmentPagingFilter(
      this.assignedcurrentPage, 
      this.assignedrows, 
      this.assignedsearchTerm, 
      userId, 
      this.assignedsortField!, 
      this.assignedsortOrder,
      true)
    this.assignedEquipmentLoadingSubscription = this.equipmentService.getAllPagedAssignedEquipment(loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.assignedEquipment = response.data;
          this.assignedTotalRecords = response.totalRecords;
          this.loading = false;
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.translateService.instant('Equipment.FailedToFetchEquipment')
        });
      }
    });
  }

  addEquipment(): void {
    const ref = this.dialogService.open(EquipmentFormComponent, {
      header: this.translateService.instant('Equipment.AddEquipment'),
      width: '400px',
      data: this.EquipmentChanged
    });

    ref.onClose.subscribe((Equipment: Equipment) => {
      if (Equipment) {
        Equipment.dateCreated = "0001-01-01T00:00:00";
        this.equipmentService.createEquipment(Equipment).subscribe(
          (response) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('Equipment.EquipmentAddedSuccessfully')
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant('Equipment.EquipmentItemCodeExists')
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Common.Error'),
              detail: this.translateService.instant('Equipment.FailedEquipmentAdd')
            });
          }
        );
      }
    });
  }

  deleteEquipment(Equipment: Equipment) {
    this.confirmationService.confirm({
      header: this.translateService.instant('Equipment.DeleteEquipment'),
      message: `${this.translateService.instant('Equipment.EquipmentDeleteConfirm')} ${Equipment.itemName}?`,
      dismissableMask:true,
      accept: () => {
        this.equipmentService.deleteEquipment(Equipment.id!).subscribe(
          (response) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('Equipment.EquipmentDeleteSucc')
              });
              this.loadEquipment();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant(response.errors)
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Common.Error'),
              detail: this.translateService.instant('Equipment.EquipmentDeleteFail')
            });
          }
        );
      }
    });
  }
  
  unassignItemFromUser(id: number, userId: number | undefined | null) {
    if(!userId)
    {
      this.equipmentService.unassignItemFromUser(id).subscribe(
        {
          next: (response: ActionResultResponse) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: this.translateService.instant('Equipment.UnassignEquipmentSucc')
              });
              this.loadEquipment(this.unassignedLastLazyLoadEvent);
              this.loadAssignedEquipment(this.assignedLastLazyLoadEvent);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add item. ' + response?.errors?.join(', ')
              });
            }
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.translateService.instant('Equipment.UnassignEquipmentFail')
            });
            this.loading = false;
          }
        });
    }
    else
    {
      this.equipmentService.unassignItemFromUser(id).subscribe(
        {
          next: (response: ActionResultResponse) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: this.translateService.instant('Equipment.UnassignEquipmentSucc')
              });
              this.loadEquipment(this.unassignedLastLazyLoadEvent);
              this.getAssignedItemsForUser(userId,null);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: this.translateService.instant('Equipment.UnassignEquipmentFail') + response?.errors?.join(', ')
              });
            }
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.translateService.instant('Equipment.UnassignEquipmentFail')
            });
            this.loading = false;
          }
        });
    }
  }

  private loadUsers(): void {
    
    this.userPagingFilter = {
      pageIndex: 1,
      pageSize: 10,
      search: "",
      sortField: "",
      sortOrder: 1,
      officeId: -1
    }

    this.userService.usersPaging(this.userPagingFilter).subscribe(
      {
        next: (response: any) => {
          this.users = response.data.data.map((user: any) => {
            return {
              ...user,
              displayLabel: user.firstName + " " + user.lastName
            };
          });
          this.changeDetectorRef.detectChanges();
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch users.'
          });
          this.loading = false;
        }
      }
    );
  }

  assignItemToUser(id: number, userId: number) {
    if (this.selectedUser) {
      this.equipmentService.assignItemToUser(id, userId).subscribe(
        {
          next: (response: ActionResultResponse) => {
            if (response.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: this.translateService.instant('Equipment.AssignEquipmentSucc')
              });
              this.loadEquipment(this.unassignedLastLazyLoadEvent);
              this.getAssignedItemsForUser(userId,null);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: this.translateService.instant('Equipment.AssignEquipmentFail') + response?.errors?.join(', ')
              });
            }
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.translateService.instant('Equipment.AssignEquipmentFail')
            });
            this.loading = false;
          }
        });
    }
  }

  public onClearHandler(): void { 
    this.loadAssignedEquipment(this.assignedLastLazyLoadEvent); 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}