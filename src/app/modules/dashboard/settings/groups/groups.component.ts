import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import { BackendUpload } from 'app/core/services/upload.service';
import { UserService } from 'app/core/services/user.service';
import { Permissions, SharedModule } from 'app/shared/shared.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'panel-settings-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class SettingsGroupsComponent implements OnInit, OnDestroy {

  groups: BackendGroup[] = [];

  selected: BackendGroup;

  selectedForm: FormGroup;

  newItem = false;

  flashMessage: 'success' | 'error' | null = null;

  permissions: Permissions[] = [];

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _sharedModule: SharedModule,
    private _formBuilder: FormBuilder,

    private _changeDetector: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

    private _groupsService: GroupsService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.permissions = this._sharedModule.getPermissions;

    this.selectedForm = this._formBuilder.group({
      uniqueId: [0, Validators.required],
      name: ['', Validators.required],
      shortName: [''],
      division: [''],
      permissions: [[], Validators.required],
      showInOverview: [false]
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
    const group = this.groups.find((x) => x.id === id);

    if (!(group.data)) {
      group.data = {};
    }

    if (!(group.data['equipments'])) {
      group.data['equipments'] = JSON.parse(JSON.stringify(this._sharedModule.getEquipments));
    }

    if (!(group.data['equipmentsEvent'])) {
      group.data['equipmentsEvent'] = JSON.parse(JSON.stringify(this._sharedModule.getEquipments));
    }

    this.selected = group;
    this.selectedForm.patchValue(this.selected);
  }

  closeEdit() {
    this.selected = undefined;
  }

  get getPermissions(): FormArray {
    if (!(this.selectedForm)) {
      return undefined;
    }
    return this.selectedForm.controls.permissions as FormArray;
  }

  selectAllPermissions() {
    if (!(this.selectedForm)) {
      return;
    }
    const values: string[] = this.getPermissions.value;

    this.permissions.forEach((category) => {
      category.items.forEach((item) => {
        if (!(values.includes(item.value))) {
          values.push(item.value);
        }
      });
    });
  }

  unselectAllPermissions() {
    if (!(this.selectedForm)) {
      return;
    }
    this.getPermissions.setValue([]);
  }

  changePermissions(permission: string, event: any) {
    if (!(this.selectedForm)) {
      return;
    }
    const values: string[] = this.getPermissions.value;

    if (event.checked) {
      if (!(values.includes(permission))) {
        values.push(permission);
      }
      return;
    }
    if (!(values.includes(permission))) {
      return;
    }
    values.splice(values.indexOf(permission), 1);
  }

  checkPermission(value: string) {
    if (!(this.selectedForm)) {
      return false;
    }
    const permissions = this.getPermissions.value;
    return permissions.includes(value);
  }

  fileBrowseHandler(key: string, upload: BackendUpload) {
    if (!(this.selected)) {
      return;
    }
    if (!(this.selected.data)) {
      this.selected.data = {};
    }

    if (upload) {
      this.selected.data[key] = upload.uri;
      return;
    }
    delete this.selected.data[key];
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  create() {
    const group: BackendGroup = {
      id: undefined,
      uniqueId: 0,
      name: '',
      shortName: '',
      permissions: [],
      data: {},
      default: false,
      updatedAt: new Date(),
      createdAt: new Date()
    };

    this.closeEdit();
    this.newItem = true;

    if (!(group.data['equipments'])) {
      group.data['equipments'] = JSON.parse(JSON.stringify(this._sharedModule.getEquipments));
    }

    if (!(group.data['equipmentsEvent'])) {
      group.data['equipmentsEvent'] = JSON.parse(JSON.stringify(this._sharedModule.getEquipments));
    }

    this.groups = [group].concat(this.groups);
    this.selected = this.groups[0];
    this.selectedForm.patchValue(this.selected);
  }

  patch() {
    const values = this.selectedForm.getRawValue();

    if (this.selected.data) {
      values.data = this.selected.data;
    }

    if (this.selected.data['equipments']) {
      const amounts = this.selected.data['equipments'].reduce((n, { amount }) => n + amount, 0);

      if (amounts === 0) {
        delete this.selected.data['equipments'];
      }
    }

    if (this.selected.data['equipmentsEvent']) {
      const amounts = this.selected.data['equipmentsEvent'].reduce((n, { amount }) => n + amount, 0);

      if (amounts === 0) {
        delete this.selected.data['equipmentsEvent'];
      }
    }

    if (this.selected.id === undefined) {
      this._groupsService.post(values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
    this._groupsService.patch(this.selected.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.newItem = false;
      this.load();
      this.showFlashMessage('success');
    }, (error) => {
      console.error(error);
      this.showFlashMessage('error');
    });;
  }

  delete() {
    if (this.selected.default) {
      return;
    }
    if (this.selected.id === undefined) {
      const confirmation = this._fuseConfirmationService.open({
        title: 'Neuen Rang anlegen.',
        message: 'Bist du dir sicher, die Erstellung eines neuen Ranges, abzubrechen?',
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
          this.groups.shift();
        }
      });
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Rang löschen.',
      message: 'Bist du dir sicher das du diesen Rang löschen willst?',
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
        this._groupsService.delete(this.selected.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
    this._groupsService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response;
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
