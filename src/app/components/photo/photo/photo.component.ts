import { ProgrammeService } from './../../../services/programme/programme.service';
import { PlaningService } from './../../../services/planing/planing.service';
import { PaysService } from './../../../services/pays/pays.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';  // Import necessary modules
import { PhotoService } from './../../../services/photo/photo.service';  // Ensure the correct path is used
import Swal from 'sweetalert2';
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  listPhoto: any;
  listPays: any;
  listPlaning: any;
  listProgramme: any;

  currentUser: any = null;
  isAdmin: boolean = false;
  page: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  isModalOpen = false;
  activeTab = 'country';
  currentForm: any = null;
  filterType: string = '';
  selectedPays: number | null = null;
  selectedPlaning: number | null = null;
  selectedProgramme: number | null = null;
  filteredPhotos: any;
  isLoading: boolean = false;

  // Define photoForm to handle form controls
  photoForm = new FormGroup({
    id: new FormControl(null),  // ID is optional when adding a new photo
    url: new FormControl('', [Validators.required]),
    pays: new FormControl(null, [Validators.required]),  // You can extend this with more validation if needed
    planing: new FormControl(null),
    programme: new FormControl(null)
  });

  photoFormPlaning = new FormGroup({
    id: new FormControl(null),  // ID is optional when adding a new photo
    url: new FormControl('', [Validators.required]),
    pays: new FormControl(null),  // You can extend this with more validation if needed
    planing: new FormControl(null, [Validators.required]),
    programme: new FormControl(null)
  });

  photoFormProgramme = new FormGroup({
    id: new FormControl(null),  // ID is optional when adding a new photo
    url: new FormControl('', [Validators.required]),
    pays: new FormControl(null),  // You can extend this with more validation if needed
    planing: new FormControl(null),
    programme: new FormControl(null, [Validators.required])
  });
  


  constructor(
    private photoService: PhotoService,
    private paysService:PaysService,
    private planingService:PlaningService,
    private programmeService:ProgrammeService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService,
  ) {}

  ngOnInit(): void {
    this.getPhoto();
    this.getPays();
    this.getPlaning();
    this.getProgramme();
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN'); 
      }
    });
    this.filteredPhotos = this.listPhoto || [];
  }

  filterPhotos() {
    if (!this.filterType) {
      this.filteredPhotos = this.listPhoto;
      return;
    }

    this.filteredPhotos = this.listPhoto.filter((photo:any) => {
      switch (this.filterType) {
        case 'pays':
          return this.selectedPays ? photo.pays?.id === this.selectedPays : true;
        case 'planing':
          return this.selectedPlaning ? photo.planing?.id === this.selectedPlaning : true;
        case 'programme':
          return this.selectedProgramme ? photo.programme?.id === this.selectedProgramme : true;
        default:
          return true;
      }
    });

    this.page = 1; // Reset to first page when filtering
    this.totalPages = Math.ceil(this.filteredPhotos.length / this.itemsPerPage);
  }

  clearFilters() {
    this.filterType = '';
    this.selectedPays = null;
    this.selectedPlaning = null;
    this.selectedProgramme = null;
    this.filteredPhotos = this.listPhoto;
    this.page = 1;
    this.totalPages = Math.ceil(this.listPhoto.length / this.itemsPerPage);
  }
  // Get all photos
  getPhoto() {
    this.isLoading = true;
    this.photoService.getAll().subscribe({
      next: (res) => {
        this.listPhoto = res;
        this.filteredPhotos = res;
        this.totalPages = Math.ceil(this.listPhoto.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error fetching photos', err);
        Swal.fire('Error', 'Failed to load photos', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.clearInput();
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    switch(tab) {
      case 'country':
        this.currentForm = this.photoForm;
        break;
      case 'planning':
        this.currentForm = this.photoFormPlaning;
        break;
      case 'program':
        this.currentForm = this.photoFormProgramme;
        break;
    }
  }

  getPays() {
    this.paysService.getAll().subscribe({
      next: (res) => {
        this.listPays = res;
      },
      error: (err) => {
        console.error('Error fetching photos', err);
      }
    });
  }

  getPlaning() {
    this.planingService.getAll().subscribe({
      next: (res) => {
        this.listPlaning = res;
      },
      error: (err) => {
        console.error('Error fetching planing', err);
      }
    });
  }

  getProgramme() {
    this.programmeService.getAll().subscribe({
      next: (res) => {
        this.listProgramme = res;
      },
      error: (err) => {
        console.error('Error fetching programme', err);
      }
    });
  }


  // Show photo details
  showPhoto(photo: any) {
    // console.log('Show details for photo', photo);
  }

  // Edit photo (open modal with photo data)
  editPhoto(photo: any) {
    if (photo.pays) {
      this.setActiveTab('country');
      this.photoForm.patchValue(photo);
    } else if (photo.planing) {
      this.setActiveTab('planning');
      this.photoFormPlaning.patchValue(photo);
    } else if (photo.programme) {
      this.setActiveTab('program');
      this.photoFormProgramme.patchValue(photo);
    }
    this.toggleModal();
  }

  // Delete photo
  deletePhoto(photo: any) {
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
        this.photoService.delete(photo).subscribe({
          next: (res) => {
            this.getPhoto(); // Refresh the photo list
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting photo', err);
            alert('An error occurred while deleting the photo.');
          }
        });
      }
    });
  }

  submitForm() {
    const formData = this.currentForm.value;
    
    if (!formData) {
      Swal.fire('Error', 'No valid form data provided.', 'error');
      return;
    }

    const operation = formData.id ? 
      this.photoService.update(formData) : 
      this.photoService.create(formData);

    operation.subscribe({
      next: (res) => {
        this.getPhoto();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Photo ${formData.id ? 'updated' : 'created'} successfully!`,
          showConfirmButton: false,
          timer: 1500
        });
        this.clearInput();
        this.toggleModal();
      },
      error: (err) => {
        console.error('Error with photo operation', err);
        Swal.fire('Error', `Failed to ${formData.id ? 'update' : 'create'} photo`, 'error');
      }
    });
  }
  

  clearInput() {
    this.photoForm.reset();
    this.photoFormPlaning.reset();
    this.photoFormProgramme.reset();
    this.setActiveTab('country');
  }
}
