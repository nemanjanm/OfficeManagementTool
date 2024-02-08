import { Component } from '@angular/core';
import { SignalRService } from 'src/app/shared/signal-r.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: []
})
export class LayoutComponent {
  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
  }

  ngOnDestroy(): void {
    this.signalRService.stopConnection();
  }
}