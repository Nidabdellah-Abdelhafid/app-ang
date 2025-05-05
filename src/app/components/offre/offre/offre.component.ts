import { BadgeService } from './../../../services/badge/badge.service';
import { ThemeService } from './../../../services/theme/theme.service';
import { Component, OnInit } from '@angular/core';
import { OffreService } from './../../../services/offre/offre.service';
import { PaysService } from './../../../services/pays/pays.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';

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
  isLoading: boolean = false;
  isAddLoading: boolean = false;
  
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
      offreDayNumber: [null, [Validators.required]],
      pays: [null, [Validators.required]]
    });

    this.themeForm = this.fb.group({
      offre :[null,[Validators.required]],    
      theme: [[], [Validators.required]]
    });

    this.badgeForm = this.fb.group({
      offre :[null,[Validators.required]],
      badge: [[], [Validators.required]]
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
    this.isLoading = true;
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
      },
      complete: () => {
        this.isLoading = false;
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
    this.isAddLoading = true;
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
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
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
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error creating offer', err);
          alert('Error occurred while creating offer');
        }
      });
    }
  }

  submitTheme() {
    this.isAddLoading = true;

    if (this.themeForm.invalid) return;
  
    const selectedThemes = this.themeForm.get('theme')?.value;
    const offre = this.themeForm.get('offre')?.value;
  
    if (!selectedThemes || !offre) return;
  
    // Convert to array if it's not already
    const themesArray = Array.isArray(selectedThemes) ? selectedThemes : [selectedThemes];
  
    // Process each theme one by one
    let processed = 0;
    themesArray.forEach(theme => {
      const data = {
        offre: offre,
        theme: theme
      };
      
      this.offreService.addThemeToOffre(data).subscribe({
        next: () => {
          processed++;
          if (processed === themesArray.length) {
            this.getOffre();
            this.toggleThemeModal();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Themes added successfully!",
              showConfirmButton: false,
              timer: 1500
            });
            this.themeForm.reset();
          this.isAddLoading = false;

          }
        },
        error: (err) => {
        this.isAddLoading = false;

          console.error('Error adding theme', err);
          Swal.fire('Error', `Failed to add theme: ${theme.label}`, 'error');
        }
      });
    });
  }
  
  submitBadge() {
    this.isAddLoading = true;
    if (this.badgeForm.invalid) return;
  
    const selectedBadges = this.badgeForm.get('badge')?.value;
    const offre = this.badgeForm.get('offre')?.value;
  
    if (!selectedBadges || !offre) return;
  
    // Convert to array if it's not already
    const badgesArray = Array.isArray(selectedBadges) ? selectedBadges : [selectedBadges];
  
    // Process each badge one by one
    let processed = 0;
    badgesArray.forEach(badge => {
      const data = {
        offre: offre,
        badge: badge
      };
      
      this.offreService.addBadgeToOffre(data).subscribe({
        next: () => {
          processed++;
          if (processed === badgesArray.length) {
            this.getOffre();
            this.toggleBadgeModal();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Badges added successfully!",
              showConfirmButton: false,
              timer: 1500
            });
            this.badgeForm.reset();
            this.isAddLoading = false;
          }
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error adding badge', err);
          Swal.fire('Error', `Failed to add badge: ${badge.label}`, 'error');
        }
      });
    });
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
      offreDayNumber: offre.offreDayNumber,
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
    // console.log("selected :",offre);
    // Update the subscription handling
    this.offreService.getOffreBadges(offre.id).subscribe({
      next: (badges: any[]) => {
        this.offreBadges = badges;
        // console.log(this.offreBadges);
      },
      error: (err) => {
        console.error('Error fetching badges', err);
        this.offreBadges = [];
      }
    });

    this.offreService.getOffreThemes(offre.id).subscribe({
      next: (themes: any[]) => {
        this.offreThemes = themes;
        // console.log(this.offreThemes);
        this.toggleShowOffreModal();

      },
      error: (err) => {
        console.error('Error fetching themes', err);
        this.offreThemes = [];
      }
    });

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
