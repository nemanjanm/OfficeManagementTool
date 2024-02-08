import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../auth/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection?: signalR.HubConnection;

  constructor(private http: HttpClient, private storageService: StorageService){}
  public startConnection(): void{
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(environment.serverUrl + "/hub/orders").withAutomaticReconnect().build();
    this.hubConnection.start().finally(() => {
      this.JoinGroups();
    });  
  }

  public addOrderListener(func: any): void {
    this.hubConnection?.on("NewOrder", func);
  }

  public JoinGroups(){
    this.hubConnection?.invoke("JoinGroups", this.storageService.getToken());
  }

  public addReconnectedEventEmitter(emitter: EventEmitter<any>) {
    this.hubConnection?.onreconnected((connId) => {
      emitter.emit(connId);
    })
  }

  public stopConnection(){
    this.hubConnection?.stop();
  }

  public removeOrderListener(){
    this.hubConnection?.off("NewOrder");
  }

  public addReportStateChangeListener(func: any): void {
    this.hubConnection?.on("StateChange", func);
  }

  public removeReportStateChangeListener(): void {
    this.hubConnection?.off("StateChange");
  }

  public addNewOrderListener(func: any): void {
    this.hubConnection?.on("NewOrder", func);
  }

  public removeNewOrderListener(): void {
    this.hubConnection?.off("NewOrder");
  }

  public addDeletedOrderListener(func: any): void {
    this.hubConnection?.on("DeletedOrder", func);
  }

  public removeDeletedOrderListener(): void {
    this.hubConnection?.off("DeletedOrder");
  }
}
