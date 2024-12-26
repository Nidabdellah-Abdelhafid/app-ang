import { Router } from '@angular/router';
import { AccountService } from './../../services/account.service';
import { JwtTokenService } from './../../services/jwt-token.service';
import { User } from 'src/app/models/user';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit{
  
  userdataform= new FormGroup(
      {
        
        fullname: new FormControl('', [
          Validators.required,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      }
    )

  constructor(
    private userService:UserService,
    private jwtTokenService:JwtTokenService ,
     private router:Router,
    private accountService:AccountService
  ){

  }
 
  ngOnInit(): void {
    
  }

  register() {
    const formValue = this.userdataform.value as User;
    this.userService.addUser(formValue).subscribe({
      next: (res) => {
        
        this.userService.addRoleToUser({
          email: formValue.email,
          roleName: "USER"
        }).subscribe({
          next: (roleRes) => {
            this.handleResponse();  
          },
          error: (roleError) => {
            console.log("Role assignment failed:", roleError);
          }
        });
      },
      error: (error) => {
        console.log("User creation failed:", error);
      }
    });
  }
  

  handleResponse(){
    this.router.navigateByUrl("/login");
  }


}