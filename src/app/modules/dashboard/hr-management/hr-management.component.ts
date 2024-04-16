import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hr-management',
  template: `<router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None
})
export class HRManagementComponent implements OnInit {

  constructor() {
  
  }

  ngOnInit(): void {
    
  }
}
