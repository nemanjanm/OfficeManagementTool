import { NgModule } from '@angular/core';
import { ReportsComponent } from './components/reports/reports.component';
import { SharedModule } from '../shared/shared.module';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { OfficeAdministrationModule } from '../office-administration/office-administration.module';
import { AuthModule } from '../auth/auth.module';
import { ReportFormDialogComponent } from './components/report-form-dialog/report-form-dialog.component';
import { MyReportsComponent } from './components/my-reports/my-reports.component';
import { ReportService } from './services/report.service';

@NgModule({
  declarations: [
    ReportsComponent,
    ReportDialogComponent,
    ReportFormDialogComponent,
    MyReportsComponent
  ],
  imports: [
    SharedModule,
    OfficeAdministrationModule,
    AuthModule
  ],
  providers: [
    ReportService
  ]
})
export class ReportModule { }