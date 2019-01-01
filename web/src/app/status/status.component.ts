import { Component, OnInit, Input } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { stringify } from 'querystring';
import { DataService } from '../services/data.service';

@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  @Input() state: string;
  @Input() name: string;
  @Input() position: string;
  countdown: number = 0;
  oldState: string;

  constructor(private timer: TimerService, private data: DataService) { }

  ngOnInit() {
    this.timer.GetListener().subscribe(timerEvent => {
      if(timerEvent.Name === this.name) {
        this.countdown = timerEvent.Amount * 60;
        this.oldState = this.state;
        this.state = timerEvent.NewState;
        this.beginCountdown();
      }
    })
  }

  nameAsTitle(): string {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1)
  }

  showStatus(): string {
    if(this.state != null) {
      return this.state.toUpperCase();
    }
    
    return "AWAY"
  }

  hasStatus(status: string): boolean {
    return this.state == status
  }

  statusClass(): string {
    if(this.hasStatus("here")) {
      return "status-card here"
    }
    if(this.hasStatus("away")) {
      return "status-card away"
    }
    if(this.hasStatus("brb")) {
      return "status-card brb"
    }
    if(this.hasStatus("out")) {
      return "status-card out"
    }
    if(this.hasStatus("school") || this.hasStatus("class")) {
      return "status-card school"
    }
    if(this.hasStatus("team building")) {
      return "status-card starcraft"
    }
    if(this.hasStatus("do not disturb")) {
      return "status-card dnd"
    }

    return "status-card"
  }

  beginCountdown() {
    // the countdown is in minutes

    let t = setInterval(() => {
      this.countdown--;

      if(this.countdown <= 0) {
        clearInterval(t);
      }

    }, 1000)

    this.state = this.oldState;
    this.data.SetStatusOfOne(this.name, this.state);
  }

  showCountdown(): string {
    if(this.countdown == null || this.countdown == 0) {
      return "";
    }

    let minutes = Math.floor(this.countdown / 60);
    let seconds = Math.floor(this.countdown % 60);

    return minutes + ":" + seconds
  }
}
