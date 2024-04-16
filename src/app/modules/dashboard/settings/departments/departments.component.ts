import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { BackendDepartment, DepartmentsService } from "app/core/services/departments.service";
import { UserService } from "app/core/services/user.service";
import { Permissions, SharedModule } from "app/shared/shared.module";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'panel-settings-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class SettingsDepartmentsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  departments: BackendDepartment[] = [];

  selected: BackendDepartment;

  selectedForm: FormGroup;

  newItem = false;

  flashMessage: 'success' | 'error' | null = null;

  permissions: Permissions[] = [];

  constructor(
    private _sharedModule: SharedModule,
    private _formBuilder: FormBuilder,

    private _changeDetector: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

    private _departmentsService: DepartmentsService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.permissions = this._sharedModule.getPermissions;

    this.selectedForm = this._formBuilder.group({
      name: ['', Validators.required],
      permissions: [[], Validators.required]
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
    this.selected = this.departments.find((x) => x.id === id);
    this.selectedForm.patchValue(this.selected);
  }

  closeEdit() {
    this.selected = undefined;
  }

  get getPermissions(): FormArray {
    if (!(this.selectedForm))
      return undefined;
    return this.selectedForm.controls.permissions as FormArray;
  }

  selectAllPermissions() {
    if (!(this.selectedForm))
      return;
    const values: string[] = this.getPermissions.value;

    this.permissions.forEach((category) => {
      category.items.forEach((item) => {
        if (!(values.includes(item.value)))
          values.push(item.value);
      });
    });
  }

  unselectAllPermissions() {
    if (!(this.selectedForm))
      return;
    this.getPermissions.setValue([]);
  }

  changePermissions(permission: string, event: any) {
    if (!(this.selectedForm))
      return;
    const values: string[] = this.getPermissions.value;

    if (event.checked) {
      if (!(values.includes(permission)))
        values.push(permission);
      return;
    }
    if (!(values.includes(permission)))
      return;
    values.splice(values.indexOf(permission), 1);
  }

  checkPermission(value: string) {
    if (!(this.selectedForm))
      return false;
    const permissions = this.getPermissions.value;
    return permissions.includes(value);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  create() {
    const department: BackendDepartment = {
      id: undefined,
      name: '',
      permissions: [],
      default: false,
      updatedAt: new Date(),
      createdAt: new Date()
    }

    this.closeEdit();
    this.newItem = true;

    this.departments = [department].concat(this.departments);
    this.selected = this.departments[0];
    this.selectedForm.patchValue(this.selected);
  }

  patch() {
    const values = this.selectedForm.getRawValue();

    if (this.selected.id === undefined) {
      this._departmentsService.post(values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
    this._departmentsService.patch(this.selected.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.newItem = false;
      this.load();
      this.showFlashMessage('success');
    }, (error) => {
      console.error(error);
      this.showFlashMessage('error');
    });;
  }

  delete() {
    if(this.selected.default)
      return;
    if(this.selected.id === undefined) {
      const confirmation = this._fuseConfirmationService.open({
        title: 'Neue Abteilung anlegen.',
        message: 'Bist du dir sicher, die Erstellung eines neuen Abteilung, abzubrechen?',
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
          this.departments.shift();
        }
      });
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Abteilung löschen.',
      message: 'Bist du dir sicher das du diese Abteilung löschen willst?',
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
        this._departmentsService.delete(this.selected.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
    this._departmentsService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.departments = response;
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