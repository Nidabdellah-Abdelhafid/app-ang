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
  itemsPerPage: number = 6;
  totalPages: number = 0;
  isModalOpen: boolean = false;
  isLoading: boolean = false;
isAddLoading: boolean = false;

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

    this.themeForm.get('label')?.valueChanges.subscribe(value => {
      if (value) {
        const isDuplicate = this.checkDuplicateLabel(value, this.themeForm.get('id')?.value);
        if (isDuplicate) {
          this.themeForm.get('label')?.setErrors({ duplicate: true });
        }
      }
    });
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.clearInput();
    }
  }

  // Update getTheme method
  getTheme() {
    this.isLoading = true;
    this.themeService.getAll().subscribe({
      next: (res) => {
        this.listTheme = res;
        this.totalPages = Math.ceil(this.listTheme.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error fetching themes', err);
        this.listTheme = [];
        this.totalPages = 1;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  showTheme(theme: any) {
    // console.log('Show details for theme: ', theme);
  }

  editTheme(theme: any) {
    this.themeForm.patchValue(theme);
    this.toggleModal();
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
this.isAddLoading = true;
    if (this.themeForm.invalid) {
      return;
    }

    const theme = this.themeForm.value;

    if (theme.id) {
      this.themeService.update(theme).subscribe({
        next: (res) => {
          this.getTheme();
          this.toggleModal();
          Swal.fire({
            title: "Updated!",
            text: "Your item has been updated.",
            icon: "success"
          });
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error updating theme', err);
          alert('An error occurred while updating the theme.');
        }
      });
    } else {

      this.themeService.create(theme).subscribe({
        next: (res) => {
          this.getTheme();
          this.toggleModal();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "theme created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.themeForm.reset();
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error creating theme', err);
          alert('An error occurred while creating the theme.');
        }
      });
    }
  }

  checkDuplicateLabel(label: any, id: any): boolean {
    if (!this.listTheme || !label) {
      return false;
    }
    
    // If editing an existing theme, exclude it from the check
    return this.listTheme.some((theme: any) => 
      theme.label.toLowerCase() === label.toLowerCase() && theme.id !== id
    );
  }

  clearInput() {
    this.themeForm.reset()
  }
}
