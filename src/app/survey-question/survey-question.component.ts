import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

declare var $: any;

@Component({
  selector: 'app-survey-question',
  templateUrl: './survey-question.component.html',
  styleUrls: ['./survey-question.component.css']
})
export class SurveyQuestionComponent implements OnInit {

  languages = [{ lang: "English", name: "en" }];
  qn_types = [{ type: "Number", name: "int" }, { type: "Multi Select", name: "ms" }, { type: "Boolean", name: "bool" }];
  versions = [{ type: "Draft", "flag": false }, { type: "Publish", "flag": true }];
  Domain_uri = environment.DOMAIN_URI;
  mcq = true;
  mcq_create = true;
  def = true;
  def_int = true;
  selectedTeam = '';
  Data: any;
  toast = true;
  toastmsg: any;
  survey: any;
  page: number = 1;
  dummy: any = [];
  delete_survey_id: any;
  update_click_survey_id: any;
  ver = true;
  model: any;
  admin_token: any;
  default_tag = [];
  tag_list_update: any = [];
  mcq_choice_value :any = [];
  // position: number=0;
  schema: any;
  baseUrl: string = this.Domain_uri + 'api/admin/survey/qns';
  baseUrl1: string = this.Domain_uri + 'api/admin/survey';
  baseUrl2: string = this.Domain_uri + 'api/admin/update/survey';
  baseUrl3: string = this.Domain_uri + 'api/admin/delete/survey';
  // baseUrl: string = 'http://localhost:3000/api/admin/survey/qns';
  // baseUrl1: string = 'http://localhost:3000/api/survey';


  constructor(public router: Router, private fb: FormBuilder, private http: HttpClient) { }
  survey_questions = this.fb.group({
    language: [null],
    question: [''],
    description: [''],
    mcq_choice: [''],
    qn_type: [null],
    Default: [''],
    position: [''],
    version: [null],
    publishDate: ['']
  }
  )
  survey_questions_edit = this.fb.group({
    language: [null],
    question: [''],
    description: [''],
    mcq_choice: [''],
    qn_type: [null],
    Default: [''],
    position: [''],
    version: [null],
    publishDate: [{}]
  })
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
        console.log(this.Data);

        this.survey = this.Data.survey;

        for (let i = 0; i < this.survey.length; i++) {
          console.log((this.survey[i].question_type));
          if (this.survey[i].question_type == "int") {
            this.survey[i].question_type = "Integer"
          }
          else if (this.survey[i].question_type == "ms") {
            this.survey[i].question_type = "Multi Select"
          }
          else if (this.survey[i].question_type == "bool") {
            this.survey[i].question_type = "Boolean"
          }
          if(this.survey[i]["is_published"]){
            this.survey[i]["version"] = "Published";
          }
          else{
            this.survey[i]["version"] = "Draft";
          }

        }

      }
    )
  }

  logout(){
    localStorage.removeItem('Admin_token');
    this.router.navigateByUrl('/Bloom/admin/login');
}

  onSelected(value: any): void {


    this.selectedTeam = value;
    let a = this.selectedTeam.split(": ");
    console.log(a);

    // if(a[1] == 'ms'){
    //  this.mcq=false;
    // }
    // else if(a[1] == 'int' || a[1] == 'bool'){
    //   this.mcq=true;
    // }
    if (a[1] == 'int') {
      this.def_int = false;
      this.def = true;
      this.mcq = true;
      this.mcq_create = true;
    }
    else if (a[1] == 'ms') {
      this.def = false;
      this.def_int = true;
      this.mcq = false;
      this.mcq_create = false;
    }
    else if (a[1] == 'bool') {
      this.def = true;
      this.def_int = true;
      this.mcq = true;
      this.mcq_create = true;

    }

    if (a[1] == 'Draft') {
      this.ver = true;
    }
    else if (a[1] == 'Publish') {
      this.ver = false;
    }

    if (a[1] == 'false') {
      this.ver = true;
    }
    else if (a[1] == 'true') {
      this.ver = false;
    }
  }
  submit() {
    console.log(this.model);

    this.getLoginRes(this.survey_questions.value.language, this.survey_questions.value.question, this.survey_questions.value.description, this.survey_questions.value.mcq_choice, this.survey_questions.value.qn_type,
      this.survey_questions.value.Default, this.survey_questions.value.position, this.survey_questions.value.publishDate, this.survey_questions.value.version);
    console.log(this.survey_questions.value.qn_type);

  }
  update() {
    this.update_survey(this.survey_questions_edit.value.language, this.survey_questions_edit.value.question, this.survey_questions_edit.value.description, this.survey_questions_edit.value.mcq_choice, this.survey_questions_edit.value.qn_type,
      this.survey_questions_edit.value.Default, this.survey_questions_edit.value.position, this.survey_questions_edit.value.publishDate, this.survey_questions_edit.value.version);


  }
  getLoginRes(language: any, question: any, description: any, mcq_choice: any, qn_type: any, Default: any, position: any, publishDate: any, version: any) {

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

    for(let i=0;i<mcq_choice.length;i++){  
    this.mcq_choice_value[i] = mcq_choice[i]['value'];    
    }
    console.log(language, question, description, this.mcq_choice_value, qn_type, Default, position, publishDate, version);


    if (Default == '') {
      Default = null
    }
    else if (qn_type == 'ms') {
      Default = Default.split(",");
    }
    else if (qn_type == 'int') {
      Default = parseInt(Default);
    }
    console.log(mcq_choice.length);


    if (mcq_choice.length > 0) {

      // mcq_choice = mcq_choice.split(",");

      this.schema = {
        lang: language,
        question: question,
        question_description: description,
        question_type: qn_type,
        position: position,
        version: version,
        publish_date: publishDate,
        choice: this.mcq_choice_value,
        default: Default
      };
    }
    else {
      this.schema = {
        lang: language,
        question: question,
        question_description: description,
        question_type: qn_type,
        position: position,
        version: version,
        publish_date: publishDate,
        default: Default
      };

    }
    console.log(this.schema);

    return this.http.post(this.baseUrl, this.schema, httpOptions).subscribe(
      response => {

        console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));
        console.log(this.Data.token);
        if (this.Data.token == '204') {
          this.toastmsg = "Please enter all required credentials";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
        }
        // if(this.Data.token == '409'){
        //   this.toastmsg = "The question already exists!";
        //   this.toast=false;
        //   setTimeout(() => {
        //     this.toast=true;
        // }, 800);
        // }
        else if (this.Data.token == '200') {
          this.toastmsg = "Question added successfully!'";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
          // this.router.navigateByUrl('/');
          location.reload();
        }
      }
    )

  }
  update_survey(language: any, question: any, description: any, mcq_choice: any, qn_type: any, Default: any, position: any, publishDate: any, version: any) {
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

    if(!version){
      publishDate = null;
    }


    console.log(language, question, description, mcq_choice, qn_type, Default, position, version, publishDate);


    if (Default == '') {
      Default = null
    }
    else if (qn_type == 'Multi Select') {
      if (Default != null) {
        Default = Default.toString().split(",");
      }
    }
    else if (qn_type == 'Integer') {
      Default = parseInt(Default);
    }

    // var update_click_survey_id = localStorage.getItem("update_click_survey_id");
    var update_click_survey_id = this.update_click_survey_id;
    console.log(update_click_survey_id);

    if (mcq_choice != null) {

      for(let i=0;i< mcq_choice.length; i++){
        if(typeof mcq_choice[i] === "object"){
          this.tag_list_update[i] = mcq_choice[i]['value'];
        }
        else{
          this.tag_list_update[i] = mcq_choice[i];
        }
       }
       console.log(this.tag_list_update);

      // mcq_choice = mcq_choice.toString().split(",");

      this.schema = {
        survey_id: update_click_survey_id,
        question: question,
        question_description: description,
        position: position,
        version: version,
        publish_date: publishDate,
        choice: this.tag_list_update,
        default: Default
      };
    }
    else {
      this.schema = {
        survey_id: update_click_survey_id,
        question: question,
        question_description: description,
        position: position,
        version: version,
        publish_date: publishDate,
        default: Default
      };

    }
    console.log(this.schema);


    return this.http.post(this.baseUrl2, this.schema, httpOptions).subscribe(
      response => {

        console.log(response)
        this.Data = JSON.parse(JSON.stringify(response));

        if (this.Data.token == '200') {
          this.toastmsg = "Survey updated successfully!'";
          this.toast = false;
          setTimeout(() => {
            this.toast = true;
          }, 800);
          // this.router.navigateByUrl('/');
          location.reload();
        }
      }
    )
  }

  edit(item: any) {
    console.log(item);
    // localStorage.setItem("update_click_survey_id", item["_id"]);
    this.update_click_survey_id = item["_id"];
    var lang = item["lang"];
    var type = item["question_type"];
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

    if (lang == "EN") {
      lang = "en";
    }
    if (type == 'Integer') {
      this.def_int = false;
      this.def = true;
      this.mcq = true;
    }
    else if (type == 'Multi Select') {
      this.def = false;
      this.def_int = true;
      this.mcq = false;
    }
    else if (type == 'Boolean') {
      this.def = true;
      this.def_int = true;
      this.mcq = true;
    }
    
    if (version) {
      this.ver = false;
    }
    else {
      this.ver = true;
    }

    var choice_edit = item["choice"];
    console.log(choice_edit);

    if (choice_edit == undefined) {
      this.survey_questions_edit.setValue({
        language: item["lang"],
        question: item["question"],
        description: item["question_description"],
        mcq_choice: null,
        qn_type: type,
        Default: item["default"],
        position: item["position"],
        version: item["is_published"],
        publishDate: publish_date
      })
    }
    else {
      this.survey_questions_edit.setValue({
        language: item["lang"],
        question: item["question"],
        description: item["question_description"],
        mcq_choice: item["choice"],
        qn_type: type,
        Default: item["default"],
        position: item["position"],
        version: item["is_published"],
        publishDate: publish_date
      })

    }



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

    console.log(this.delete_survey_id);

    return this.http.post(this.baseUrl3, {
      del_survey_id: this.delete_survey_id,

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

  delete(item: any) {
    console.log("s");
    this.delete_survey_id = item["_id"];
    // localStorage.setItem("delete_survey_id",item["_id"]);

  }

  key: string = "";
  reverse: boolean = false;
  sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }
}
