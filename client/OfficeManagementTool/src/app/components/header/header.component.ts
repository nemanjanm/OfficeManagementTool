import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StorageService } from 'src/app/auth/services/storage.service';
import { Roles } from 'src/app/models/Roles';
import { Role } from 'src/app/shared/enum/role';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private storageService: StorageService,
    private authService: AuthService, 
    private router: Router,
    private translateService: TranslateService
    ){}

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setHeaderLinks(event.translations);
    }));

    this.subscriptions.push(this.translateService.getTranslation(this.translateService.currentLang).subscribe(translations => {
      this.setHeaderLinks(translations);
    }))
  }

  checkLogin(): boolean {
    return this.authService.isLoggedIn();
  }

  getRole(): Roles {
    return this.storageService.getUserInfo()?.role!;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  private setHeaderLinks(translations: any): void
  {
    this.items = [
      {
        label: translations['Common']['Cart'],
        routerLink: "/cart"
      },
      {
        label: translations['Common']['Employees'],
        routerLink: "/users",
        visible: this.getRole() == Roles.ADMIN || this.getRole() == Roles.HR
      },
      {
        label: translations['Common']['Offices'],
        routerLink: "/offices",
        visible: this.getRole() == Roles.ADMIN || this.getRole() == Roles.HR
      },
      {
        label: translations['Equipment']['EquipmentEvidentation'],
        routerLink: "/equipment-evidentation",
        visible: this.getRole() == Roles.ADMIN || this.getRole() == Roles.HR
      },
      {        
        label: translations['Common']['Reports'],
        routerLink: "/reports"
      },
      {
        label: translations['Common']['Items'],
        items: [
          {
            label: translations['Common']['Snacks'],
            routerLink: "/snacks"
          },
          {
            label: translations['Common']['Equipment'],
            routerLink: "/equipment"
          }
        ],
        visible: this.getRole() == Roles.ADMIN || this.getRole() == Roles.HR
      },
      {        
        label: translations['Common']['Categories'],
        routerLink: "/categories",
        visible: this.getRole() == Roles.ADMIN || this.getRole() == Roles.HR
      },
      {        
        label: translations['Order']['Orders'],
        routerLink: "/order",
        visible: this.getRole() == Roles.ADMIN || this.getRole() == Roles.HR
      },
      {
        label: translations['Common']['Exceptions'],
        routerLink: "/exceptions",
        visible: this.getRole() == Roles.ADMIN || this.getRole() == Roles.HR
      },
      {
        label: translations['User']['ProfilePage'],
        routerLink: "/profile-page"
      }
    ]
  }
}
