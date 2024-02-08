import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from '../prime/prime.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBusyModule, BusyConfig } from 'ng-busy';
import { BusyLoaderComponent } from './busy-loader/busy-loader.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateComponent } from './components/translate/translate.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `${environment.serverUrl}/api/Localization?lang=`, "");
}

@NgModule({
  declarations: [
    BusyLoaderComponent,
    TranslateComponent
  ],
  imports: [
    CommonModule,
    PrimeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgBusyModule.forRoot(new BusyConfig({
      message: 'Loading...',
      backdrop: true,
      template: BusyLoaderComponent,
      delay: 200,
      minDuration: 600,
      templateNgStyle: { "background-color": "green" }
   })),
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    NgBusyModule,
    TranslateComponent,
    TranslateModule
  ]
})
export class SharedModule { }