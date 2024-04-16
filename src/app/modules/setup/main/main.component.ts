import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendSettings, SettingsService } from 'app/core/services/settings.service';
import { UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'setup-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SetupMainComponent implements OnInit {

  form: FormGroup;

  settings: BackendSettings;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder, 
    private settingsService: SettingsService,
    private userService: UserService) {

  }

  ngOnInit(): void {
    this.settingsService.getSettings().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.settings = response;
    });

    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  setupUser() {
    if (!(this.form.valid))
      return;
    this.form.disable();

    const id = this.form.controls.id.value;
    const firstName = this.form.controls.firstName.value;
    const lastName = this.form.controls.lastName.value;
    const phoneNumber = this.form.controls.phoneNumber.value;

    this.userService.setupUser({
      id, firstName, lastName, phoneNumber
    }).subscribe((user) => {
      this.router.navigate(['dashboard']);
    });
  }
}
