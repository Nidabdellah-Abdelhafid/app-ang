import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaysService } from './../../../services/pays/pays.service'; // Replace with your actual service
import Swal from 'sweetalert2'
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';

@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.css']
})
export class PaysComponent implements OnInit {
  listPays: any;
  page: number = 1;currentUser: any = null;
  isAdmin: boolean = false;

  constructor(private paysService: PaysService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService,) {}

  // Define form group with `id` as optional
  paysForm = new FormGroup({
    id: new FormControl(null), // `id` is optional for new countries
    label: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    continent: new FormControl('', [Validators.required]),
    latitude: new FormControl(null, [Validators.required]),
    longitude: new FormControl(null, [Validators.required]),
    reviews: new FormControl(null, [Validators.required])

  });

  ngOnInit(): void {
    this.getPays();this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN'); 
      }
    });
  }

  // Get all countries
  getPays() {
    this.paysService.getAll().subscribe({
      next: (res) => {
        this.listPays = res;
      },
      error: (err) => {
        console.error('Error fetching countries', err);
      }
    });
  }

  // Show country details
  showPays(pays: any) {
    console.log('Show details for country',pays);
  }

  // Edit country (open modal with country data)
  editPays(pays: any) {
    this.paysForm.setValue({
      id: pays.id,       
      image: pays.image, 
      label: pays.label, 
      description: pays.description,
      continent: pays.continent,
      latitude: pays.latitude,
      longitude: pays.longitude,
      reviews: pays.reviews
    });
  }

  // Delete country
  deletePays(pays: any) {
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
        this.paysService.delete(pays).subscribe({
          next: (res) => {
            this.getPays(); // Refresh the country list
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting country', err);
            alert('An error occurred while deleting the country.');
          }
        });
      }
    });
  }

submitForm() {
  if (this.paysForm.invalid) {
    return;
  }

  const pays = this.paysForm.value;

  if (pays.id) {
    this.paysService.update(pays).subscribe({
      next: (res) => {
        this.getPays(); // Refresh the country list
        Swal.fire({
          title: "Updated!",
          text: "Your item has been updated.",
          icon: "success"
        });
      },
      error: (err) => {
        console.error('Error updating country', err);
        alert('An error occurred while updating the country.');
      }
    });
  } else {
    this.paysService.create(pays).subscribe({
      next: (res) => {
        this.getPays(); // Refresh the country list
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Country created successfully!",
          showConfirmButton: false,
          timer: 1500
        });
        this.paysForm.reset(); // Reset form after successful submission
      },
      error: (err) => {
        console.error('Error creating country', err);
        alert('An error occurred while creating the country.');
      }
    });
  }
}


  clearInput() {
    this.paysForm.reset();
  }
}
