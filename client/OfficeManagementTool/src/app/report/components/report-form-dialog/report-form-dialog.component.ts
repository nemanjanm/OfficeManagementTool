import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from 'src/app/auth/services/storage.service';
import { OfficeService } from 'src/app/office-administration/services/office.service';
import { Office } from 'src/app/shared/models/office';
import { ReportService } from '../../services/report.service';
import { ReportCreateRequest } from 'src/app/models/ReportCreateRequest';
import { ReportCategories } from 'src/app/models/ReportCategories';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './report-form-dialog.component.html',
  styleUrls: ['./report-form-dialog.component.scss'],
  providers: [DialogService]
})
export class ReportFormDialogComponent {

  reportForm!: FormGroup;
  categories!: any[];
  offices!: Office[];

  constructor(
    public dialogService: DialogService, 
    private fb: FormBuilder,
    private officeService: OfficeService,
    private storageService: StorageService,
    public config: DynamicDialogConfig,
    private reportService: ReportService,
    public ref: DynamicDialogRef,
    private translateService: TranslateService) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      description: [null, [Validators.required]],
      office: [null, Validators.required],
      category: [null, Validators.required]
    });

    this.officeService.getAllOffices({searchTerm: "", sortField: "", sortOrder: 1}).subscribe(res => {
      this.offices = res;
      const office = this.offices.find(office => office.id == this.storageService.getUserInfo()?.office.id);
      this.reportForm.get("officeId")?.reset(office, {});
    })

    this.categories = this.config.data.categories;
    console.log(this.categories)
  }

  onSubmit(form: FormGroup){
    let request: ReportCreateRequest  = {
      userId: this.storageService.getUserInfo()!.id,
      officeId: this.reportForm.value.office.id,
      description: this.reportForm.value.description,
      category: this.reportForm.value.category
    }
    this.reportService.insertReport(request).subscribe(res => {
      if(res.status){
        this.ref.close(true);
      }
    })
  }
}
