import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { BackendDepartment, DepartmentsService } from "app/core/services/departments.service";
import { BackendGroup, GroupsService } from "app/core/services/groups.service";
import { UserService } from "app/core/services/user.service";
import { BackendVehicle, VehiclesService } from "app/core/services/vehicles.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'panel-settings-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class SettingsVehiclesComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  vehicles: BackendVehicle[] = [];

  groups: BackendGroup[] = [];
  departments: BackendDepartment[] = [];

  selected: BackendVehicle;

  selectedForm: FormGroup;

  newItem = false;

  flashMessage: 'success' | 'error' | null = null;

  constructor(
    private _formBuilder: FormBuilder,

    private _changeDetector: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

    private _groupService: GroupsService,
    private _departmentService: DepartmentsService,
    private _vehicleService: VehiclesService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.selectedForm = this._formBuilder.group({
      name: ['', Validators.required],
      licensePlate: ['', Validators.required],
      groupId: [''],
      departmentId: ['']
    });

    this._groupService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response;
    });

    this._departmentService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.departments = response;
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

  getGroup(item: BackendVehicle) {
    if (!(item.groupId))
      return '';
    const group = this.groups.find((x) => x.id === item.groupId);

    if (!(group))
      return '';
    return `${group.uniqueId}. ${group.name}`;
  }

  getDepartment(item: BackendVehicle) {
    if (!(item.departmentId))
      return '';
    const department = this.departments.find((x) => x.id === item.departmentId);

    if (!(department))
      return '';
    return `${department.name}`;
  }

  toggleEdit(id: string) {
    if (this.selected && this.selected.id === id) {
      this.closeEdit();
      return;
    }
    this.selected = this.vehicles.find((x) => x.id === id);
    this.selectedForm.patchValue(this.selected);
  }

  closeEdit() {
    this.selected = undefined;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  create() {
    const vehicle: BackendVehicle = {
      id: undefined,
      name: '',
      licensePlate: '',
      groupId: '',
      departmentId: '',
      updatedAt: new Date(),
      createdAt: new Date()
    }
    this.closeEdit();
    this.newItem = true;

    this.vehicles = [vehicle].concat(this.vehicles);
    this.selected = this.vehicles[0];
    this.selectedForm.patchValue(this.selected);
  }

  patch() {
    const values = this.selectedForm.getRawValue();

    if (this.selected.id === undefined) {
      this._vehicleService.post(values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
    this._vehicleService.patch(this.selected.id, values).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.newItem = false;
      this.load();
      this.showFlashMessage('success');
    }, (error) => {
      console.error(error);
      this.showFlashMessage('error');
    });;
  }

  delete() {
    if (this.selected.id === undefined) {
      const confirmation = this._fuseConfirmationService.open({
        title: 'Neues Fahrzeug anlegen.',
        message: 'Bist du dir sicher, die Erstellung eines neuen Fahrezeuges, abzubrechen?',
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
          this.vehicles.shift();
        }
      });
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Fahrzeug löschen.',
      message: 'Bist du dir sicher das du dieses Fahrzeug löschen willst?',
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
        this._vehicleService.delete(this.selected.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
    this._vehicleService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.vehicles = response;
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