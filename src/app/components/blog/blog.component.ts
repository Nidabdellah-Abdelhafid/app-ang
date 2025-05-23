import { BlogService } from './../../services/blog/blog.service';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PaysService } from 'src/app/services/pays/pays.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  listBlog: any;
  page: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  isModalOpen: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  currentUser: any = null;
  isAddLoading: boolean = false;
  listPays: any;

  blogForm = new FormGroup({
    id: new FormControl(null),
    title: new FormControl('', [Validators.required]),
    subTitle: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    pays: new FormControl(null, [Validators.required])
  });

  constructor(
    private blogService: BlogService,
    private paysService: PaysService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService) { 
    
  }
  ngOnInit(): void {
    this.getBlogs();
    this.getPays();
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN'); 
      }
    });

    this.blogForm.get('title')?.valueChanges.subscribe(value => {
      if (value) {
        const isDuplicate = this.checkDuplicateTitle(value, this.blogForm.get('id')?.value);
        if (isDuplicate) {
          this.blogForm.get('title')?.setErrors({ duplicate: true });
        }
      }
    });
  }

  getBlogs() {
    this.isLoading = true;
    this.blogService.getAll().subscribe({
      next: (res) => {
        this.listBlog = res;
        this.totalPages = Math.ceil(this.listBlog.length / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching blogs', err);
        this.isLoading = false;
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
    if (this.blogForm.invalid) {
      return;
    }

    const blog = this.blogForm.value;
    
    if (blog.id) {
      this.blogService.update(blog).subscribe({
        next: () => {
          this.getBlogs();
          this.toggleModal();
          Swal.fire({
            title: "Updated!",
            text: "Blog has been updated.",
            icon: "success"
          });
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error updating blog', err);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while updating the blog.",
            icon: "error"
          });
        }
      });
    } else {
      this.blogService.create(blog).subscribe({
        next: () => {
          this.getBlogs();
          this.toggleModal();
          Swal.fire({
            title: "Created!",
            text: "Blog has been created.",
            icon: "success"
          });
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error creating blog', err);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while creating the blog.",
            icon: "error"
          });
        }
      });
    }
  }

  editBlog(blog: any) {
    this.blogForm.patchValue(blog);
    // console.log(blog);
    this.toggleModal();
  }

  deleteBlog(id: number) {
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
        this.blogService.delete(id).subscribe({
          next: () => {
            this.getBlogs();
            Swal.fire({
              title: "Deleted!",
              text: "Blog has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting blog', err);
            Swal.fire({
              title: "Error!",
              text: "An error occurred while deleting the blog.",
              icon: "error"
            });
          }
        });
      }
    });
  }

  checkDuplicateTitle(title: any, id: any): boolean {
    if (!this.listBlog || !title) {
      return false;
    }
    
    // If editing an existing blog, exclude it from the check
    return this.listBlog.some((blog: any) => 
      blog.title.toLowerCase() === title.toLowerCase() && blog.id !== id
    );
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.blogForm.reset();
    }
  }
}