import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  url: string = 'http://localhost:12300';
  options: RequestOptions;
  headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers(
      {'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'}
    );

    this.options = new RequestOptions({headers : this.headers})
  }

  GetStatusOfAll(): Observable<Map<string, string>> {
    let returnMap: Map<string, string>;
    return this.http.get(this.url+"/status/all", this.options).map(response => response.json());
  }
}
