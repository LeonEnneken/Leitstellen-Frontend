import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { BackendSettings, BackendSettingsControlCenterStatus, SettingsService } from "app/core/services/settings.service";
import { UserService } from "app/core/services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

interface Type {
  label: string;
  value: string;
}

@Component({
  selector: 'panel-settings-control-center-status',
  templateUrl: './control-center-status.component.html',
  styleUrls: ['./control-center-status.component.scss'],
  animations: fuseAnimations
})
export class SettingsControlCenterStatusComponent implements OnInit, OnDestroy {

  colors: Type[] = [{
    label: 'Blau',
    value: 'BLUE'
  }, {
    label: 'Rot',
    value: 'RED'
  }, {
    label: 'Amber',
    value: 'AMBER'
  }, {
    label: 'Grün',
    value: 'GREEN'
  }];

  private _unsubscribeAll: Subject<any> = new Subject();

  private settings: BackendSettings;

  status: BackendSettingsControlCenterStatus[] = [];

  selected: BackendSettingsControlCenterStatus;

  selectedForm: FormGroup;

  newItem = false;

  flashMessage: 'success' | 'error' | null = null;

  submitted = false;

  constructor(
    private _formBuilder: FormBuilder,

    private _changeDetector: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

    private _userService: UserService,
    private _settingsService: SettingsService
  ) {

  }

  ngOnInit(): void {
    this.selectedForm = this._formBuilder.group({
      label: ['', Validators.required],
      value: ['', Validators.required],
      color: ['', Validators.required]
    });

    this.load();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  hasPermissions(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  toggleEdit(id: string) {
    if (this.selected && this.selected.id === id) {
      this.closeEdit();
      return;
    }
    this.selected = this.status.find((x) => x.id === id);
    this.selectedForm.patchValue(this.selected);
  }

  closeEdit() {
    this.selected = undefined;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  create() {
    const status: BackendSettingsControlCenterStatus = {
      id: undefined,
      settingsId: undefined,
      label: '',
      value: '',
      color: 'BLUE',
      updatedAt: new Date(),
      createdAt: new Date()
    };

    this.closeEdit();
    this.newItem = true;

    this.status = [status].concat(this.status);
    this.selected = this.status[0];
    this.selectedForm.patchValue(this.selected);
  }

  patch() {
    this.submitted = true;
    const values = this.selectedForm.getRawValue();

    if (this.selected.id === undefined) {
      this._settingsService.postControlCenterStatus(this.settings.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        this.submitted = false;
        this.newItem = false;
        this.load();
        this.closeEdit();
        this.showFlashMessage('success');
      }, (error) => {
        this.submitted = false;
        console.error(error);
        this.showFlashMessage('error');
      });
      return;
    }
    this._settingsService.patchControlCenterStatus(this.settings.id, this.selected.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.submitted = false;
      this.newItem = false;
      this.load();
      this.showFlashMessage('success');
    }, (error) => {
      this.submitted = false;
      console.error(error);
      this.showFlashMessage('error');
    });;
  }

  delete() {
    if (this.selected.id === undefined) {
      const confirmation = this._fuseConfirmationService.open({
        title: 'Neuen Status anlegen.',
        message: 'Bist du dir sicher, die Erstellung eines neuen Status, abzubrechen?',
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
          this.newItem = false;
          this.closeEdit();
          this.status.shift();
        }
      });
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Status löschen.',
      message: 'Bist du dir sicher das du diesen Status löschen willst?',
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
        this.submitted = true;

        this._settingsService.deleteControlCenterStatus(this.settings.id, this.selected.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
          this.submitted = false;
          this.closeEdit();
          this.load();
        }, (error) => {
          this.submitted = false;
          console.error(error);
          this.showFlashMessage('error');
        });
      }
    });
  }

  private load() {
    this._settingsService.getSettings().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.settings = response;
      this.status = response.controlCenterStatus;
      this._changeDetector.markForCheck();
    });
  }

  private showFlashMessage(type: 'success' | 'error' | null) {
    this.flashMessage = type;
    this._changeDetector.markForCheck();

    setTimeout(() => {
      this.flashMessage = undefined;
      this._changeDetector.markForCheck();
    }, 1000 * 3);
  }
}