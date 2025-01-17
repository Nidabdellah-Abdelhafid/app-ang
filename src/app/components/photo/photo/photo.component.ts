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
  }

  
  // Get all photos
  getPhoto() {
    this.photoService.getAll().subscribe({
      next: (res) => {
        this.listPhoto = res;
      },
      error: (err) => {
        console.error('Error fetching photos', err);
      }
    });
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
    console.log('Show details for photo', photo);
  }

  // Edit photo (open modal with photo data)
  editPhoto(photo: any) {
    this.photoForm.setValue({
      id: photo.id,
      url: photo.url,
      pays: photo.pays,  // Include the nested pays object
      planing: photo.planing,
      programme: photo.programme
    });
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
    // Handle form submission for creating or updating photos
    const photo = this.photoForm.value;
    const photoFormPlaning = this.photoFormPlaning.value;
    const photoFormProgramme = this.photoFormProgramme.value;
  
    // Check for photo, photoFormPlaning, or photoFormProgramme and handle accordingly
    let formData: any = null;
  
    if (photo.pays != null) {
      formData = photo; // Use photo data if pays is provided
    } else if (photoFormPlaning.planing != null) {
      formData = photoFormPlaning; // Use photoFormPlaning data if planingpl is provided
    } else if (photoFormProgramme.programme != null) {
      formData = photoFormProgramme; // Use photoFormProgramme data if programmepr is provided
    }
  
    // If no valid form data is provided, return early
    if (!formData) {
      alert('No valid form data provided.');
      return;
    }

    console.log("formData : " ,formData)
  
    // Determine whether to create or update based on the ID
    if (formData.id) {
      console.log(`${formData} aft : `, formData);
      // Update existing photo or other form data
      this.photoService.update(formData).subscribe({
        next: (res) => {
          this.getPhoto(); // Refresh the photo list
          Swal.fire({
            title: "Updated!",
            text: "Your item has been updated.",
            icon: "success"
          });
        },
        error: (err) => {
          console.error('Error updating photo', err);
          alert('An error occurred while updating the photo.');
        }
      });
    } else {
      // Create new photo or other form data
      this.photoService.create(formData).subscribe({
        next: (res) => {
          this.getPhoto(); // Refresh the photo list
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Photo created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.photoForm.reset(); // Reset form after successful submission
          this.photoFormPlaning.reset(); // Reset form after successful submission
          this.photoFormProgramme.reset(); // Reset form after successful submission
        },
        error: (err) => {
          console.error('Error creating photo', err);
          alert('An error occurred while creating the photo.');
        }
      });
    }
  }
  

  clearInput() {
    // Reset form fields when modal is closed
    this.photoForm.reset();
  }
}
