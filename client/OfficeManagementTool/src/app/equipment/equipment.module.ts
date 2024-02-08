import { NgModule } from '@angular/core';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { SharedModule } from '../shared/shared.module';
import { EquipmentFormComponent } from './components/equipment-form/equipment-form.component';

@NgModule({
  declarations: [
    EquipmentComponent,
    EquipmentFormComponent
  ],
  imports: [
    SharedModule
  ]
})
export class EquipmentModule { }