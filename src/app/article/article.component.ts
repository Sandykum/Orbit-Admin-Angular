import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ImageUploadService } from '../image-upload.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

declare var $: any;
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  default_tag = ['All'];
  versions = [{ type: "Draft", "flag": false }, { type: "Publish", "flag": true }];
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

  constructor(public router: Router, private fb: FormBuilder, private http: HttpClient, private imageUploadService: ImageUploadService) {
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '130px',
  };

  article = this.fb.group({
    category: [null],
    heading: [''],
    tags: [''],
    description: [''],
    version: [null],
    publishDate: ['']
  })

  article_edit = this.fb.group({
    category: [null],
    heading: [''],
    tags: [''],
    description: [''],
    imageurl: [''],
    version: [null],
    publishDate: [{}]
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
  image_data: any = '';
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
        this.articles = this.Data.articles;
        console.log(this.articles);
        for (let i = 0; i < this.articles.length; i++) {
          console.log(this.articles[i]["is_published"]);

          if (this.articles[i]["is_published"]) {
            this.articles[i]["version"] = "Published";
          }
          else {
            this.articles[i]["version"] = "Draft";
          }
        }

        console.log(this.version_table);

      }
    )


  }
  // ngAfterViewInit(){
  //   var s = $("input").tagsinput('items');
  //   console.log(s);

  // }
  logout() {
    localStorage.removeItem('Admin_token');
    this.router.navigateByUrl('/Bloom/admin/login');
  }

  submit() {
    this.submitArticle(this.article.value.heading, this.article.value.tags, this.article.value.description, this.article.value.category,
      this.article.value.publishDate, this.article.value.version);
  }
  update() {
    this.updateArticle(this.article_edit.value.heading, this.article_edit.value.tags, this.article_edit.value.description, this.article_edit.value.imageurl, this.article_edit.value.category,
      this.article_edit.value.publishDate, this.article_edit.value.version);
  }
  submitArticle(heading: any, tags: any, description: any, category: any, publishDate: any, version: any) {
    // email = email.toString();
    // password = password.toString();
    this.admin_token = localStorage.getItem("Admin_token");
    console.log(this.admin_token);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.admin_token
      })
    };
    
    if (publishDate != null) {
      publishDate = publishDate["year"] + "-" + publishDate["month"] + "-" + publishDate["day"];

      const dateStr1 = publishDate;
      const date1 = new Date(dateStr1);
      const timestamp = date1.toJSON();
      publishDate = timestamp;
      console.log(timestamp);
    }
    else {
      publishDate = null;
    }
    console.log(heading, tags, description, category, publishDate, version);

    for (let i = 0; i < tags.length; i++) {
      if (tags[i] == "All") {
        this.tag_list[i] = "All";
      }
      else {
        this.tag_list[i] = tags[i]['value'];
      }

    }
    console.log(this.tag_list);

    return this.http.post(this.baseUrl, {
      article_category: category,
      article_headings: heading,
      article_tags: this.tag_list,
      article_description: description,
      article_imageurl: this.image_data,
      article_version: version,
      publish_date: publishDate,
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
          this.toastmsg = "The article already exists";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
        }
        else if (this.Data.token == '200') {
          this.toastmsg = "The article added successfully";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
          location.reload();
        }

      }
    )


  }
  updateArticle(heading: any, tags: any, description: any, imageurl: any, category: any, publishDate: any, version: any) {
    
    this.admin_token = localStorage.getItem("Admin_token");
    console.log(this.admin_token);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.admin_token
      })
    };

    var update_click_id = localStorage.getItem("update_click_id");
    console.log(update_click_id);
    if (publishDate != null) {
      publishDate = publishDate["year"] + "-" + publishDate["month"] + "-" + publishDate["day"];

      const dateStr1 = publishDate;
      const date1 = new Date(dateStr1);
      const timestamp = date1.toJSON();
      publishDate = timestamp;
      console.log(timestamp);
    }
    else {
      publishDate = null;
    }
     console.log(tags);
     for(let i=0;i< tags.length; i++){
      if(typeof tags[i] === "object"){
        this.tag_list_update[i] = tags[i]['value'];
      }
      else{
        this.tag_list_update[i] = tags[i];
      }
     }
     console.log(this.tag_list_update);
     
    // for (let i = 0; i < tags.length; i++) {
    //     this.tag_list_update[i] = tags[i]['value'];
    // }
    // tags = tags.concat(this.tag_list_update);
    // tags = tags.toString().split(',');
    console.log(heading, tags, description, imageurl, category, publishDate, version);

    return this.http.post(this.baseUrl2, {
      article_category: category,
      article_id: update_click_id,
      article_headings: heading,
      article_tags: this.tag_list_update,
      article_description: description,
      article_imageurl: imageurl,
      article_version: version,
      publish_date: publishDate

    }, httpOptions).subscribe(
      response => {
        this.Data = JSON.parse(JSON.stringify(response));
        // console.log(this.Data.token);
        // if(this.Data.token == '204')
        // {
        //   this.toastmsg = "Please enter all required credentials";
        //   this.toast=false;
        //   setTimeout(() => {
        //     this.toast=true;
        // }, 800);
        // }
        // else if(this.Data.token == '409'){
        //   this.toastmsg = "The article already exists";
        //   this.toast=false;
        //   setTimeout(() => {
        //     this.toast=true;
        // }, 800);
        // }
        if (this.Data.token == '200') {
          this.toastmsg = "The article updated successfully";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
          location.reload();
        }

      }
    )


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

    var delete_click_id = localStorage.getItem("delete_click_id");
    return this.http.post(this.baseUrl3, {
      article_id: delete_click_id,
    }, httpOptions).subscribe(
      response => {
        console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));
        if (this.Data.token == '200') {
          this.toastmsg = "The article deleted successfully";
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
    localStorage.setItem("update_click_id", item["_id"]);
    var version = item["is_published"];

    var publish_date = item["publish_date"];

    if (publish_date != null) {
      var publish_date_flag = publish_date.split('T');
      publish_date_flag = publish_date_flag[0].split('-');
      var year = parseInt(publish_date_flag[0]);
      var month = parseInt(publish_date_flag[1]);
      var date = parseInt(publish_date_flag[2]);
      publish_date = { year: year, month: month, day: date };
    }

    if (version) {
      this.ver = false;
    }
    else {
      this.ver = true;

    }
    this.article_edit.setValue({
      category: item["category"],
      heading: item["heading"],
      tags: item["tags"],
      description: item["description test111111"],
      imageurl: item["thumbnail_url"],
      version: version,
      publishDate: publish_date
    })
  }

  delete(item: any) {
    console.log("s");

    localStorage.setItem("delete_click_id", item["_id"]);
  }

  onSelected(value: any): void {

    this.selectedTeam = value;
    let a = this.selectedTeam.split(": ");
    console.log(a);

    if (a[1] == 'false') {
      this.ver = true;
    }
    else if (a[1] == 'true') {
      this.ver = false;
    }
  }

  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0];
  }

  upload() {
    // const file = event.target.files[0];
    if (this.file) {
      const formdata = new FormData();
      formdata.append('file', this.file);
      console.log(formdata);
      this.http.post(this.Domain_uri + 'api/admin/upload/article', formdata).subscribe(
        (response) => {
          this.Data = JSON.parse(JSON.stringify(response));
          if (this.Data.token == 400) {
            this.toastmsg = this.Data.msg;
            this.toast = false;
            setTimeout(() => {
              this.toast = true;
            }, 800);
          }
          else if (this.Data.token == 409) {
            this.toastmsg = this.Data.msg;
            this.toast = false;
            setTimeout(() => {
              this.toast = true;
            }, 800);
          }
          this.image_data = this.Data.Location;
          console.log(this.image_data);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      this.toastmsg = "Please Upload the File !!";
      this.toast = false;
      setTimeout(() => {
        this.toast = true;
      }, 800);
    }


  }
  clear() {
    this.searchInput.nativeElement.value = '';
    this.file = null;
  }



}

