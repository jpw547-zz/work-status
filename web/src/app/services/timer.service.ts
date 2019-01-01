import { Injectable, EventEmitter } from '@angular/core';
import { Event } from './socket.service';

@Injectable({
  providedIn: 'root'
})

export class TimerInfo {
  Name: string;
  Amount: number;
  NewState: string;
}

export class TimerService {
  listener: EventEmitter<TimerInfo>;

  constructor() {
    this.listener = new EventEmitter<TimerInfo>();
  }

  public GetListener(): EventEmitter<TimerInfo> {
    return this.listener;
  }

  public SetTimer(name: string, amount: number, newState: string) {
    let timerEvent: TimerInfo = {
        Name: name,
        Amount: amount,
        NewState: newState
    }

    this.listener.emit(timerEvent)
  }
}
