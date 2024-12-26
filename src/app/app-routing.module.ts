import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserComponent } from './components/list-user/list-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/partials/page-not-found/page-not-found.component';
import { ListRoleComponent } from './components/list-role/list-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { AuthGuard } from './guards/auth.guard';
import { AfterAuthGuard } from './guards/after-auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {path:"", redirectTo:"/users", pathMatch:'full'},
  {
    path: "users", children:[
      {
        path:"",component:ListUserComponent
      },
      
      {
        path:"edit/:id",component: EditUserComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path:"profile",component:ProfileComponent , canActivate:[AuthGuard]
  },
  {
    path: "roles", children:[
      {
        path:"",component:ListRoleComponent
      },
      {
        path:"createRole",component:AddRoleComponent
      },
      {
        path:"edit/:id",component: EditRoleComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path:"login", component:LoginComponent,canActivate:[AfterAuthGuard]
  },
  {
    path:"createUser",component:AddUserComponent
  },
  {
    path:"**", component:PageNotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
