import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'admin',
  template: `<router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

  constructor() {

  }
  
  ngOnInit(): void {
    
  }
}