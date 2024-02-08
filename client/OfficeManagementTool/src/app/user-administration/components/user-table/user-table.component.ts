import { Component, OnInit } from '@angular/core';
import { EditUserFormComponent } from '../edit-user-form/edit-user-form.component';
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { UserService } from '../../services/user.service';
import { UserPagingFilters } from 'src/app/shared/models/user-paging-filters';
import { TableLazyLoadEvent } from 'primeng/table';
import { ROLES } from 'src/app/shared/enum/role';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {

  lastLazyLoadEvent!: TableLazyLoadEvent;
  ref: DynamicDialogRef | undefined;
  users : any[] = []
  totalRecords!: number;
  loading: boolean = false;
  rows: number = 10;
  search: string = '';
  currentPage: number = 1;

  modal: boolean = false;
  editing: boolean = false;
  deleting: boolean = false;
  modalTitle: string = '';

  roles = ROLES;

  officeId: number = -1;
  sortField: any = '';
  sortOrder: any = 1;

  officeLoadingSubscription!: Subscription;
  screenWidth: any;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private translateService: TranslateService
    ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  loadUsersOnSearchEvent(search: string): void
  {
    this.search = search.trim();
    this.loadUsersPage(this.lastLazyLoadEvent);
  }
  
  loadUsersPage(event: TableLazyLoadEvent): void
  {
    this.lastLazyLoadEvent = event;
    this.currentPage = event ? event!['first']! / this.rows + 1 : 1;
    this.sortField = event ? event!['sortField'] == undefined ? '' : event!['sortField'] : '';
    this.sortOrder = event ? event!['sortOrder'] : 1;
    this.officeLoadingSubscription = this.userService.usersPaging(new UserPagingFilters(this.search, this.currentPage, this.rows, this.officeId, this.sortField!, this.sortOrder)).subscribe({
      next: (res: any) => {
        this.users = res.data.data;
        this.totalRecords = res.data.totalRecords;
        if(!res.status)
        {
          this.messageService.add({
             severity: 'error',
            summary: this.translateService.instant('Common.Error'),
            detail: this.translateService.instant(res.errors[0])
          });
        }
      }
    });
  }

  editUser(user: any): void
  {
    const ref = this.dialogService.open(EditUserFormComponent,{
      header: `${this.translateService.instant('Common.Edit')} ${this.translateService.instant('User.Employee')}`,
      width: '500px',
      data: user
    });

    ref.onClose.subscribe((refresh: boolean) => {
      if(refresh)
      {
        this.refreshTable();
      }
    })
  }

  deleteUser(user: any): void
  {
    this.confirmationService.confirm({
      message: `${this.translateService.instant('User.DeleteConfirmDialog')} ${user.lastName} ${user.firstName}?`,
      accept: () => {
        this.userService.deleteUser(user.id).subscribe({
          next: (res) => {
            if(res.status)
            {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('User.EmployeeDeletedMessage')
              });
              this.refreshTable();
            }
            else
            {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant(res.errors[0])
              });
            }
          }
        });
      }
    });
  }

  addUser(): void
  {
    const ref = this.dialogService.open(EditUserFormComponent,{
      header: `${this.translateService.instant('Common.Add')} ${this.translateService.instant('User.Employee')}`,
      width: '500px',
      data: null
    });

    ref.onClose.subscribe((refresh: boolean) => {
      if(refresh)
      {
        this.loadUsersPage(this.lastLazyLoadEvent);
      }
    })
  }

  requestPasswordChange(user: any): void
  {
    this.confirmationService.confirm({
      message: `${this.translateService.instant('User.SendChangePassRequ')} ${user.lastName} ${user.firstName}?`,
      accept: () => {
        this.auth.sendResetPasswordRequest(user.email).subscribe({
          next: (res) => {
            if(res.status)
            {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('User.SuccPassChange')
              });
            }
            else
            {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant(res.errors[0])
              });
            }
          }
        });
      }
    });
  }

  refreshTable(): void
  {
    this.officeLoadingSubscription = this.userService.usersPaging(new UserPagingFilters(this.search, this.currentPage, this.rows, this.officeId, this.sortField!, this.sortOrder))
    .subscribe({
      next: (res: any) => {
        this.users = res.data.data;
        this.totalRecords = res.data.totalRecords;

        if(!res.status)
        {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Common.Error'),
            detail: this.translateService.instant(res.errors[0])
          });
        }
      }
    });
  }
}