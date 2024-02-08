import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { ProfilePageService } from '../services/profile-page.service';
import { UserInfo } from 'src/app/models/UserInfo';
import { StorageService } from 'src/app/auth/services/storage.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {
  user: UserInfo | null | undefined;
  public loading: boolean = false;
  passForm!: FormGroup;

  constructor(
    private storageService: StorageService,
    private profileService: ProfilePageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService){}

  ngOnInit(): void {
    this.user = this.storageService.getUserInfo();

    this.passForm = this.formBuilder.group
    ({
      newPassword: ['', Validators.required],
      oldPassword: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    },
    {
      validators: this.passwordMatching()
    })
  }

  get formControls() : any
  {
    return this.passForm.controls;
  }

  passwordMatching(): any
  {
    return (formGroup: FormGroup) => {
      const passwordcontrol = formGroup.controls["newPassword"];
      const repeatpasswordcontrol = formGroup.controls["repeatPassword"];

      if(repeatpasswordcontrol.errors && !repeatpasswordcontrol.errors['passwordMatching']){
        return;
      }

      if(passwordcontrol.value !== repeatpasswordcontrol.value){
        repeatpasswordcontrol.setErrors({ passwordMatching: true});
      }
      else{
        repeatpasswordcontrol.setErrors(null);
      }
    }
  }

  send() : any
  {
    this.loading = true;

    let newPassword = this.passForm.controls["newPassword"].value;
    let oldPassword = this.passForm.controls["oldPassword"].value;

    this.profileService.changePassword(this.user!, newPassword, oldPassword).subscribe({
      next: (res: ActionResultResponse) => {
        this.loading = false;
        if(res){
          this.show();
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.showError();
      }
    });
  }

  show() : void {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Password changed successfully.'});
    setTimeout(() => 
    {
      this.router.navigate(['/profile-page']);
    },
    500);
  }

  showError()
  {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong'});
  }
}