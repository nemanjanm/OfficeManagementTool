import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Equipment } from 'src/app/shared/models/equipment';
import { EquipmentService } from '../../services/equipment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemWithCategory } from 'src/app/shared/models/item-with-category';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.scss']
})
export class EquipmentFormComponent {
  equipmentForm!: FormGroup;
  items: ItemWithCategory[] = [];
  equipment!: Equipment;
  totalRecords!: number;
  
  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadItems();
  }

  private loadItems(): void {
    this.equipmentService.getEquipmentItems().subscribe(
    {
      next: (response: any) => {
        this.items = response.data.data;
          this.totalRecords = response.totalRecords;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch items.'
     });
      }
    }
    )
  }

  private initForm(): void {
    this.equipmentForm = this.formBuilder.group({
      itemCode: ['', Validators.required],
      itemId: new FormControl('', Validators.required)
    });
  }

  saveEquipment(): void {
    if (this.equipmentForm.valid) {
      const updatedEqip: Equipment = {
        ...this.equipmentForm.value
      };

      this.ref.close(updatedEqip);
    }
    else {
      this.equipmentForm.markAllAsTouched();
    }
  }

  cancel() {
    this.ref.close();
  }
}