import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { ROLES } from 'src/app/shared/enum/role';
import { OfficeService } from '../../services/office.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.scss']
})
export class EditUserFormComponent implements OnInit {

  editUserForm!: FormGroup;

  offices: any[] | undefined;
  officeId: number = 0;

  roles: any[] | undefined;
  role: number = 2;

  id: number = 0;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder, 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private messageService: MessageService,
    private office: OfficeService,
    private userService: UserService,
    private translateService: TranslateService
    ) {}

  ngOnInit(): void {

    this.roles = ROLES;

    this.loadOffices();
    this.initForm();
    this.populateForm()
  }

  private initForm(): void
  {
    this.editUserForm = this.fb.group({
      id: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['',[Validators.required, Validators.pattern(/^([a-zA-Z0-9]+)@(inovatec.ca)$/)]],
      role: ['', Validators.required],
      officeId: ['', Validators.required]
    });
  }

  private populateForm(): void
  {
    const user = this.config.data;
    if(user != null)
    {
      this.id = user.id;
      this.officeId = user.office.id;
      this.role = user.role;
      this.editUserForm.patchValue(user);
      this.isEditing = true;
    }
  }

  private loadOffices(): void
  {
    this.office.getAllOffices().subscribe({
      next:(res) => {
        this.offices = res;
      }
    })
  }

  onSubmit(): void
  {
    if(this.editUserForm.valid)
    {
      const updateUser: User ={
        ...this.editUserForm.value
      };

      if(this.isEditing)
      {
        this.editUser(updateUser);
      }
      else
      {
        this.addUser(updateUser);
      }
    }
    else
    {
      this.editUserForm.markAllAsTouched();
    }
  }

  closeEdit(): void
  {
    this.isEditing = false;
    this.ref.close(false);
  }

  editUser(user: any): void
  {
    this.userService.updateUser(user).subscribe({
      next:(res) => {
        if(res.status)
        {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Common.Success'),
            detail: this.translateService.instant('User.EmployeeUpdatedMessage')
          });
          this.isEditing = false;
          this.ref.close(true);
        }
        else
        {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Common.Error'),
            detail: this.translateService.instant(res.errors[0])
          });
        }
      }
    })
  }

  addUser(user: any): void
  {
    this.userService.addUser(user).subscribe({
      next:(res) => {
        if(res.status)
        {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Common.Success'),
            detail: this.translateService.instant('User.EmployeeAddedMessage')
          });
          this.ref.close(true);
        }
        else
        {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Common.Error'),
            detail: this.translateService.instant(res.errors[0])
          });
        }
      }
    })
  }
}