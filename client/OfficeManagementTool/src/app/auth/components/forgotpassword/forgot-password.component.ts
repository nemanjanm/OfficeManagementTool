import { Component } from '@angular/core';
import { FormBuilder, NgForm , FormGroup, FormControl, Validators } from "@angular/forms";
import { EmailService } from '../../services/email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionResultResponse } from 'src/app/shared/models/action-result-response';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-resetpassmailpage',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService]
})
export class ForgotPasswordComponent {

  resetForm : any = this.formBuilder.group
  ({
    email: new FormControl('', Validators.compose ([Validators.required, Validators.email]))
  })

  email: any;
  response: any; 
  public loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private emailservice: EmailService, 
    private messageService: MessageService, 
    private router: Router){}

  submit(): void {
    this.loading = true;
    this.email = this.resetForm.value;
    this.emailservice.sendEmail(this.email.email).subscribe({
      next: (res: ActionResultResponse) => {
        this.loading = false;
        if(res && res.status) {
          this.show();
        } 
        else {
          this.showError();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.showError();
      }
    })
  }

  show() : void {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Email successfully sent. You\'ll be redirected'});
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