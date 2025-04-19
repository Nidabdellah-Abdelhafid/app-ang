import { BadgeService } from './../../../services/badge/badge.service';
import { ThemeService } from './../../../services/theme/theme.service';
import { Component, OnInit } from '@angular/core';
import { OffreService } from './../../../services/offre/offre.service';
import { PaysService } from './../../../services/pays/pays.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';
import { CeilPipe } from '../../../pipes/ceil.pipe';

@Component({
  selector: 'app-offre',
  templateUrl: './offre.component.html',
  styleUrls: ['./offre.component.css']
})
export class OffreComponent implements OnInit {

  listOffre: any;
  listPays: any;
  listTheme: any;
  listBadge: any;
  page: number = 1;
  offreForm: FormGroup;
  themeForm: FormGroup;
  badgeForm: FormGroup;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  currentUser: any = null;
  isAdmin: boolean = false;
  offreBadges: any[] = [];
  offreThemes: any[] = [];
  selectedOffre: any = null;
  isOfferModalOpen: boolean = false;
  isThemeModalOpen: boolean = false;
  isBadgeModalOpen: boolean = false;
  showOffreModal: boolean = false;
  filteredOffres: any;
  selectedPays: any = null;
  constructor(
    private offreService: OffreService,
    private paysService: PaysService,
    private fb: FormBuilder,
    private themeService:ThemeService,
    private badgeService:BadgeService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService,
  ) {
    this.offreForm = this.fb.group({
      id: [null],
      label: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      image: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      pays: [null, [Validators.required]]
    });

    this.themeForm = this.fb.group({
      offre :[null,[Validators.required]],    
      theme: [null, [Validators.required]]
    });

    this.badgeForm = this.fb.group({
      offre :[null,[Validators.required]],
      badge: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getOffre();
    this.getPays();
    this.getTheme();
    this.getBadge();
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN'); 
      }
    });
    this.filteredOffres = this.listOffre || [];
  }

  getOffre() {
    this.offreService.getAll().subscribe({
      next: (res) => {
        this.listOffre = [];
        this.listOffre = res;
        this.filteredOffres = res;
        this.calculateTotalPages();
      },
      error: (err) => {
        console.error('Error fetching offers', err);
        this.listOffre = [];
        this.filteredOffres = [];
        this.calculateTotalPages();
      }
    });
  }
  
  filterByPays() {
    if (!this.selectedPays) {
      this.filteredOffres = this.listOffre;
    } else {
      this.filteredOffres = this.listOffre.filter((offre:any) => 
        offre.pays?.id === this.selectedPays.id
      );
    }
    this.page = 1;
    this.calculateTotalPages();
  }

  clearFilter() {
    this.selectedPays = null;
    this.filteredOffres = this.listOffre;
    this.page = 1;
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    if (this.filteredOffres && this.filteredOffres.length > 0) {
      this.totalPages = Math.ceil(this.filteredOffres.length / this.itemsPerPage);
    } else {
      this.totalPages = 1;
    }
  }

  getTheme() {
    this.themeService.getAll().subscribe({
      next: (res) => {
        this.listTheme = res;
      },
      error: (err) => {
        console.error('Error fetching offers', err);
      }
    });
  }

  getBadge() {
    this.badgeService.getAll().subscribe({
      next: (res) => {
        this.listBadge = res;
      },
      error: (err) => {
        console.error('Error fetching offers', err);
      }
    });
  }

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

  submitForm() {
    if (this.offreForm.invalid) {
      return;
    }

    const offre = this.offreForm.value;
    if (offre.id) {
      this.offreService.update(offre).subscribe({
        next: (res) => {
          this.getOffre(); // Refresh the offer list
          this.toggleOfferModal();
          Swal.fire({
            title: "Updated!",
            text: "Your item has been updated.",
            icon: "success"
          });
        },
        error: (err) => {
          console.error('Error updating offer', err);
          alert('Error occurred while updating offer');
        }
      });
    } else {
      this.offreService.create(offre).subscribe({
        next: (res) => {
          this.getOffre(); // Refresh the offer list
          this.toggleOfferModal();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Offre created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.offreForm.reset(); // Reset form after successful submission
        },
        error: (err) => {
          console.error('Error creating offer', err);
          alert('Error occurred while creating offer');
        }
      });
    }
  }

  submitTheme() {
    if (this.themeForm.invalid) {
      return;
    }

    const data = this.themeForm.value;
    if(data.offre.id && data.theme.id){
      this.offreService.addThemeToOffre(data).subscribe({
        next: (res) => {
          this.getOffre(); // Refresh the offer list
          this.toggleThemeModal();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "add the to offre created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.themeForm.reset(); // Reset form after successful submission
        },
        error: (err) => {
          console.error('Error creating offer', err);
          alert('Error occurred while creating offer');
        }
      });
      
    }
  }

  submitBadge() {
    if (this.badgeForm.invalid) {
      return;
    }

    const data = this.badgeForm.value;

    // Your logic to add badge to offer
    if(data.offre.id && data.badge.id){
      this.offreService.addBadgeToOffre(data).subscribe({
        next: (res) => {
          this.getOffre(); // Refresh the offer list
          this.toggleBadgeModal();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "add the to badge created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.badgeForm.reset(); // Reset form after successful submission
        },
        error: (err) => {
          console.error('Error creating offer', err);
          alert('Error occurred while creating offer');
        }
      });

    }

  }

  clearInput() {
    this.offreForm.reset();
  }

  clearThemeInput() {
    this.themeForm.reset();
  }

  clearBadgeInput() {
    this.badgeForm.reset();
  }


  editOffre(offre: any) {
    this.offreForm.setValue({
      id: offre.id,
      label: offre.label,
      description: offre.description,
      price: offre.price,
      image: offre.image,
      latitude: offre.latitude,
      longitude: offre.longitude,
      pays: offre.pays
    });
  }

  deleteOffre(offre: any) {
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
        this.offreService.delete(offre).subscribe({
          next: () => {
            this.getOffre(); // Refresh the country list
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting offer', err);
            alert('Error occurred while deleting offer');
          }
        });
      }
    });
  }
  
  // Add these methods
  toggleOfferModal() {
    this.isOfferModalOpen = !this.isOfferModalOpen;
    if (!this.isOfferModalOpen) {
      this.clearInput();
    }
  }

  toggleThemeModal() {
    this.isThemeModalOpen = !this.isThemeModalOpen;
    if (!this.isThemeModalOpen) {
      this.clearThemeInput();
    }
  }

  toggleBadgeModal() {
    this.isBadgeModalOpen = !this.isBadgeModalOpen;
    if (!this.isBadgeModalOpen) {
      this.clearBadgeInput();
    }
  }

  showOffre(offre: any) {
    this.selectedOffre = offre;
    console.log("selected :",offre);
    // Update the subscription handling
    this.offreService.getOffreBadges(offre.id).subscribe({
      next: (badges: any[]) => {
        this.offreBadges = badges;
        console.log(this.offreBadges);
      },
      error: (err) => {
        console.error('Error fetching badges', err);
        this.offreBadges = [];
      }
    });

    this.offreService.getOffreThemes(offre.id).subscribe({
      next: (themes: any[]) => {
        this.offreThemes = themes;
        console.log(this.offreThemes);

      },
      error: (err) => {
        console.error('Error fetching themes', err);
        this.offreThemes = [];
      }
    });

    this.toggleShowOffreModal();
  }

  toggleShowOffreModal() {
    this.showOffreModal = !this.showOffreModal;
    if (!this.showOffreModal) {
      this.offreBadges = [];
      this.offreThemes = [];
      this.selectedOffre = null;
    }
  }
}
