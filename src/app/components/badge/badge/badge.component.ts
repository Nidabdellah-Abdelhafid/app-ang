import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BadgeService } from './../../../services/badge/badge.service';
import Swal from 'sweetalert2'
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent implements OnInit {
  listBadge: any;
  page: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  isModalOpen: boolean = false;
  currentUser: any = null;
  isAdmin: boolean = false;
  isLoading: boolean = false;
isAddLoading: boolean = false;
  
  constructor(private badgeService: BadgeService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService,
  ) {}

  badgeForm = new FormGroup({
    id: new FormControl(null), 
    label: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getBadge();
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN'); 
      }
    });

    this.badgeForm.get('label')?.valueChanges.subscribe(value => {
      if (value) {
        const isDuplicate = this.checkDuplicateLabel(value, this.badgeForm.get('id')?.value);
        if (isDuplicate) {
          this.badgeForm.get('label')?.setErrors({ duplicate: true });
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

  // Update getBadge method
  getBadge() {
    this.isLoading = true;
    this.badgeService.getAll().subscribe({
      next: (res) => {
        this.listBadge = res;
        this.totalPages = Math.ceil(this.listBadge.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error fetching badges', err);
        this.listBadge = [];
        this.totalPages = 1;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  showBadge(badge: any) {
    // console.log('Show details for badge');
  }

  editBadge(badge: any) {
    this.badgeForm.patchValue(badge);
    this.toggleModal();
  }

  deleteBadge(badge: any) {
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
        this.badgeService.delete(badge).subscribe({
          next:(res) => {
            this.getBadge(); 
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success"
            });
          },
          error:(err) => {
            console.error('Error deleting badge', err);
            alert('An error occurred while deleting the badge.');
          }
        } );
        
      }
    });


  }

  // Submit form to create or update badge
  submitForm() {
this.isAddLoading = true;
    if (this.badgeForm.invalid) {
      return;
    }

    const badge = this.badgeForm.value;

    if (badge.id) {
      this.badgeService.update(badge).subscribe({
        next: (res) => {
          this.getBadge(); 
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
          console.error('Error updating badge', err);
          alert('An error occurred while updating the badge.');
        }
      });
    } else {
      
      this.badgeService.create(badge).subscribe({
        next: (res) => {
          this.getBadge(); 
          this.toggleModal();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Badge created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.badgeForm.reset(); 
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error creating badge', err);
          alert('An error occurred while creating the badge.');
        }
      });
    }
  }

  checkDuplicateLabel(label: any, id: any): boolean {
    if (!this.listBadge || !label) {
      return false;
    }
    
    // If editing an existing badge, exclude it from the check
    return this.listBadge.some((badge: any) => 
      badge.label.toLowerCase() === label.toLowerCase() && badge.id !== id
    );
  }

  clearInput(){
    this.badgeForm.reset()
  }
}
