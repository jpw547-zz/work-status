import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule, MatCardModule, MatButtonModule, MatProgressBarModule } from '@angular/material';
import { HttpModule } from '@angular/http';

import { DataService } from './services/data.service';
import { SocketService } from './services/socket.service';
import { StatusComponent } from './status/status.component';
import { TimerService } from './services/timer.service';

@NgModule({
  declarations: [
    AppComponent,
    StatusComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    HttpModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  providers: [DataService, SocketService, TimerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
