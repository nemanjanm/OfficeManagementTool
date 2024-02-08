import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/auth/services/storage.service';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.scss']
})
export class MyReportsComponent {
  userId?:number;

  constructor(private storageService:StorageService, private translateService: TranslateService){}

  ngOnInit(): void {
    this.userId = this.storageService.getUserInfo()?.id;
  }
}
