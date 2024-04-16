import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'information',
  template: `<router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None
})
export class InformationComponent implements OnInit {

  constructor() {
  
  }

  ngOnInit(): void {
    
  }
}
