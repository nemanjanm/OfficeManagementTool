import { ChangeDetectorRef, Component, EventEmitter, Input } from '@angular/core';
import { Office } from 'src/app/shared/models/office';
import { OfficeService } from '../../services/office.service';
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import  {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { OfficeFormComponent } from '../office-form/office-form.component';
import { LoadRequest } from 'src/app/shared/models/load-request';
import { Subscription } from 'rxjs';
import { BusyLoaderComponent } from 'src/app/shared/busy-loader/busy-loader.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService,DynamicDialogConfig]
})
export class OfficeComponent {
  @Input() officesChanged = new EventEmitter<any>();
  offices:Office[] = [];
  ref: DynamicDialogRef | undefined;
  searchTerm: string = "";
  config: DynamicDialogConfig | undefined;
  lastLazyLoadEvent: LazyLoadEvent | null = null;

  isLoading: boolean = false;
  busyLoader!: BusyLoaderComponent;
  officeLoadingSubscription!: Subscription;

  constructor(
    private officeService:OfficeService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private translateService: TranslateService
  ){}

  ngOnInit(): void{
    this.officeService.refreshRequired.subscribe(respone => {
      this.loadOffices();
    })
  }

  loadOffices(event?: any): void {
    if(event) {
      this.lastLazyLoadEvent = event;
    }
    let loadRequest: LoadRequest = {
      searchTerm: this.searchTerm,
      sortField: event?event.sortField:'name',
      sortOrder: event?event.sortOrder:'asc'
    }

    this.officeLoadingSubscription = this.officeService.getAllOffices(loadRequest).subscribe({
      next: (response: any) => {
        if(response){
          this.offices = response;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error'),
          detail: this.translateService.instant('Offices.FailedToFetchOffices')
        });
      }
    });
  }

  addOffice(): void {
    const ref = this.dialogService.open(OfficeFormComponent, {
      header: this.translateService.instant('Offices.AddOffice'),
      width: '400px',
      data: this.officesChanged
    });

    ref.onClose.subscribe((office: Office) => {
      if (office) {
        office.dateCreated = "0001-01-01T00:00:00";
        this.officeService.createOffice(office).subscribe(
          (response) => {
            if (!response.success) {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('Offices.OfficeAddedSuccessfully')
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant(response.errors[0])
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Common.Error'),
              detail: this.translateService.instant('Offices.FailedOfficeAdd')
            });
          }
        );
      }
    });
  }

  deleteOffice(office: Office) {
    this.confirmationService.confirm({
      header: this.translateService.instant('Offices.DeleteOffice'),
      message: `${this.translateService.instant('Offices.OfficeDeleteConfirm')} ${office.name}?`,
      dismissableMask:true,
      accept: () => {
        this.officeService.deleteOffice(office.id!).subscribe(
          (response) => {
            if (!response.success) {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Common.Success'),
                detail: this.translateService.instant('Offices.OfficeDeleteSucc')
              });
              this.loadOffices();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant(response.errors[0])
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Common.Error'),
              detail: this.translateService.instant('Offices.OfficeDeleteFail')
            });
          }
        );
      }
    });
  }

  updateOffice(office: Office) {
    const ref = this.dialogService.open(OfficeFormComponent, {
      header: this.translateService.instant('Offices.UpdateOffice'),
      width: '400px',
      data: {id: office.id,name: office.name,date: office.dateCreated}
    });
    ref.onClose.subscribe((updatedOffice: Office) => {
      if (updatedOffice) {
        updatedOffice.id=office.id;
        updatedOffice.dateCreated=office.dateCreated;
        this.officeService.updateOffice(updatedOffice).subscribe(
          (response) => {
            if (!response.success) {
                this.messageService.add({
                  severity: 'success',
                  summary: this.translateService.instant('Common.Success'),
                  detail: this.translateService.instant('Offices.UpdateOfficeSucc')
                });
            }else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Common.Error'),
                detail: this.translateService.instant(response.errors[0])
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Common.Error'),
              detail: this.translateService.instant('Offices.UpdateOfficeFail')
            });
          }
        );
      }
    });
  }
}