import { Component, OnInit } from '@angular/core';
import { BlogService } from './../../services/blog/blog.service';
import { AccountService } from 'src/app/services/account.service';
import { JwtTokenService } from 'src/app/services/jwt-token.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BlogContentService } from 'src/app/services/blogContent/blog-content.service';

@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.css']
})
export class BlogContentComponent implements OnInit {
  listBlogContent: any;
  listBlog: any;
  page: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  isModalOpen: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  currentUser: any = null;
  filteredBlogContents: any;
  selectedBlog: any = null;
isAddLoading: boolean = false;

  blogContentForm = new FormGroup({
    id: new FormControl(null),
    title: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    paragraph1: new FormControl('', [Validators.required]),
    paragraph2: new FormControl('', [Validators.required]),
    paragraph3: new FormControl('', [Validators.required]),
    blog: new FormControl(null, [Validators.required])
  });

  constructor(
    private blogContentService: BlogContentService,
    private blogService: BlogService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService
  ) {}

  ngOnInit(): void {
    this.getBlogContents();
    this.getBlogs();
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN');
      }
    });
    this.filteredBlogContents = this.listBlogContent || [];
  }

  getBlogContents() {
    this.isLoading = true;
    this.blogContentService.getAll().subscribe({
      next: (res) => {
        this.listBlogContent = res;
        this.filteredBlogContents = res;
        this.totalPages = Math.ceil(this.filteredBlogContents.length / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching blog contents', err);
        this.isLoading = false;
      }
    });
  }

  filterByBlog() {
    if (!this.selectedBlog) {
      this.filteredBlogContents = this.listBlogContent;
    } else {
      this.filteredBlogContents = this.listBlogContent.filter((content: any) => 
        content.blog?.id === this.selectedBlog.id
      );
    }
    this.page = 1;
    this.totalPages = Math.ceil(this.filteredBlogContents.length / this.itemsPerPage);
  }

  clearFilter() {
    this.selectedBlog = null;
    this.filteredBlogContents = this.listBlogContent;
    this.page = 1;
    this.totalPages = Math.ceil(this.filteredBlogContents.length / this.itemsPerPage);
  }

  getBlogs() {
    this.blogService.getAll().subscribe({
      next: (res) => {
        this.listBlog = res;
      },
      error: (err) => {
        console.error('Error fetching blogs', err);
      }
    });
  }

  submitForm() {
this.isAddLoading = true;
    if (this.blogContentForm.invalid) {
      return;
    }

    const blogContent = this.blogContentForm.value;

    if (blogContent.id) {
      this.blogContentService.update(blogContent).subscribe({
        next: () => {
          this.getBlogContents();
          this.toggleModal();
          Swal.fire({
            title: "Updated!",
            text: "Blog content has been updated.",
            icon: "success"
          });
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error updating blog content', err);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while updating the blog content.",
            icon: "error"
          });
        }
      });
    } else {
      this.blogContentService.create(blogContent).subscribe({
        next: () => {
          this.getBlogContents();
          this.toggleModal();
          Swal.fire({
            title: "Created!",
            text: "Blog content has been created.",
            icon: "success"
          });
          this.isAddLoading = false;
        },
        error: (err) => {
          this.isAddLoading = false;
          console.error('Error creating blog content', err);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while creating the blog content.",
            icon: "error"
          });
        }
      });
    }
  }

  editBlogContent(blogContent:any) {
    this.blogContentForm.patchValue(blogContent);
    console.log(blogContent);
    this.toggleModal();
  }

  deleteBlogContent(id: number) {
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
        this.blogContentService.delete(id).subscribe({
          next: () => {
            this.getBlogContents();
            Swal.fire({
              title: "Deleted!",
              text: "Blog content has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting blog content', err);
            Swal.fire({
              title: "Error!",
              text: "An error occurred while deleting the blog content.",
              icon: "error"
            });
          }
        });
      }
    });
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.blogContentForm.reset();
    }
  }
}