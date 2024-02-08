import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangePassword } from 'src/app/shared/models/change-password';
import { ChangePasswordHelp } from 'src/app/shared/models/change-pass-help';
import { EmailService } from '../../services/email.service';
import { ActionResultResponse } from 'src/app/shared/models/action-result-response';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [MessageService]
})
export class ChangePasswordComponent implements OnInit{

  public loading: boolean = false;
  public token: string = "";
  public forSend!: ChangePassword;
  public model!: ChangePasswordHelp;
  passForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private emailservice: EmailService, 
    private router: Router,
    private messageService: MessageService, ){}

  ngOnInit(): void {
    this.passForm = this.formBuilder.group
    ({
      password: new FormControl('', Validators.compose ([Validators.required])),
      repeatpassword : new FormControl('', Validators.compose ([Validators.required]))
    },
    {
      validators: this.passwordMatching("password", "repeatpassword")
    })

    this.route.queryParams.subscribe(queryParam =>{
      this.token = queryParam['token'];
    })
  }

  get formControls() : any
  {
    return this.passForm.controls;
  }

  passwordMatching(password: any, repeatpassword: any): any
  {
    return (formGroup: FormGroup) => {
      const passwordcontrol = formGroup.controls[password];
      const repeatpasswordcontrol = formGroup.controls[repeatpassword];

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
    this.model = this.passForm.value;
    this.forSend = { 
      password: this.model.password,
      token: this.token
    };
    
    this.emailservice.changePassword(this.forSend).subscribe({
      next: (res: ActionResultResponse) => {
        this.loading = false;
        if(res && res.status){
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
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Password changed successfully. You\'ll be redirected to login'});
    setTimeout(() => 
    {
      this.router.navigate(['/login']);
    },
    2000);
  }

  showError()
  {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong'});
  }
}
