import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import 'rxjs/add/operator/map';
import { stringify } from 'querystring';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  url: string = 'http://localhost:12300';
  options: RequestOptions;
  headers: Headers;

  private jsonConvert: JsonConvert;

  constructor(private http: Http) {
    this.jsonConvert = new JsonConvert();
    this.jsonConvert.ignorePrimitiveChecks = false;

    this.headers = new Headers(
      {'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'}
    );

    this.options = new RequestOptions({headers : this.headers})
  }

  public async GetStatusOfAll() {
    try {
      const data = await this.http
        .get(this.url+"/status/all", this.options)
        .toPromise();

      let returnMap: Map<string, string> = data.json();

      return returnMap;
    } catch (e) {
      throw new Error("error getting status of everyone: " + e);
    }
  }

  public async GetStatusOfOne(name: string) {
    try {
      const data = await this.http
        .get(this.url+"/status/persons/"+name, this.options)
        .toPromise();

      let toReturn: string = data.json();
      return toReturn;
    } catch (e) {
      throw new Error("error getting status of " + name + " : " + e);
    }
  }

  public async SetStatusOfOne(name: string, status: string) {
    try {
      const data = await this.http
        .put(this.url+"/status/persons/"+name+"/status/"+status, this.options)
        .toPromise();

      let toReturn: string = data.json();
      return toReturn;
    } catch (e) {
      throw new Error("error setting status of " + name + " : " + e);
    }
  }
}
