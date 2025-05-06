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
  isPaysModalOpen: boolean = false;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  isLoading: boolean = false;
isAddLoading: boolean = false;

  constructor(private paysService: PaysService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService,) {}

  // Define form group with `id` as optional
  paysForm = new FormGroup({
    id: new FormControl(null), // `id` is optional for new countries
    label: new FormControl('', [Validators.required]),
    subTitle: new FormControl('', [Validators.required]),
    imageDes: new FormControl('', [Validators.required]), 
    image: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    continent: new FormControl('', [Validators.required]),
    latitude: new FormControl(null, [Validators.required]),
    longitude: new FormControl(null, [Validators.required]),
    reviews: new FormControl(null, [Validators.required]),
    visa: new FormControl(false),
    dureeDuVol: new FormControl('', [Validators.required]),
    heureLocale: new FormControl('', [Validators.required]),
    monnaieLocale: new FormControl('', [Validators.required]),
    langueParlee: new FormControl('', [Validators.required]),
    vaccinsNecessaires: new FormControl(false),
    mapImage: new FormControl('', [Validators.required]),
    january: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    february: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    march: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    april: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    may: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    june: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    july: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    august: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    september: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    october: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    november: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
    december: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)])
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
    this.isLoading = true;
    this.paysService.getAll().subscribe({
      next: (res) => {
        this.listPays = res;
        this.totalPages = Math.ceil(this.listPays.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error fetching countries', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Show country details
  showPays(pays: any) {
    // console.log('Show details for country',pays);
  }

  // Edit country (open modal with country data)
  editPays(pays: any) {
    this.paysForm.setValue({
      id: pays.id,       
      image: pays.image, 
      label: pays.label, 
      subTitle: pays.subTitle,
      imageDes: pays.imageDes, 
      description: pays.description,
      continent: pays.continent,
      latitude: pays.latitude,
      longitude: pays.longitude,
      reviews: pays.reviews,
      visa: pays.visa,
      dureeDuVol: pays.dureeDuVol,
      heureLocale: pays.heureLocale,
      monnaieLocale: pays.monnaieLocale,
      langueParlee: pays.langueParlee,
      vaccinsNecessaires: pays.vaccinsNecessaires,
      mapImage: pays.mapImage,
      january: pays.january || 1,
      february: pays.february || 1,
      march: pays.march || 1,
      april: pays.april || 1,
      may: pays.may || 1,
      june: pays.june || 1,
      july: pays.july || 1,
      august: pays.august || 1,
      september: pays.september || 1,
      october: pays.october || 1,
      november: pays.november || 1,
      december: pays.december || 1
    });
  }
  toggleModal() {
    this.isPaysModalOpen = !this.isPaysModalOpen;
    if (!this.isPaysModalOpen) {
      this.clearInput();
    }
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
this.isAddLoading = true;
  if (this.paysForm.invalid) {
    return;
  }

  const pays = this.paysForm.value;
  // console.log(pays);
  if (pays.id) {
    this.paysService.update(pays).subscribe({
      next: (res) => {
        this.getPays();
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
        console.error('Error updating country', err);
        alert('An error occurred while updating the country.');
      }
    });
  } else {
    this.paysService.create(pays).subscribe({
      next: (res) => {
        this.getPays(); 
        this.toggleModal();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Country created successfully!",
          showConfirmButton: false,
          timer: 1500
        });
        this.paysForm.reset(); // Reset form after successful submission
        this.isAddLoading = false;
      },
      error: (err) => {
        this.isAddLoading = false;
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
