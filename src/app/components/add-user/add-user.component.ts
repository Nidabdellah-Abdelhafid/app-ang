import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { JwtTokenService } from './../../services/jwt-token.service';
import { User } from 'src/app/models/user';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  
  emailUsed: any;
  userPhoto: File | null = null;
  filePreview: string | null = null; // To display image preview
  fileError: string | null = null;
  
  userdataform = new FormGroup({
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
    userPhoto: new FormControl(null,
      Validators.required
    ),
    telephone: new FormControl('', [
      Validators.required
    ]),
    pays: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userdataform.get('email')?.valueChanges.subscribe(() => {
      this.emailUsed = null; 
    });
  }

  register() {
    const formValue = this.userdataform.value as User;
    const formData = new FormData();
    
    formData.append('fullname', formValue.fullname);
    formData.append('email', formValue.email);
    formData.append('password', formValue.password);
    formData.append('telephone', formValue.telephone);
    formData.append('pays', formValue.pays);

    if (this.userPhoto) {
      formData.append('userPhoto', this.userPhoto, this.userPhoto.name);
    }
  
    this.userService.addUser(formData).subscribe({
      next: (res) => {
        this.userService.addRoleToUser({
          email: formValue.email,
          roleName: 'USER'
        }).subscribe({
          next: (roleRes) => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Badge created successfully!",
                showConfirmButton: false,
                timer: 1500
              });
            this.handleResponse();  
          },
          error: (roleError) => {
            console.log("Role assignment failed:", roleError);
          }
        });
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.emailUsed = 'Email is already in use';
        } else {
          alert('An unknown error occurred during user creation.');
        }
      }
    });
  }
  
  
  handleResponse() {
    this.router.navigateByUrl('/login');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 2 * 1024 * 1024; // Max size 2MB

      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Only JPG, JPEG, and PNG files are allowed.';
        this.userdataform.get('userPhoto')?.reset();
        this.filePreview = null;
        return;
      }

      if (file.size > maxSize) {
        this.fileError = 'File size must be less than 2MB.';
        this.userdataform.get('userPhoto')?.reset();
        this.filePreview = null;
        return;
      }

      this.fileError = null;

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
 
      this.userPhoto = file;  
    }
  }
  
  
  
}
