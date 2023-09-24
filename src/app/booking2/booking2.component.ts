import { Component, ElementRef, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ImageUploadService } from '../image-upload.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbTimeStruct, NgbTimepickerConfig, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-booking2',
  templateUrl: './booking2.component.html',
  styleUrls: ['./booking2.component.css'],
  providers: [NgbTimepickerConfig],
 

})
export class Booking2Component implements OnInit {
  versions = [{ type: "Ticket 1", "flag": false }, { type: "Ticket 2", "flag": true }];

  @ViewChild('searchInput') searchInput: ElementRef | any;
  rows:any = [];
  // model: any;  

  constructor(config: NgbTimepickerConfig,public router: Router, private fb: FormBuilder, private http: HttpClient, private imageUploadService: ImageUploadService) {
    config.seconds = false;
		config.spinners = false;
  }
 
  // var myApp = angular.module('myApp', ['moment-picker']);

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '130px',
  };

  // article = this.fb.group({
    
  //   Date: [''],
  //   version: [null],
  //   count: ['']
  // })

  // article_edit = this.fb.group({
  //   heading: [''],
  //   description: [''],
  //   publishDate: ['']
  // })

 
  // Data: any;
  // toast = true;
  // toastmsg: any;
  // articles: any;
  // tag_list: any = [];
  // tag_list_update: any = [];
  // file: File | any = null;
  // image_data1: any = '';
  // image_data : any = '';

  date:any= '';
  ticket_type = '';
  time_from = { hour: 0, minute: 0 };
  time_to = { hour: 0, minute: 0 };
  meridian = true;
  ngOnInit(): any {
    this.rows = [{
      from_date: '',
      count:'',
      to_date:''
      // from_h:'',
      // from_m:'',
      // from_am:'',
      // from_h:'',
      // from_m:'',
      // from_am:'',
  }]

  // this.http.get('http://localhost:3000/api/getslot/?ticket_type='+this.ticket_type+'&created_on='+this.date+'24-09-2023').subscribe(
  //   response=>{
      
  //     const articles=JSON.parse(JSON.stringify(response));
      
  //     console.log(articles)
  //   }
  // )

  }
  updateslot(){
    const created_on= this.date['day'].toString().padStart(2, '0')+"-"+this.date['month'].toString().padStart(2, '0')+'-'+this.date['year'];
console.log('http://localhost:3000/api/getslot/?ticket_type='+this.ticket_type+'&created_on='+created_on)
    this.http.get('http://localhost:3000/api/getslot/?ticket_type='+this.ticket_type+'&created_on='+created_on).subscribe(
      response=>{
        
        const articles=JSON.parse(JSON.stringify(response));

        this.rows=[];
        console.log(articles['Slot'][0]['slots'])
       

        for(let i=0;i<articles['Slot'][0]['slots'].length;i++){


          let time = articles['Slot'][0]['slots'][i].split("-", 2);
          console.log(time)
          let form_time = time[0].split(":", 2)
          let to_time = time[1].split(":", 2)
          let fromtimeStruct: NgbTimeStruct ={hour:parseInt(form_time[0]),minute:parseInt(form_time[1]),second:0}
          let totimeStruct: NgbTimeStruct ={hour:parseInt(form_time[0]),minute:parseInt(form_time[1]),second:0}


          this.rows.push({
            from_date:fromtimeStruct,
            count:articles['Slot'][0]['count'][i],
            to_date:totimeStruct
          })
        }

        console.log(this.rows);
      }
    )
  }
  addRow() {
  let row = {from_date: "", count: "",to_date:""};
  this.rows.push(row);
  }
  deleteRow(index:any) {
  this.rows.splice(index, 1);
  }
  submit(){
//     {
//       "created_on":"24-09-2023",
//       "ticket_type":"Ticket2",
//       "slots":["1-2","2-3"],
//       "count":[10,5]

// }
const created_on= this.date['day'].toString().padStart(2, '0')+"-"+this.date['month'].toString().padStart(2, '0')+'-'+this.date['year'];
let slots=[];
let count=[];
// console.log(this.rows[0]['from_date']['minute'].toString().padStart(2, '0'));
for(let i=0 ; i<this.rows.length;i++){
  console.log(this.rows[i]['from_date']);
  slots.push(this.rows[i]['from_date']['hour'].toString().padStart(2, '0')+":"+this.rows[i]['from_date']['minute'].toString().padStart(2, '0') + "-"+ this.rows[i]['to_date']['hour'].toString().padStart(2, '0')+":"+this.rows[i]['to_date']['minute'].toString().padStart(2, '0'))
  count.push(this.rows[i]['count'])
}

const slot={
  "created_on":created_on,
  "ticket_type":this.ticket_type,
  "slots":slots,
  "count":count
}


 this.http.post('http://localhost:3000/api/slotbook',slot).subscribe(
      response=>{
        
        const articles=JSON.parse(JSON.stringify(response));
        
        console.log(articles)
      }
    )

  // console.log(this.rows,this.date,this.ticket_type,this.rows.length);

  // console.log(this.article.value.Date, this.article.value.version);
  }

}
