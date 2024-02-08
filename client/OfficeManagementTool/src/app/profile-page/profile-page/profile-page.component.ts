import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StorageService } from 'src/app/auth/services/storage.service';
import { UserInfo } from 'src/app/models/UserInfo';
import { ProfilePageService } from '../services/profile-page.service';
import { ActionResultResponse } from 'src/app/models/ActionResultResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  user: UserInfo | null;
  onChangeInput = new EventEmitter<any>();
  valid: boolean = false;
  nameForm!: FormGroup;
  public loading: boolean = false;

  constructor(
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private profileService: ProfilePageService){
    this.user = this.storageService.getUserInfo();

    this.nameForm = this.formBuilder.group
    ({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    })
  }

  send() : any
  {
    this.loading = true;
    console.log(this.user)
    this.profileService.changeName(this.user!.id, this.nameForm.value.firstname, this.nameForm.value.lastname, this.user!.email, this.user!.office.id, this.user!.role).subscribe({
      next: (res: ActionResultResponse) => {
        this.loading = false;
        if(res && res.status){
          console.log(res)
          this.user!.id = res.data.id,
          this.user!.firstName = res.data.firstName,
          this.user!.lastName = res.data.lastName,
          this.user!.role = res.data.role,
          this.user!.email = res.data.email,
          this.user!.office.id = res.data.officeId,
          this.storageService.setUserInfo(this.user!)
          this.user = this.storageService.getUserInfo();
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
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'User.SuccPassChange'});
    setTimeout(() => 
    {
      this.router.navigate(['/']);
    },
    500);
  }

  showError()
  {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User.FailPassChange'});
  }
}
