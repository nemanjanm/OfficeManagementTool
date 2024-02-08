import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { FormsModule } from '@angular/forms';
import { OfficeAdministrationModule } from './office-administration/office-administration.module';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './auth/services/auth-interceptor.service';
import { CategoriesModule } from './categories/categories.module';
import { UserAdministrationModule } from './user-administration/user-administration.module';
import { ReportModule } from './report/report.module';
import { ExceptionLogModule } from './exception-log/exception-log.module';
import { ItemsModule } from './items/items.module';
import { OrderModule } from './order/order.module';
import { EquipmentModule } from './equipment/equipment.module';
import { ProfilePageModule } from './profile-page/profile-page.module';
import { CreateOrderModule } from './create-order/create-order.module';
import { CartComponent } from './order/components/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    NotFoundComponent,
    ForbiddenComponent,
  ],
  imports: [
    CreateOrderModule,
    ExceptionLogModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    OfficeAdministrationModule,
    UserAdministrationModule,
    AuthModule,
    ReportModule,
    ExceptionLogModule,
    OfficeAdministrationModule,
    CategoriesModule,
    ItemsModule,
    EquipmentModule,
    ProfilePageModule,
    OrderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
