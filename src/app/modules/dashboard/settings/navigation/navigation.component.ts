import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { ControlCentersService } from "app/core/services/control-centers.service";
import { BackendSettings, BackendSettingsHeaderDetails, SettingsService } from "app/core/services/settings.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export interface Color {
  key: string;
  value: string;
}

@Component({
  selector: 'panel-settings-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class SettingsNavigationComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  controlCenters: string[] = [];

  colors: Color[] = [{
    key: 'Blau',
    value: 'BLUE'
  }, {
    key: 'Grün',
    value: 'GREEN'
  }, {
    key: 'Orange',
    value: 'AMBER'
  }, {
    key: 'Rot',
    value: 'RED'
  }];

  settings: BackendSettings;

  form: FormGroup;

  selectedHeaderDetails: BackendSettingsHeaderDetails;

  flashMessage: 'success' | 'error' | undefined = undefined;
  flashMessageHeaderDetailsTop: 'success' | 'error' | undefined = undefined;
  flashMessageHeaderDetailsBottom: 'success' | 'error' | undefined = undefined;

  newHeaderDetailsItem: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,

    private _changeDetector: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

    private _controlCentersService: ControlCentersService,
    private _settingsService: SettingsService
  ) {

  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      index: [0, Validators.required],
      type: ['', Validators.required],
      label: ['', Validators.required],
      value: ['', Validators.required],
      color: ['', Validators.required]
    });

    this._controlCentersService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      const items = response.map((x) => x.type);
      this.controlCenters = [... new Set(items)];
    });

    this._settingsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.settings = response;
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

  closeHeaderDetailsEdit() {
    this.selectedHeaderDetails = undefined;
  }

  toggleHeaderDetailsEdit(id: string, type: 'TOP' | 'BOTTOM') {
    if (this.selectedHeaderDetails && this.selectedHeaderDetails?.id === id) {
      this.closeHeaderDetailsEdit();
      return;
    }

    if (type === 'TOP')
      this.selectedHeaderDetails = this.settings.headerDetailsTop.find((x) => x.id === id);
    if (type === 'BOTTOM')
      this.selectedHeaderDetails = this.settings.headerDetailsBottom.find((x) => x.id === id);

    if (this.selectedHeaderDetails)
      this.form.patchValue(this.selectedHeaderDetails);
  }

  deleteHeaderDetails(type: 'TOP' | 'BOTTOM') {
    if (this.selectedHeaderDetails?.id === undefined) {
      const confirmation = this._fuseConfirmationService.open({
        title: 'Neue Details anlegen.',
        message: 'Bist du dir sicher, die Erstellung eines neuen Details Bereich, abzubrechen?',
        actions: {
          confirm: {
            label: 'Ja, abbrechen!'
          },
          cancel: {
            label: 'Nein, weiter machen'
          }
        }
      });

      confirmation.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          this.newHeaderDetailsItem = false;
          this.closeHeaderDetailsEdit();

          if (type === 'TOP')
            this.settings.headerDetailsTop.shift();
          if (type === 'BOTTOM')
            this.settings.headerDetailsBottom.shift();

          this._changeDetector.markForCheck();
        }
      });
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Details löschen.',
      message: 'Bist du dir sicher das du dieses Details löschen willst?',
      actions: {
        confirm: {
          label: 'Ja, löschen!'
        },
        cancel: {
          label: 'Abbrechen'
        }
      }
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._settingsService.deleteHeaderDetails(this.selectedHeaderDetails.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
          this.closeHeaderDetailsEdit();
          this.loadSettings();
        }, (error) => {
          console.error(error);
          this.showFlashMessage(type, 'error');
        });
      }
    });
  }

  patchHeaderDetails(type: 'TOP' | 'BOTTOM') {
    const values = this.form.getRawValue();

    if (this.selectedHeaderDetails?.id === undefined) {
      this._settingsService.postHeaderDetails(values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        this.newHeaderDetailsItem = false;
        this.loadSettings();
        this.closeHeaderDetailsEdit();
        this.showFlashMessage(type, 'success');
      }, (error) => {
        console.error(error);
        this.showFlashMessage(type, 'error');
      });
      return;
    }
    this._settingsService.patchHeaderDetails(this.selectedHeaderDetails.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.newHeaderDetailsItem = false;
      this.loadSettings();
      this.showFlashMessage(type, 'success');
    }, (error) => {
      console.error(error);
      this.showFlashMessage(type, 'error');
    });
  }

  postHeaderDetails(type: 'TOP' | 'BOTTOM') {
    const index = (type === 'TOP' ? this.settings.headerDetailsTop.length : this.settings.headerDetailsBottom.length);

    const item: BackendSettingsHeaderDetails = {
      id: undefined,
      index: index,
      type: type,
      label: '',
      value: '',
      color: this.colors[0].value,
      updatedAt: new Date(),
      createdAt: new Date()
    };
    this.closeHeaderDetailsEdit();

    this.newHeaderDetailsItem = true;

    if (type === 'TOP')
      this.settings.headerDetailsTop = [item].concat(this.settings.headerDetailsTop);
    if (type === 'BOTTOM')
      this.settings.headerDetailsBottom = [item].concat(this.settings.headerDetailsBottom);

    this.selectedHeaderDetails = item;
    this.form.patchValue(item);
  }

  private showFlashMessage(type: 'TOP' | 'BOTTOM', action: 'success' | 'error' | null) {
    if (type === 'TOP')
      this.flashMessageHeaderDetailsTop = action;
    if (type === 'BOTTOM')
      this.flashMessageHeaderDetailsBottom = action;

    setTimeout(() => {
      if (type === 'TOP')
        this.flashMessageHeaderDetailsTop = undefined;
      if (type === 'BOTTOM')
        this.flashMessageHeaderDetailsBottom = undefined;
    }, 1000 * 3);
  }
}