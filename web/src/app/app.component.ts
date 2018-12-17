import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  statusMap: Map<string, string>;

  constructor(private data: DataService) {
    console.log("this is happening")
    this.GetStatusData();
  }

  GetStatusData() {
    this.data.GetStatusOfAll().subscribe(res => {
      this.statusMap = res;
    });
  }
}
