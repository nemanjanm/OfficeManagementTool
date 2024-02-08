import { NgModule } from '@angular/core';
import { UserTableComponent } from './components/user-table/user-table.component';
import { SharedModule } from '../shared/shared.module';
import { EditUserFormComponent } from './components/edit-user-form/edit-user-form.component';

@NgModule({
  declarations: [
    UserTableComponent,
    EditUserFormComponent
  ],
  imports: [
    SharedModule
  ]
})
export class UserAdministrationModule { }