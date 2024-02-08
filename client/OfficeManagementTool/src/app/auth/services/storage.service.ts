import { Injectable } from '@angular/core';
import { LoginResponse } from '../../models/LoginResponse';
import { UserInfo } from 'src/app/models/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUserInfo(): UserInfo|null {
    let userInfo = localStorage.getItem("userInfo");

    if(userInfo != null){
      return JSON.parse(userInfo!) as UserInfo;
    }

    return null;
  }

  setCredentials(info: LoginResponse): void {
    localStorage.setItem("token", info.token);
    localStorage.setItem("userInfo", JSON.stringify(info.user));
  }

  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }

  deleteCredentials(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  }
}
