import { Component, OnInit } from '@angular/core';
import { PlaningService } from './../../../services/planing/planing.service';
import { OffreService } from './../../../services/offre/offre.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';

@Component({
  selector: 'app-planing',
  templateUrl: './planing.component.html',
  styleUrls: ['./planing.component.css']
})
export class PlaningComponent implements OnInit {

  listPlaning: any;
  listOffre: any;
  page: number = 1;
  planingForm: FormGroup;

  currentUser: any = null;
  isAdmin: boolean = false;
  constructor(
    private planingService: PlaningService,
    private offreService: OffreService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService,
  ) {
    this.planingForm = new FormGroup({
      id: new FormControl(null),
      label: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      jourNumero: new FormControl('', [Validators.required]),
      offre: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getPlaning();
    this.getOffre();
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN'); 
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

  getOffre() {
    this.offreService.getAll().subscribe({
      next: (res) => {
        this.listOffre = res;
      },
      error: (err) => {
        console.error('Error fetching offers', err);
      }
    });
  }

  submitForm() {
    if (this.planingForm.invalid) {
      return;
    }

    const planing = this.planingForm.value;
    if (planing.id) {
      this.planingService.update(planing).subscribe({
        next: (res) => {
          this.getPlaning(); // Refresh the planing list
          Swal.fire({
            title: "Updated!",
            text: "Your item has been updated.",
            icon: "success"
          });
        },
        error: (err) => {
          console.error('Error updating planing', err);
          alert('Error occurred while updating planing');
        }
      });
    } else {
      this.planingService.create(planing).subscribe({
        next: (res) => {
          this.getPlaning(); // Refresh the planing list
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Planing created successfully!",
            showConfirmButton: false,
            timer: 1500
          });
          this.planingForm.reset(); // Reset form after successful submission
        },
        error: (err) => {
          console.error('Error creating planing', err);
          alert('Error occurred while creating planing');
        }
      });
    }
  }

  clearInput() {
    this.planingForm.reset();
  }

  showPlaning(planing: any) {
    console.log('Show details for planing', planing);
  }

  editPlaning(planing: any) {
    this.planingForm.setValue({
      id: planing.id,
      label: planing.label,
      description: planing.description,
      jourNumero: planing.jourNumero,
      offre: planing.offre
    });
  }

  deletePlaning(planing: any) {
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
        this.planingService.delete(planing).subscribe({
          next: () => {
            this.getPlaning(); // Refresh the planing list
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting planing', err);
            alert('Error occurred while deleting planing');
          }
        });
      }
    });
  }
}
