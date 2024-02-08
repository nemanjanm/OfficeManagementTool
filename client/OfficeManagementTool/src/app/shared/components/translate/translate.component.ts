import { Component, OnInit } from '@angular/core';
import { LANGUAGE } from '../../enum/language';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {
  selectedLanguage = 'en-CA';

  languages = LANGUAGE;

  constructor(public translate: TranslateService) {
    
  }

  ngOnInit(): void {
    this.translate.setDefaultLang(localStorage.getItem('language') || 'en-CA');
    this.selectedLanguage = localStorage.getItem('language') || 'en-CA';
    localStorage.setItem('language', this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  swithcLanguage() {
    localStorage.setItem('language', this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }
}