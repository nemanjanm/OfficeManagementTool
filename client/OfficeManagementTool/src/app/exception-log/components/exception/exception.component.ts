import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BusyLoaderComponent } from 'src/app/shared/busy-loader/busy-loader.component';
import { ExceptionLog } from 'src/app/shared/models/exception-log';
import { ExceptionService } from '../../services/exception.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { ExceptionPagingFilter } from 'src/app/shared/models/exception-paging-filter';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss']
})
export class ExceptionComponent {
  exceptions:ExceptionLog[] = [];
  lastLazyLoadEvent: TableLazyLoadEvent | null = null;
  searchTerm: string = "";
  isLoading: boolean = false;
  busyLoader!: BusyLoaderComponent;
  exceptionLoadingSubscription!: Subscription;
  ref: DynamicDialogRef | undefined;
  dialogService: any;
  totalRecords!: number;
  loading: boolean = false;
  rows: number = 5;
  currentPage: number = 1;
  sortField: any = '';
  sortOrder: any = 'asc';
  myNavigator = navigator;

  constructor(
    private exceptionService:ExceptionService,
    private messageService: MessageService,
    private translateService: TranslateService
  ){}

  ngOnInit(): void{
  }

  loadExceptions(event?: TableLazyLoadEvent): void {
    this.loading = true;
    
    if(event) {
      this.lastLazyLoadEvent = event;
    } else {
      event = this.lastLazyLoadEvent as TableLazyLoadEvent;
    }

    this.currentPage = event ? event!['first']! / this.rows + 1 : 1;
    this.sortField = event ? event!['sortField'] == undefined ? 'time' : event!['sortField'] : 'time';
    this.sortOrder = event ? event!['sortOrder'] : 'asc';

    let loadRequest = new ExceptionPagingFilter(this.currentPage, this.rows, this.searchTerm, this.sortField!, this.sortOrder)

    console.log("loadExceptions")
    this.exceptionLoadingSubscription = this.exceptionService.getAllExceptions(loadRequest).subscribe({//{ lazyEvent: JSON.stringify(event) }
      next: (response: any) => {
        if(response){
          console.log(response.data)
          this.exceptions = response.data;
          this.totalRecords = response.totalRecords;
          this.loading = false;
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Common.Error'),
          detail: this.translateService.instant('Exceptions.FailedFetch')
        });
      }
    });
  }
}