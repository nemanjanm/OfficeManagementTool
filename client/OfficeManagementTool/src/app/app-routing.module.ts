import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './auth/components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { ForgotPasswordComponent } from './auth/components/forgotpassword/forgot-password.component';
import { ChangePasswordComponent } from './auth/components/changepassword/change-password.component';
import { OfficeComponent } from './office-administration/components/office/office.component';
import { CategoriesComponent } from './categories/components/categories/categories.component';
import { Roles } from './models/Roles';
import { ExceptionComponent } from './exception-log/components/exception/exception.component';
import { UserTableComponent } from './user-administration/components/user-table/user-table.component';
import { ItemsComponent } from './items/components/items.component';
import { CategoryType } from './models/CategoryType';
import { MyReportsComponent } from './report/components/my-reports/my-reports.component';
import { AuthGuard } from './auth/services/auth.guard';
import { EquipmentComponent } from './equipment/components/equipment/equipment.component';
import { ProfilePageComponent } from './profile-page/profile-page/profile-page.component';
import { NewPasswordComponent } from './profile-page/new-password/new-password.component';
import { CreateOrderComponent } from './create-order/components/create-order/create-order.component';
import { OrderComponent } from './order/components/order/order.component';
import { OrderItemComponent } from './order/components/order-item/order-item.component';
import { CartMainComponent } from './order/components/cart-main/cart-main.component';

const routes: Routes = [
  {
    path: '', 
    component: LayoutComponent,
    canActivate: [AuthGuard()],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo:'cart'
      },
      {
        path: 'users',
        component: UserTableComponent,
        canActivate: [AuthGuard(Roles.ADMIN, Roles.HR)]
      },
      {
        path: 'offices',
        component: OfficeComponent,
         canActivate: [AuthGuard(Roles.ADMIN, Roles.HR)]
      },
      {
        path: "categories",
        component: CategoriesComponent,
        canActivate: [AuthGuard(Roles.ADMIN, Roles.HR)]
      },
      { 
        path: "snacks", 
        component: ItemsComponent,
        data: { CategoryType: CategoryType.Snack },
        canActivate: [AuthGuard(Roles.ADMIN, Roles.HR)]
      },
      { 
        path: "equipment", 
        component: ItemsComponent,
        data: { CategoryType: CategoryType.Equipment },
        canActivate: [AuthGuard(Roles.ADMIN, Roles.HR)]
      },
      { 
        path: "equipment-evidentation", 
        component: EquipmentComponent,
        canActivate: [AuthGuard(Roles.ADMIN, Roles.HR)]
      },
      {
        path: 'exceptions',
        component: ExceptionComponent,
        canActivate: [AuthGuard(Roles.ADMIN, Roles.HR)]
      },
      { 
        path: "reports", 
        component: MyReportsComponent
      },
      {
        path: 'profile-page',
        component: ProfilePageComponent
      },
      {
        path: 'new-password',
        component: NewPasswordComponent
      },
      {
        path: "order",
        component: OrderComponent
      },
      {
        path: "order-item",
        component: OrderItemComponent
      },
      {
        path: "cart",
        component: CartMainComponent
      }
    ]
  },
  { 
    path: "forgot-password", 
    component: ForgotPasswordComponent 
  },
  { 
    path: "change-password",
    component: ChangePasswordComponent 
  },
  { 
    path: "login",
    component: LoginComponent
  },
  { 
    path: "forbidden", 
    component: ForbiddenComponent
  },
  {
    path: "accept-order",
    component: CreateOrderComponent
  },
  { 
    path: "**", 
    component: NotFoundComponent, 
    pathMatch: "full"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
