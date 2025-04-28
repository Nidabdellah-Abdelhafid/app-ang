import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtTokenService } from './../../services/jwt-token.service';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';  // Import ToastrService

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('flyInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate(300, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ])
  });

  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private jwtTokenService: JwtTokenService,
    private router: Router,
    private accountService: AccountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  login() {
    this.isLoading=true;

    const formValue = this.loginForm.value as { email: string, password: string };
    this.authService.login(formValue).subscribe({
      next: (res) => {
        this.handleResponse(res)
        this.isLoading=false;
      },
      error: (err) => {
        this.handleError(err)
       this.isLoading=false;
      }
    });
  }

  handleResponse(res: any) {
    if (res.status === 403) {
      this.errorMessage = 'Access Denied. Invalid credentials!';
      return;
    }
    this.jwtTokenService.handle(res);
    this.accountService.changeStatus(true);
    this.toastr.success('Login successful!', 'Welcome');  // Show success toast
    this.router.navigateByUrl("/home");
  }

  handleError(err: any) {
    if (err.status === 403) {
      this.errorMessage = 'Access Denied. Invalid credentials!';
      this.toastr.error('Access Denied. Invalid credentials!', 'Error');  // Show error toast
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
      this.toastr.error('An unexpected error occurred. Please try again.', 'Error');  // Show error toast
    }
    
  }
}
