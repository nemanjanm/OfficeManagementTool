import { Component, EventEmitter, Output } from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Office } from 'src/app/shared/models/office';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
  styleUrls: ['./office-form.component.scss'],
  providers: [DialogService, MessageService]
})
export class OfficeFormComponent {
  office: Office = {
    name: this.config.data.name,
    dateCreated: ''
  };
  onChangeInput = new EventEmitter<any>();
  valid: boolean = false;

  officeForm!: FormGroup;
  isUpdate: boolean = false;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.office.name = this.config.data.name
    this.initForm();
    this.populateForm();
  }

  private initForm(): void {
    this.officeForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  private populateForm(): void {
    const office: Office = this.config.data;
    if (office.id) {
      this.isUpdate = true;
      this.officeForm.patchValue(office);
    }
  }

  onSaveOffice(): void {
    if (this.officeForm.valid) {
      const updatedOffice: Office = {
        ...this.officeForm.value
      };
      this.ref.close(updatedOffice);
    } else {
      this.officeForm.markAllAsTouched();
    }
  }

  onCancelOfficeForm(): void {
    this.ref.close();
  }

  get name() {
    return this.officeForm.get('name');
  }
}
