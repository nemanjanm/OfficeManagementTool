import { NgModule } from '@angular/core';
import { OfficeComponent } from './components/office/office.component';
import { OfficeService } from './services/office.service';
import { SharedModule } from '../shared/shared.module';
import { OfficeFormComponent } from './components/office-form/office-form.component';

@NgModule({
  declarations: [
    OfficeComponent,
    OfficeFormComponent
  ],
  imports: [
    SharedModule
  ],
  providers:[
    OfficeService
  ]
})
export class OfficeAdministrationModule { }
