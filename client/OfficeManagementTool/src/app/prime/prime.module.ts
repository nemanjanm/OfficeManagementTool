import { NgModule } from '@angular/core';
import {ButtonModule} from 'primeng/button'
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ToastModule } from "primeng/toast";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextModule } from 'primeng/inputtext';
import {ConfirmationService, MessageService} from "primeng/api";
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect'
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule} from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  providers:[
    MessageService,
    ConfirmationService,
    DialogService
  ],
  exports: [
    ButtonModule,
    MenuModule,
    MenubarModule,
    TieredMenuModule,
    SlideMenuModule,
    TableModule,
    DynamicDialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    PasswordModule,
    MultiSelectModule,
    TagModule,
    DropdownModule,
    InputNumberModule,
    FieldsetModule,
    TabViewModule,
    SelectButtonModule,
    FileUploadModule
  ]
})
export class PrimeModule { }
