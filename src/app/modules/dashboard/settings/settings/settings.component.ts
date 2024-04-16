import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { BackendSettings, SettingsService } from "app/core/services/settings.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export interface Color {
  key: string;
  value: string;
}

@Component({
  selector: 'panel-settings-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsSettingsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  settings: BackendSettings;

  form: FormGroup;

  flashMessage: 'success' | 'error' | undefined = undefined;

  constructor(
    private _formBuilder: FormBuilder,

    private _changeDetector: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

    private _settingsService: SettingsService
  ) {

  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      organisationName: ['', Validators.required],
      logoUrl: ['', Validators.required],
      loginPage: this._formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required]
      }),
      hasDutyNumber: [false]
    });

    this._settingsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.settings = response;

      this.form.patchValue({
        organisationName: response.organisationName,
        logoUrl: response.logoUrl,
        loginPage: response.loginPage,
        hasDutyNumber: response.options.hasDutyNumber
      });
    });

    this._settingsService.getSettings().pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadSettings() {
    this._settingsService.getSettings().pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  saveSettings() {
    const values = this.form.getRawValue();

    this._settingsService.patchSettings(this.settings.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loadSettings();
      this.showFlashMessage('success');
    }, (error) => {
      console.error(error);
      this.showFlashMessage('error');
    });
  }

  private showFlashMessage(action: 'success' | 'error' | null) {
    this.flashMessage = action;

    setTimeout(() => {
      this.flashMessage = undefined;
    }, 1000 * 3);
  }
}