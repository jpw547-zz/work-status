import { Injectable, EventEmitter } from '@angular/core';
import {
  JsonConvert,
  OperationMode,
  ValueCheckingMode,
  JsonObject,
  JsonProperty,
  Any,
  JsonCustomConvert,
  JsonConverter
} from "json2typescript";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: WebSocket;
  private jsonConvert: JsonConvert;
  url: string = 'localhost:12300';

  private listener: EventEmitter<Event>;

  constructor() {
    this.jsonConvert = new JsonConvert();
    this.jsonConvert.ignorePrimitiveChecks = false;
    this.listener = new EventEmitter();

    console.log("Is this ever happening?")
    this.openSocket();
  }
  
  private openSocket() {
    this.socket = new WebSocket(
      "ws://" + this.url + "/provisioning/ws"
    );

    this.socket.onopen = () => {
      console.log("socket connection successfully opened.");
    };

    this.socket.onmessage = message => {
      const data = JSON.parse(message.data);
      const event = this.jsonConvert.deserialize(data, Event);

      this.onEvent(event);
    };

    // try to reconnect when socket is closed
    this.socket.onclose = () => {
      console.log("socket connection closed. retrying in 5 seconds...");
      setTimeout(() => {
        this.openSocket();
      }, 5 * 1000);
    };
  }

  private onEvent(event: Event) {
    console.log("received event:", event);
    this.listener.emit(event);
  }

  public GetListener(): EventEmitter<Event> {
    return this.listener;
  }
}

@JsonObject("BasicRoomInfo")
export class BasicRoomInfo {
  @JsonProperty("buildingID", String, true)
  BuildingID = "";

  @JsonProperty("roomID", String, true)
  RoomID = "";

  constructor(roomID: string) {
    if (roomID == null || roomID === undefined) {
      return;
    }

    const split = roomID.split("-");

    if (split.length === 2) {
      this.BuildingID = split[0];
      this.RoomID = split[0] + "-" + split[1];
    }
  }
}

@JsonObject("BasicDeviceInfo")
export class BasicDeviceInfo {
  @JsonProperty("buildingID", String, true)
  BuildingID = "";

  @JsonProperty("roomID", String, true)
  RoomID = "";

  @JsonProperty("deviceID", String, true)
  DeviceID = "";

  constructor(deviceID: string) {
    if (deviceID == null || deviceID === undefined) {
      return;
    }

    const split = deviceID.split("-");

    if (split.length === 3) {
      this.BuildingID = split[0];
      this.RoomID = split[0] + "-" + split[1];
      this.DeviceID = split[0] + "-" + split[1] + "-" + split[2];
    }
  }
}

@JsonConverter
class DateConverter implements JsonCustomConvert<Date> {
  serialize(date: Date): any {
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }

    return (
      date.getUTCFullYear() +
      "-" +
      pad(date.getUTCMonth() + 1) +
      "-" +
      pad(date.getUTCDate()) +
      "T" +
      pad(date.getUTCHours()) +
      ":" +
      pad(date.getUTCMinutes()) +
      ":" +
      pad(date.getUTCSeconds()) +
      "Z"
    );
  }

  deserialize(date: any): Date {
    return new Date(date);
  }
}

@JsonObject("Event")
export class Event {
  @JsonProperty("generating-system", String, true)
  GeneratingSystem = "";

  @JsonProperty("timestamp", DateConverter, true)
  Timestamp: Date = undefined;

  @JsonProperty("event-tags", [String], true)
  EventTags: string[] = [];

  @JsonProperty("target-device", BasicDeviceInfo, true)
  TargetDevice = new BasicDeviceInfo(undefined);

  @JsonProperty("affected-room", BasicRoomInfo, true)
  AffectedRoom = new BasicRoomInfo(undefined);

  @JsonProperty("key", String, true)
  Key = "";

  @JsonProperty("value", String, true)
  Value = "";

  @JsonProperty("user", String, true)
  User = "";

  @JsonProperty("data", Any, true)
  Data: any = undefined;

  public hasTag(tag: string): boolean {
    return this.EventTags.includes(tag);
  }
}
