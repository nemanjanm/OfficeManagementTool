import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { NewPasswordComponent } from './new-password/new-password.component';

@NgModule({
  declarations: [
    ProfilePageComponent,
    NewPasswordComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ProfilePageModule { }