import { Component, EventEmitter} from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from 'src/app/auth/services/storage.service';
import { Report } from 'src/app/models/Report';
import { ReportService } from '../../services/report.service';
import { ReportStateConstants, ReportStates } from 'src/app/models/ReportStates';
import { Roles } from 'src/app/models/Roles';
import { TranslateService } from '@ngx-translate/core';
import { ReportCategoryConstants } from 'src/app/models/ReportCategories';

@Component({
  templateUrl: './report-dialog.component.html',
  providers: [DialogService]
})
export class ReportDialogComponent {

  report!: Report;
  uniqueStates!: any[];
  selectedState!: any;
  onChangedState = new EventEmitter<any>();
  reportCategoryConstants = ReportCategoryConstants;
  reportStateConstants = ReportStateConstants;

  constructor(
    public dialogService: DialogService, 
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private reportService: ReportService,
    private storageService: StorageService,
    private translateService: TranslateService) {}

  ngOnInit(): void {
    this.report = this.config.data.report;
    this.uniqueStates = this.config.data.states;
    this.selectedState = this.reportStateConstants[this.report.state];
  }

  save(): void{
    if(this.selectedState.value != this.report.state){
      this.report.state = this.selectedState.value;
      this.reportService.updateState(this.report).subscribe( res => {
        if(res.status){
          this.ref.close(this.report);
        }       
      })
    }
    this.ref.close(null);
  }

  userHR(): boolean{
    return this.storageService.getUserInfo()?.role == Roles.HR || this.storageService.getUserInfo()?.id == this.report.userId;
  }
}
