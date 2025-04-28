import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  
  isModalOpen: boolean = false;
  isloading: boolean = false;
  editForm!: FormGroup;
  authUser: any;
  filePreview: string | null = null; // To display image preview
  fileError: string | null = null;
  imagePreview: string | null = null;
  isUpLoading: boolean = false;
  constructor(
    private authService: AuthService,
    public _sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  private initForm() {
    this.editForm = this.fb.group({
      fullname:  new FormControl('', [
        Validators.required,
      ]),
      telephone: new FormControl('', [
        Validators.required,
      ]),
      pays: new FormControl('', [
        Validators.required,
      ]),
      userPhoto: [null]
    });
  }

  ngOnInit(): void {
    this.isloading= true;
    this.authService.getAuthUser().subscribe(res => {
      this.authUser = res;
      this.isloading= false;
    });
  }

  getProfile(){
    try{
      this.isloading= true;
      this.authService.getAuthUser().subscribe(res => {
        this.authUser = res;
        this.isloading= false;
      });

    }catch(err){
        throw Error("User data not found!!");
    }finally{
      this.isloading= false;
    }
    
  }

  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }

  openEditModal() {
    this.editForm.patchValue({
      fullname: this.authUser.fullname,
      telephone: this.authUser.telephone,
      pays: this.authUser.pays
    });
    this.isModalOpen = true;
  }

  closeEditModal() {
    this.initForm();
    this.isModalOpen = false;
  }


  onFileSelected(event: any) {
    let file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 2 * 1024 * 1024; // Max size 2MB

      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Only JPG, JPEG, and PNG files are allowed.';
        this.editForm.get("userPhoto")?.reset();
        this.filePreview = null;
        this.imagePreview = null;
        return;
      }

      if (file.size > maxSize) {
        this.fileError = 'File size must be less than 2MB.';
        this.editForm.get("userPhoto")?.reset();
        this.filePreview = null;
        this.imagePreview = null;
        return;
      }

      this.fileError = null;

      // Create two readers: one for preview, one for form data
      const previewReader = new FileReader();
      const dataReader = new FileReader();

      // Handle preview
      previewReader.onload = () => {
        this.imagePreview = previewReader.result as string;
      };
      previewReader.readAsDataURL(file);

      // Handle form data
      dataReader.onload = () => {
        const arrayBuffer = dataReader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        this.editForm.patchValue({
          userPhoto: Array.from(bytes)
        });
      };
      dataReader.readAsArrayBuffer(file);
    }
  }

  onSubmit() {
    this.isUpLoading=true;
    if (this.editForm.valid) {
      const updatedUser = {
        ...this.authUser,
        ...this.editForm.value
      };
      
      this.authService.updateUser(updatedUser.id, updatedUser).subscribe({
        next: (response) => {
          this.authUser = response;
          this.closeEditModal();
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated!',
            text: 'Your profile has been successfully updated.',
            timer: 1500,
            showConfirmButton: false
          });
          this.isUpLoading=false;
        },
        error: (error) => {
          this.isUpLoading=false;

          console.error('Error updating user:', error);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Failed to update profile. Please try again.',
          });
        },
      });
    }
  }

  removeImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.imagePreview = null;
    this.editForm.get('userPhoto')?.setValue(null);

  }

}
