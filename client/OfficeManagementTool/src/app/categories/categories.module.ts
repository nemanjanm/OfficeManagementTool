import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';



@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryFormComponent
  ],
  imports: [
    SharedModule
  ]
})
export class CategoriesModule { }
