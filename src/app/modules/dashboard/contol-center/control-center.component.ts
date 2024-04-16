import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'control-center',
  template: `<router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None
})
export class ControlCenterComponent implements OnInit {

  constructor() {

  }
  
  ngOnInit(): void {
    
  }
}