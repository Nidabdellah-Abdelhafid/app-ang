import { Component, OnInit } from '@angular/core';
import { ProgrammeService } from './../../../services/programme/programme.service';
import { PlaningService } from './../../../services/planing/planing.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';

@Component({
  selector: 'app-programme',
  templateUrl: './programme.component.html',
  styleUrls: ['./programme.component.css']
})
export class ProgrammeComponent implements OnInit {

  listProgramme: any;
  listProgrammeWidhDetails: any;
  listPlaning: any;
  page: number = 1;
  programmeForm: FormGroup;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  isModalOpen: boolean = false;
  filteredProgrammes: any;
  selectedPlaning: any = null;
  currentUser: any = null;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  constructor(
    private programmeService: ProgrammeService,
    private planingService: PlaningService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService,
  ) {
    this.programmeForm = new FormGroup({
      id: new FormControl(null),
      heure: new FormControl('', [Validators.required]),
      label: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      planing_programmes: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getProgramme();
    this.getPlaning();
    this.getProgrammeWithDetails();
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN'); 
      }
    });
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.clearInput();
    }
  }

  filterByPlaning() {
    if (!this.selectedPlaning) {
      this.filteredProgrammes = this.listProgramme;
    } else {
      this.filteredProgrammes = this.listProgramme.filter((programme:any) => 
        programme.planing_programmes?.id === this.selectedPlaning.id
      );
    }
    this.page = 1;
    this.totalPages = Math.ceil(this.filteredProgrammes.length / this.itemsPerPage);
  }

  clearFilter() {
    this.selectedPlaning = null;
    this.filteredProgrammes = this.listProgramme;
    this.page = 1;
    this.totalPages = Math.ceil(this.listProgramme.length / this.itemsPerPage);
  }

  // Update getProgramme method
  getProgramme() {
    this.isLoading = true;
    this.programmeService.getAll().subscribe({
      next: (res) => {
        this.listProgramme = res;
        this.filteredProgrammes = res;
        this.totalPages = Math.ceil(this.listProgramme.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error fetching programmes', err);
        this.listProgramme = [];
        this.filteredProgrammes = [];
        this.totalPages = 1;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  getProgrammeWithDetails() {
    this.programmeService.getProgrammeWithDetails().subscribe({
      next: (res) => {
        this.listProgrammeWidhDetails = res;
      },
      error: (err) => {
        console.error('Error fetching programmes', err);
      }
    });
  }

  getPlaning() {
    this.planingService.getAll().subscribe({
      next: (res) => {
        this.listPlaning = res;
      },
      error: (err) => {
        console.error('Error fetching planings', err);
      }
    });
  }

  submitForm() {
    if (this.programmeForm.invalid) {
      return;
    }

    const programme = this.programmeForm.value;
    // console.log('before Sending data:', programme);

    if (programme.id) {
      // console.log('Sending data:', programme);
      this.programmeService.update(programme).subscribe({
        next: (res) => {
          this.getProgramme(); // Refresh the programme list
          this.toggleModal(); // Close the modal after successful update
          Swal.fire({
            title: "Updated!",
            text: "Your programme has been updated.",
            icon: "success"
          });
        },
        error: (err) => {
          console.error('Error updating programme', err);
          alert('Error occurred while updating programme');
        }
      });
    } else {
      // console.log('Sending data:', programme);
      this.programmeService.create(programme).subscribe({
        next: (res) => {
          this.getProgramme(); // Refresh the programme list
          this.toggleModal(); // Close the modal after successful update
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Programme created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.programmeForm.reset(); // Reset form after successful submission
        },
        error: (err) => {
          console.error('Error creating programme', err);
          alert('Error occurred while creating programme');
        }
      });
    }
  }

  clearInput() {
    this.programmeForm.reset();
  }

  showProgramme(programme: any) {
    // console.log('Show details for programme', programme);
  }

  editProgramme(programme: any) {
    this.programmeForm.patchValue(programme);
    this.toggleModal();
  }

  deleteProgramme(programme: any) {
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
        this.programmeService.delete(programme).subscribe({
          next: () => {
            this.getProgramme(); // Refresh the programme list
            Swal.fire({
              title: "Deleted!",
              text: "Your programme has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting programme', err);
            alert('Error occurred while deleting programme');
          }
        });
      }
    });
  }
}
