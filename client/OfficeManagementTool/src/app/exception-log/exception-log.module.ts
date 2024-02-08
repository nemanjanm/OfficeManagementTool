import { NgModule } from '@angular/core';
import { ExceptionComponent } from './components/exception/exception.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ExceptionComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ExceptionLogModule { }