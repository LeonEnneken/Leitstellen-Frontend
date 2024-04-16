import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { BackendControlCenter, ControlCentersService } from "app/core/services/control-centers.service";
import { UserService } from "app/core/services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'panel-settings-control-centers',
  templateUrl: './control-centers.component.html',
  styleUrls: ['./control-centers.component.scss']
})
export class SettingsControlCentersComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  controlCenters: BackendControlCenter[] = [];

  selected: BackendControlCenter;

  selectedForm: FormGroup;

  newItem = false;

  flashMessage: 'success' | 'error' | null = null;

  constructor(
    private _formBuilder: FormBuilder,

    private _changeDetector: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

    private _controlCentersService: ControlCentersService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.selectedForm = this._formBuilder.group({
      label: ['', Validators.required],
      type: ['', Validators.required],
      color: [''],
      hasStatus: [false],
      hasVehicle: [false],
      maxMembers: [-1, Validators.required]
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
    this.selected = this.controlCenters.find((x) => x.id === id);
    this.selectedForm.patchValue(this.selected);
  }

  closeEdit() {
    this.selected = undefined;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  create() {
    const controlCenter: BackendControlCenter = {
      id: undefined,
      label: '',
      type: '',
      hasStatus: false,
      hasVehicle: false,
      maxMembers: -1,
      members: [],
      updatedAt: new Date(),
      createdAt: new Date()
    }
    this.closeEdit();
    this.newItem = true;

    this.controlCenters = [controlCenter].concat(this.controlCenters);
    this.selected = this.controlCenters[0];
    this.selectedForm.patchValue(this.selected);
  }

  patch() {
    const values = this.selectedForm.getRawValue();

    if (this.selected.id === undefined) {
      this._controlCentersService.post(values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
    this._controlCentersService.patch(this.selected.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
        title: 'Neues Panel anlegen.',
        message: 'Bist du dir sicher, die Erstellung eines neuen Panels, abzubrechen?',
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
          this.controlCenters.shift();
        }
      });
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Panel löschen.',
      message: 'Bist du dir sicher das du dieses Panel löschen willst?',
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
        this._controlCentersService.delete(this.selected.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
    this._controlCentersService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.controlCenters = response;
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