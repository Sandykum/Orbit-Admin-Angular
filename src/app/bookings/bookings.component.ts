import { Component, ElementRef, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ImageUploadService } from '../image-upload.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  default_tag = ['All'];
  versions = [{ type: "Ticket 1", "flag": false }, { type: "Ticket 2", "flag": true }];
  category = [{ name: "General Nutrition/ Healthy Eating" },
  { name: "Exercise Routines" },
  { name: "Sleep Tips" },
  { name: "First OBGYN Visit" },
  { name: "Body Care" }
    , { name: "Body Changes" },
  { name: "Mental Health" }];
  selectedTeam = '';
  ver = true;
  
  @ViewChild('searchInput') searchInput: ElementRef | any;
  imageObj: File | any = null;
  imageUrl: string = '';
  version_table: string = '';
  progress: number = 0;
  Domain_uri = environment.DOMAIN_URI;
  admin_token: any;
  rows:any = [];

  model: any;  

  constructor( private cdref: ChangeDetectorRef,public router: Router, private fb: FormBuilder, private http: HttpClient, private imageUploadService: ImageUploadService) {
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '130px',
  };

  article = this.fb.group({
    
    Date: [''],
    version: [null],
    count: ['']
  })

  article_edit = this.fb.group({
    heading: [''],
    description: [''],
    publishDate: ['']

    // category: [null],
    // heading: [''],
    // tags: [''],
    // description: [''],
    // imageurl: [''],
    // version: [null],
    // publishDate: [{}]
  })

  baseUrl: string = this.Domain_uri + 'api/admin/article';
  baseUrl1: string = this.Domain_uri + 'api/admin/get/article';
  baseUrl2: string = this.Domain_uri + 'api/admin/update/article';
  baseUrl3: string = this.Domain_uri + 'api/admin/delete/article';
  baseUrl4: string = this.Domain_uri + 'api/admin/upload/article';

  Data: any;
  toast = true;
  toastmsg: any;
  articles: any;
  tag_list: any = [];
  tag_list_update: any = [];
  file: File | any = null;
  image_data1: any = '';
  image_data : any = '';

  publishDate: any = '';

  time_from = { hour: 0, minute: 0 };
  time_to = { hour: 0, minute: 0 };
  meridian = true;
  ngOnInit(): any {

    this.rows = [{
      name:'',
      email:'',
      mobno:''
  }]
  }
  addRow() {
  let row = {name: "", email: "",mobno:""};
  this.rows.push(row);
  }
  deleteRow(index:any) {
  this.rows.splice(index, 1);
  }
  submit(){
  // console.log(this.rows);
  console.log(this.article.value.Date, this.article.value.version);
  }

  

  // onSelected(value: any): void {

  //   this.selectedTeam = value;
  //   let a = this.selectedTeam.split(": ");
  //   console.log(a);
  //   console.log(this.publishDate)

  //   if (a[1] == 'false') {
  //     this.ver = true;
  //   }
  //   else if (a[1] == 'true') {
  //     this.ver = false;
  //   }
  // }

    // this.articles=[
    //   {
    //     heading:'test',
    //     // img:'http://res.cloudinary.com/dvaldxya4/image/upload/v1694925223/s97vhzlc9bmnvss22riy.png'
    //   }
    // ]

    // this.admin_token = localStorage.getItem("Admin_token");
    // console.log(this.admin_token);

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'x-access-token': this.admin_token
    //   })
    // };
    // this.getImage();
    // return this.http.get('http://localhost:3000/api/getImage').subscribe(
    //   response=>{
        
    //     this.articles=JSON.parse(JSON.stringify(response)).article;
        
    //     console.log(this.articles)
    //   }
    // )

    // return this.http.get(this.baseUrl1, httpOptions).subscribe(
    //   response => {
    //     console.log(response)
    //     this.Data = JSON.parse(JSON.stringify(response));
    //     this.articles = this.Data.articles;
    //     console.log(this.articles);
    //     for (let i = 0; i < this.articles.length; i++) {
    //       console.log(this.articles[i]["is_published"]);

    //       if (this.articles[i]["is_published"]) {
    //         this.articles[i]["version"] = "Published";
    //       }
    //       else {
    //         this.articles[i]["version"] = "Draft";
    //       }
    //     }

    //     console.log(this.version_table);

    //   }
    // )


  }
  // ngAfterViewInit(){
  //   var s = $("input").tagsinput('items');
  //   console.log(s);

  // }


  // getImage(){
  //   return this.http.get('http://localhost:3000/api/getImage').subscribe(
  //     response=>{
        
  //       this.articles=JSON.parse(JSON.stringify(response)).article;
        
  //       console.log(this.articles)
  //     }
  //   )
  // }
  // logout() {
  //   localStorage.removeItem('Admin_token');
  //   this.router.navigateByUrl('/Bloom/admin/login');
  // }

  // submit() {
  //   this.submitArticle(this.article.value.heading, this.article.value.description,
  //     this.article.value.publishDate);
  // }
  // update() {
  //   this.updateArticle(this.article_edit.value.heading, this.article_edit.value.description, this.article_edit.value.publishDate );
  // }
  // submitArticle(heading: any, description: any,publishDate: any) {
  //   // email = email.toString();
  //   // password = password.toString();
  //   this.admin_token = localStorage.getItem("Admin_token");
  //   console.log(this.admin_token);

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'x-access-token': this.admin_token
  //     })
  //   };
    
  //   if (publishDate != null) {
  //     publishDate = publishDate["year"] + "-" + publishDate["month"] + "-" + publishDate["day"];

  //     const dateStr1 = publishDate;
  //     const date1 = new Date(dateStr1);
  //     const timestamp = date1.toJSON();
  //     publishDate = timestamp;
  //     console.log(timestamp);
  //   }
  //   else {
  //     publishDate = null;
  //   }
  //   console.log(heading, tags, description, category, publishDate, version);

  //   for (let i = 0; i < tags.length; i++) {
  //     if (tags[i] == "All") {
  //       this.tag_list[i] = "All";
  //     }
  //     else {
  //       this.tag_list[i] = tags[i]['value'];
  //     }

  //   }
  //   console.log(this.tag_list);

  //   return this.http.post(this.baseUrl, {
  //     article_category: category,
  //     article_headings: heading,
  //     article_tags: this.tag_list,
  //     article_description: description,
  //     article_imageurl: this.image_data,
  //     article_version: version,
  //     publish_date: publishDate,
  //   }, httpOptions).subscribe(
  //     response => {
  //       // console.log(response)
  //       this.Data = JSON.parse(JSON.stringify(response));
  //       console.log(this.Data.token);
  //       if (this.Data.token == '204') {
  //         this.toastmsg = "Please enter all required credentials";
  //         this.toast = false;
  //         setTimeout(() => {
  //           this.toast = true;
  //         }, 800);
  //       }
  //       else if (this.Data.token == '409') {
  //         this.toastmsg = "The article already exists";
  //         this.toast = false;
  //         setTimeout(() => {
  //           this.toast = true;
  //         }, 800);
  //       }
  //       else if (this.Data.token == '200') {
  //         this.toastmsg = "The article added successfully";
  //         this.toast = false;
  //         setTimeout(() => {
  //           this.toast = true;
  //         }, 800);
  //         location.reload();
  //       }

  //     }
  //   )


  // }
