import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'profile',
  template: `<router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  constructor() {
  
  }

  ngOnInit(): void {
    
  }
}
