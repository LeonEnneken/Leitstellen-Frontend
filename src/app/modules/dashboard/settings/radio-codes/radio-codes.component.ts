import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { BackendRadioCode, RadioCodesService } from "app/core/services/radio-codes.service";
import { UserService } from "app/core/services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

interface Type {
  label: string;
  value: string;
}

@Component({
  selector: 'panel-settings-radio-codes',
  templateUrl: './radio-codes.component.html',
  styleUrls: ['./radio-codes.component.scss']
})
export class SettingsRadioCodesComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  radioCodes: BackendRadioCode[] = [];

  selected: BackendRadioCode;

  selectedForm: FormGroup;

  newItem = false;

  flashMessage: 'success' | 'error' | null = null;

  types: Type[] = [{
    label: 'Normaler Code',
    value: 'NORMAL'
  }, {
    label: 'Wichtiger Code',
    value: 'INFO'
  }, {
    label: 'Notfall/Panik Code',
    value: 'WARN'
  }];


  constructor(
    private _formBuilder: FormBuilder,

    private _changeDetector: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

    private _radioCodesService: RadioCodesService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.selectedForm = this._formBuilder.group({
      type: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required]
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
    this.selected = this.radioCodes.find((x) => x.id === id);
    this.selectedForm.patchValue(this.selected);
  }

  closeEdit() {
    this.selected = undefined;
  }

  getType(radioCode: BackendRadioCode) {
    return this.types.find((x) => x.value === radioCode.type)?.label ?? 'Nicht gefunden!';
  }

  getStyle(radioCode: BackendRadioCode) {
    return {
      'bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-50': radioCode.type === 'INFO',
      'bg-accent-200 text-accent-800 dark:bg-accent-600 dark:text-accent-50': radioCode.type === 'NORMAL',
      'bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-50': radioCode.type === 'WARN'
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  create() {
    const radioCode: BackendRadioCode = {
      id: undefined,
      type: 'NORMAL',
      code: '',
      description: '',
      updatedAt: new Date(),
      createdAt: new Date()
    }
    this.closeEdit();
    this.newItem = true;

    this.radioCodes = [radioCode].concat(this.radioCodes);
    this.selected = this.radioCodes[0];
    this.selectedForm.patchValue(this.selected);
  }

  patch() {
    const values = this.selectedForm.getRawValue();

    if (this.selected.id === undefined) {
      this._radioCodesService.post(values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        this.newItem = false;
        this.load();
        this.closeEdit();
        this.showFlashMessage('success');
      }, (error) => {
        console.error(error);
        this.showFlashMessage('error');
      });
      return;
    }
    this._radioCodesService.patch(this.selected.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.newItem = false;
      this.load();
      this.showFlashMessage('success');
    }, (error) => {
      console.error(error);
      this.showFlashMessage('error');
    });;
  }

  delete() {
    if(this.selected.id === undefined) {
      const confirmation = this._fuseConfirmationService.open({
        title: 'Neuen Funk-Code anlegen.',
        message: 'Bist du dir sicher, die Erstellung eines neuen Funk-Codes, abzubrechen?',
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
        if(result === 'confirmed') {
          this.newItem = false;
          this.closeEdit();
          this.radioCodes.shift();
        }
      });
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Funk-Code löschen.',
      message: 'Bist du dir sicher das du diesen Funk-Code löschen willst?',
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
      if(result === 'confirmed') {
        this._radioCodesService.delete(this.selected.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
          this.closeEdit();
          this.load();
        }, (error) => {
          console.error(error);
          this.showFlashMessage('error');
        });
      }
    });
  }

  private load() {
    this._radioCodesService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.radioCodes = response;
      this._changeDetector.markForCheck();
    });
  }

  private showFlashMessage(type: 'success' | 'error' | null) {
    this.flashMessage = type;

    setTimeout(() => {
      this.flashMessage = null;
    }, 1000 * 3);
  }
}