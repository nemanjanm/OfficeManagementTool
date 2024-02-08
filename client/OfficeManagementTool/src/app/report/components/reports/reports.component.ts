import { Component, EventEmitter, Input } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Report } from 'src/app/models/Report';
import { TableLazyLoadEvent } from 'primeng/table';
import { ReportCategories, ReportCategoryConstants } from 'src/app/models/ReportCategories';
import { ReportStateConstants, ReportStates } from 'src/app/models/ReportStates';
import { ReportFilterRequest } from 'src/app/models/ReportFilterRequest';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReportFormDialogComponent } from '../report-form-dialog/report-form-dialog.component';
import { BusyLoaderComponent } from 'src/app/shared/busy-loader/busy-loader.component';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from 'src/app/auth/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { SignalRService } from 'src/app/shared/signal-r.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class ReportsComponent {
  reports!: Report[];
  loading: boolean = false;
  totalRecords: number = 0;
  uniqueCategories: string[] = [];
  uniqueStates: string[] = [];
  nameSearch: string = "";
  officeSearch: string = "";
  descriptionSearch: string = "";
  selectedState?: any;
  selectedCategory?: any;
  filter: ReportFilterRequest = {};
  ref: DynamicDialogRef | undefined;
  sortBy: string = "";
  order: number = 0;
  busyLoader!: BusyLoaderComponent;
  reportsLoadingSubscription!: Subscription;
  rows: number = 10;
  @Input() userId?: number;
  reconnectionEmitter: EventEmitter<any> = new EventEmitter();

  reportCategoryConstants = ReportCategoryConstants;
  reportStateConstants = ReportStateConstants;

  constructor(
    private reportService: ReportService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private signalRService: SignalRService){}

  ngOnInit(): void {
    this.reports = [];
    for(let cat in ReportCategories){
      if(Number(cat) >= 0)
        this.uniqueCategories.push(ReportCategories[cat].replace("_"," "));
    }
    for(let cat in ReportStates){
      if(Number(cat) >= 0)
        this.uniqueStates.push(ReportStates[cat].replace("_"," "));
    }
    this.reconnectionEmitter.subscribe((connId) => {
      this.signalRService.JoinGroups();
    })    
    this.signalRService.addReconnectedEventEmitter(this.reconnectionEmitter);
    this.signalRService.addReportStateChangeListener((data: any) => {this.changeState(data)});
  }

  ngOnDestroy(): void {
    this.reconnectionEmitter.unsubscribe();
    this.signalRService.removeReportStateChangeListener();
  }

  changeState(report: Report): void {
    var r = this.reports.find(rep => rep.id == report.id)!;
    r.state = report.state;
  }


  loadReports(event?: TableLazyLoadEvent) {
    if(event){
      this.filterSearch(event);
      this.filter.first = event.first;
      this.filter.rows = event.rows!;
    }
    else{
      this.filterSearch();
    }

    if(this.userId != null) {
      this.filter.userId = this.userId;
    }    

    this.reportsLoadingSubscription = this.reportService.getAllReports(this.filter!).subscribe((res) => {
        this.reports = res.data.data;
        this.totalRecords = res.data.totalRecords;
        this.loading = false;
    });
  }

  filterSearch(event?: TableLazyLoadEvent){
    if(event){
      this.sortBy = event.sortField? event.sortField as string : this.sortBy;
      this.filter = {
        rows: this.rows,
        first: 0,
        sortBy: this.sortBy,
        order: event.sortOrder? event.sortOrder : undefined,
        searchDescription: this.descriptionSearch,
        searchOffice: this.officeSearch,
        searchUser: this.nameSearch,
        state: this.selectedState != undefined ? this.selectedState : -1, 
        category: this.selectedCategory != undefined ? this.selectedCategory.value : -1
      }
      if(event.sortField != null)
      this.order = this.filter.order!;
    }
    else{
      this.filter = {
        rows: this.rows,
        first: 0,
        sortBy: this.sortBy,
        order: this.order,
        searchDescription: this.descriptionSearch,
        searchOffice: this.officeSearch,
        searchUser: this.nameSearch,
        state: this.selectedState != undefined ? this.selectedState: -1, 
        category: this.selectedCategory != undefined ? this.selectedCategory.value : -1
      }
        
      if(this.userId != null) {
        this.filter.userId = this.userId;
      }
    }
  }

  openReportForm(){
    this.ref = this.dialogService.open(ReportFormDialogComponent,{header: this.translateService.instant('Reports.ReportPrompt'), data: { categories: this.reportCategoryConstants},dismissableMask:true});
    this.ref.onClose.subscribe(res => {
      if(res){
        this.loadReports()
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Common.Success')
        });
      }
    })
  }

  openReport(receivedReport: Report){
    this.ref = this.dialogService.open(ReportDialogComponent,{header: `#${receivedReport.id}`, width:'400px', data: {report: receivedReport, states: this.reportStateConstants},dismissableMask:true});

    this.ref.onClose.subscribe( (res: Report) => {
      if(res){
        let report = this.reports.find(x => x.id == res.id)!;
        report.state = res.state;
        report.stateName = ReportStates[res.state];
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Common.Success')
        });
      }
    })
  }

  getSeverity(state: number): string {
    switch(state){
      case Number(ReportStates.PENDING):
        return "info";
      case ReportStates.IN_PROGRESS:
        return "warning";
      case ReportStates.CANCELLED:
        return "danger";
      default:
        return "success";
    }
  }
}
