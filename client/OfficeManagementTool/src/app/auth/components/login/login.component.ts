import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/app/models/LoginResponse';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  error: string = "";
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private fb: FormBuilder){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onSubmit(form: FormGroup): void{
    if(form.valid) {
      this.login(form.value.email, form.value.password);
    }
  }

  login(email: any, password: any): void{
    this.authService.login(email, password).subscribe(res => {
        if(res.status){
          this.storageService.setCredentials(res.data as LoginResponse);
          this.router.navigate(["/"]);
        }
        else{
          this.error="Invalid credentials.";
        }
    });
  }
}
