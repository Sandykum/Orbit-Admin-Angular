import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {

  constructor(public router: Router, private fb: FormBuilder, private http: HttpClient) { }

  Domain_uri = environment.DOMAIN_URI;

  admin = this.fb.group({
    email: [''],
    password: ['']
  })

  admin_edit = this.fb.group({
    password: ['']
  })

  baseUrl: string = this.Domain_uri + 'api/admin/users';
  baseUrl1: string = this.Domain_uri + 'api/admin/get';
  baseUrl2: string = this.Domain_uri + 'api/admin/update';
  baseUrl3: string = this.Domain_uri + 'api/admin/delete';

  Data: any;
  toast = true;
  toastmsg: any;
  admin_token: any;
  admins: any;
  update_click_id_admin: any;

  ngOnInit(): any {
    this.admin_token = localStorage.getItem("Admin_token");
    console.log(this.admin_token);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.admin_token
      })
    };
    return this.http.get(this.baseUrl1, httpOptions).subscribe(
      response => {
        console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));
        this.admins = this.Data.admins;
      }
    )


  }

  logout(){
      localStorage.removeItem('Admin_token');
      this.router.navigateByUrl('/Bloom/admin/login');
  }

  submit() {
    this.getLoginRes(this.admin.value.email, this.admin.value.password);
  }
  getLoginRes(email: any, password: any) {
    // email = email.toString();
    // password = password.toString();

    console.log(email, password);
    this.admin_token = localStorage.getItem("Admin_token");
    console.log(this.admin_token);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.admin_token
      })
    };
    return this.http.post(this.baseUrl, {
      email: email,
      password: password
    }, httpOptions).subscribe(
      response => {
        // console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));
        console.log(this.Data.token);
        if (this.Data.token == '204') {
          this.toastmsg = "Please enter all required credentials";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
        }
        else if (this.Data.token == '409') {
          this.toastmsg = "The admin already exists";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
        }
        else if (this.Data.token == '200') {
          console.log(this.Data.msg);
          this.toastmsg = "The admin added successfully";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
          location.reload();
        }

      }
    )


  }
  edit(item: any) {
    console.log(item);
    this.update_click_id_admin = item["_id"];
    // localStorage.setItem("update_click_id_admin", item["_id"]);

    // this.admin_edit.setValue({
    //   email: item["email"],
    //   password: item["password"]
    // })
  }
  update() {
    this.updateAdmin(this.admin_edit.value.password);
  }
  updateAdmin(password: any){
    this.admin_token = localStorage.getItem("Admin_token");
    console.log(this.admin_token);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.admin_token
      })
    };

    console.log(password);
    var edit_admin_id = this.update_click_id_admin;
    return this.http.post(this.baseUrl2, {
      admin_id : edit_admin_id,
      update_password: password
    }, httpOptions).subscribe(
      response => {
        // console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));
        console.log(this.Data.token);
        if (this.Data.token == '200') {
          console.log(this.Data.msg);
          this.toastmsg = "The admin password updated successfully";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
          location.reload();
        }

      }
    )


  }
  delete(item: any){
    console.log(item);
    localStorage.setItem("delete_click_id_admin", item["_id"]);
  }

  delete_dialog() {
    this.admin_token = localStorage.getItem("Admin_token");
    console.log(this.admin_token);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.admin_token
      })
    };

    var delete_click_id = localStorage.getItem("delete_click_id_admin");
    console.log(delete_click_id);
    
    return this.http.post(this.baseUrl3, {
      admin_id: delete_click_id,
    }, httpOptions).subscribe(
      response => {
        console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));
        if (this.Data.token == '200') {
          this.toastmsg = "The Admin deleted successfully";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
          location.reload();
        }

      }
    )
  }
}
