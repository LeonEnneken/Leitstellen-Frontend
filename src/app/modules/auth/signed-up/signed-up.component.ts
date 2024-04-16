import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'auth-signed-up',
  templateUrl: './signed-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuthSignedUpComponent implements OnInit {

  constructor() {
  
  }

  ngOnInit(): void {

  }
}
