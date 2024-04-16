import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BackendSettings, FieldOfStudy, SettingsService, Training } from 'app/core/services/settings.service';
import { BackendUser, UserService } from 'app/core/services/user.service';

@Component({
  selector: 'profile-own',
  templateUrl: './own.component.html',
  styleUrls: ['./own.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileOwnComponent implements OnInit {

  user: BackendUser;

  settings: BackendSettings;

  constructor(private userService: UserService, private settingsService: SettingsService) {

  }

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.settingsService.get.subscribe((response) => {
      if(!(response))
        return;
      this.settings = response;
    });
  }

  hasPermissions(permission: string) {
    return this.userService.hasPermissions(permission);
  }

  getTraining(training: Training) {
    if(!(this.user.data) ||!(this.user.data.trainings))
      return false;
    return this.user.data.trainings[training.key] || false;
  }

  getFieldOfStudy(fieldOfStudy: FieldOfStudy) {
    if(!(this.user.data) ||!(this.user.data.fieldOfStudy))
      return false;
    return this.user.data.fieldOfStudy[fieldOfStudy.key] || false;
  }
}
