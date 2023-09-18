import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  login = this.fb.group({
    email : [''],
    password : ['']
  })
  Domain_uri = environment.DOMAIN_URI;
  baseUrl : string= this.Domain_uri+'api/admin/login';
  
  Data: any;
  toast=true;
  toastmsg: any;
  
  ngOnInit(): void {
  }

  submit(){
    this.getLoginRes(this.login.value.email, this.login.value.password);
  }
  getLoginRes(email:any, password:any){
    // email = email.toString();
    // password = password.toString();
    console.log(email,password);
    return this.http.post(this.baseUrl,{
      email:email,
      password:password
    }).subscribe(
      response =>{
        // console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));
        console.log(this.Data.token);
        if(this.Data.token == '204')
        {
          this.toastmsg = "Please enter all required credentials";
          this.toast=false;
          setTimeout(() => {
            this.toast=true;
        }, 2000);
        }
        else if(this.Data.token == '401'){
          this.toastmsg = "Please enter valid credentials";
          this.toast=false;
          setTimeout(() => {
            this.toast=true;
        }, 2000);
        }
        else if(this.Data.token == '200'){
          console.log(this.Data.token_id);
          localStorage.setItem('Admin_token',this.Data.token_id);
          this.router.navigateByUrl('/Bloom/admin/surveyquestions');
        }
      }
    )

  }

}
