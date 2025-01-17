import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from './../../../services/theme/theme.service';
import Swal from 'sweetalert2'
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css']
})
export class ThemeComponent implements OnInit {
  listTheme: any;
  page: number = 1;
  currentUser: any = null;
  isAdmin: boolean = false;
  constructor(
    private themeService: ThemeService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService
  ) { }

  themeForm = new FormGroup({
    id: new FormControl(null),
    label: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getTheme();
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN');
      }
    });
  }

  getTheme() {
    this.themeService.getAll().subscribe({
      next: (res) => {
        this.listTheme = res;
      },
      error: (err) => {
        console.error('Error fetching themes', err);
      }
    });
  }

  showTheme(theme: any) {
    console.log('Show details for theme');
  }

  editTheme(theme: any) {
    this.themeForm.setValue({
      id: theme.id,
      label: theme.label,
    });
  }


  deleteTheme(theme: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.themeService.delete(theme).subscribe({
          next: (res) => {
            this.getTheme();
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting theme', err);
            alert('An error occurred while deleting the theme.');
          }
        });

      }
    });


  }

  // Submit form to create or update theme
  submitForm() {
    if (this.themeForm.invalid) {
      return;
    }

    const theme = this.themeForm.value;

    if (theme.id) {
      this.themeService.update(theme).subscribe({
        next: (res) => {
          this.getTheme();
          Swal.fire({
            title: "Updated!",
            text: "Your item has been updated.",
            icon: "success"
          });
        },
        error: (err) => {
          console.error('Error updating theme', err);
          alert('An error occurred while updating the theme.');
        }
      });
    } else {

      this.themeService.create(theme).subscribe({
        next: (res) => {
          this.getTheme();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "theme created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.themeForm.reset();
        },
        error: (err) => {
          console.error('Error creating theme', err);
          alert('An error occurred while creating the theme.');
        }
      });
    }
  }

  clearInput() {
    this.themeForm.reset()
  }
}
