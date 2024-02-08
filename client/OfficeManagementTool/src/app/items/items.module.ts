import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ItemsComponent } from './components/items.component';
import { ItemFormComponent } from './components/item-form/item-form.component';



@NgModule({
  declarations: [
    ItemsComponent,
    ItemFormComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ItemsModule { }
