import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { SocketService } from './services/socket.service';
import { TimerService } from './services/timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  statusMap: Map<string, string> = new Map();
  FULL_TIME = "Full-time";
  STUDENT = "Student";

  constructor(private data: DataService, private socket: SocketService, private timer: TimerService) {
    
  }

  public async ngOnInit() {
    this.UpdateEveryone();

    this.socket.GetListener().subscribe(event => {
      if(event.Key === "update") {
        this.UpdateSomeone(event.User);
      }
      if(event.Key === "everyone") {
        this.UpdateEveryone();
      }
      if(event.Key === "timer") {
        this.timer.SetTimer(event.User, event.Data, event.Value)
        this.UpdateSomeone(event.User);
      }
    })
  }

  public async UpdateEveryone() {
    this.statusMap = await this.data.GetStatusOfAll();
  }

  public async UpdateSomeone(name: string) {
    this.statusMap[name] = await this.data.GetStatusOfOne(name);
  }
}
