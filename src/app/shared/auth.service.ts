import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  admin_token: any;
  Data: any;
  constructor(public router: Router, private http: HttpClient) { }
  Domain_uri = environment.DOMAIN_URI;
  baseUrl: string = this.Domain_uri + 'api/admin/verify/token';

  IsloggedIn() {
    this.admin_token = localStorage.getItem("Admin_token");
    if(this.admin_token == null){
      this.admin_token = ''
    }
    console.log(this.admin_token);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.admin_token
      })
    };

    this.http.get(this.baseUrl, httpOptions).subscribe(
      (response)=> {
        console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));
        console.log(this.Data);
        if (this.Data.status_code == 400) {
        localStorage.removeItem('Admin_token')
        }
      }
    )
    return !!localStorage.getItem('Admin_token');
  }
}
