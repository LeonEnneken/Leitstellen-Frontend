import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BackendDepartment, DepartmentsService } from 'app/core/services/departments.service';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import { BackendMember, MembersService } from 'app/core/services/members.service';
import { BackendSettings, FieldOfStudy, SettingsService, Training } from 'app/core/services/settings.service';
import { BackendUser, UserService } from 'app/core/services/user.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hr-management-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class HRManagementMembersComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) private _sort: MatSort;

  settings: BackendSettings;

  statusFilter: 'ALL' | 'ON_DUTY' | 'OFF_DUTY' | 'AWAY_FROM_KEYBOARD' | 'OFFLINE' = 'ALL';

  user: BackendUser = undefined;

  members: BackendMember[];

  terminatedMembers: BackendMember[];

  departments: BackendDepartment[] = [];
  groups: BackendGroup[] = [];

  selected: BackendMember | null = null;
  selectedForm: FormGroup;
  selectedFieldOfStudyForm: FormGroup;
  selectedTrainingsForm: FormGroup;

  fieldOfStudy: FieldOfStudy[] = [];
  trainings: Training[] = [];

  searchInputControl: FormControl = new FormControl();

  searchValue: string = '';

  submitted: boolean = false;

  flashMessage: 'success' | 'error' | null = null;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _departmentsService: DepartmentsService,
    private _groupsService: GroupsService,
    private _membersService: MembersService,
    private _userService: UserService,
    private _settingsService: SettingsService,

    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService) {

  }

  ngOnInit(): void {
    this._settingsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.settings = response;

      if (!(response)) {
        return;
      }
      if (!(this.selectedFieldOfStudyForm) && this.settings.fieldOfStudy) {
        this.fieldOfStudy = response.fieldOfStudy;

        const form: { [key: string]: any } = {};

        this.fieldOfStudy.forEach((item) => {
          form[item.key] = (item.type === 'BOOLEAN' ? [false] : (item.type === 'NUMBER' ? [0] : ['']));
        });
        this.selectedFieldOfStudyForm = this._formBuilder.group(form);
      }

      if (!(this.selectedTrainingsForm) && this.settings.trainings) {
        this.trainings = response.trainings;

        const form: { [key: string]: any } = {};

        this.trainings.forEach((item) => {
          form[item.key] = (item.type === 'BOOLEAN' ? [false] : (item.type === 'NUMBER' ? [0] : ['']));
        });
        this.selectedTrainingsForm = this._formBuilder.group(form);
      }
    });

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.user = response;
    });

    this._departmentsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.departments = response;
    });

    this._groupsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response;
    });

    setTimeout(() => {
      this.loadMembers(true);
    }, 250);

    this.selectedForm = this._formBuilder.group({
      id: ['', Validators.required],
      groupId: ['', Validators.required],
      departmentIds: [[], Validators.required],
      dutyNumber: [''],
      notes: [''],
      hiredDate: ['', Validators.required],
      lastPromotionDate: ['', Validators.required],
      user: this._formBuilder.group({
        id: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        status: ['OFFLINE', Validators.required]
      }),
      terminatedAt: [''],
      terminated: [false]
    });

    this.searchInputControl.valueChanges.pipe(takeUntil(this._unsubscribeAll), debounceTime(300), switchMap((query) => {
      this.searchValue = query;

      if (this.selected) {
        this.selected = undefined;
      }
      return of(true);
    })).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getGroup(groupId: string) {
    return this.groups.find((x) => x.id === groupId);
  }

  getDepartment(departmentId: string) {
    return this.departments.find((x) => x.id === departmentId);
  }


  hasGroup(group: BackendGroup) {
    if (!(this.user)) {
      return true;
    }
    if (this.user.role === 'ADMINISTRATOR') {
      return false;
    }
    if (this.user.group.uniqueId >= 29) {
      return false;
    }
    return this.user.group.uniqueId <= group.uniqueId;
  }

  hasPermission(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  closeEdit() {
    this.selected = undefined;
  }

  toggleEdit(memberId: string) {
    if (!(this.hasPermission('MEMBERS_MANAGE'))) {
      return;
    }
    if (this.selected && this.selected.id === memberId) {
      this.closeEdit();
      return;
    }
    this.selected = this.members.find((x) => x.id === memberId);

    if (!(this.selected)) {
      this.selected = this.terminatedMembers.find((x) => x.id === memberId);
    }

    const fieldOfStudyData: any = {};

    this.fieldOfStudy.forEach((fieldOfStudy) => {
      if (this.selected.data?.fieldOfStudy && this.selected.data?.fieldOfStudy[fieldOfStudy.key]) {
        fieldOfStudyData[fieldOfStudy.key] = this.selected.data?.fieldOfStudy[fieldOfStudy.key];
        return;
      }
      fieldOfStudyData[fieldOfStudy.key] = (fieldOfStudy.type === 'BOOLEAN' ? false : (fieldOfStudy.type === 'NUMBER' ? 0 : ''));
    });

    const trainingsData: any = {};

    this.trainings.forEach((training) => {
      if (this.selected.data?.trainings && this.selected.data?.trainings[training.key]) {
        trainingsData[training.key] = this.selected.data?.trainings[training.key];
        return;
      }
      trainingsData[training.key] = (training.type === 'BOOLEAN' ? false : (training.type === 'NUMBER' ? 0 : ''));
    });

    this.selectedForm.patchValue(this.selected);

    if (this.selectedFieldOfStudyForm) {
      this.selectedFieldOfStudyForm.patchValue(fieldOfStudyData);
    }
    if (this.selectedTrainingsForm) {
      this.selectedTrainingsForm.patchValue(trainingsData);
    }
    this._changeDetectorRef.markForCheck();
  }

  checkSearch(member: BackendMember) {
    if (this.searchValue !== null || this.searchValue !== undefined && this.searchValue.length !== 0) {
      const value = this.searchValue.toLowerCase();
      const { user } = member;

      if (this.statusFilter === 'ALL') {
        if (/^\d+$/.test(value)) {
          return user.id?.includes(value);
        }
        return `${user.firstName} ${user.lastName}`.toLowerCase().includes(value);
      }

      if (/^\d+$/.test(value)) {
        return user.status === this.statusFilter && user.id?.includes(value);
      }
      return user.status === this.statusFilter && `${user.firstName} ${user.lastName}`.toLowerCase().includes(value);
    }
    if (this.statusFilter === 'ALL') {
      return true;
    }
    return member.user.status === this.statusFilter;
  }

  updateSelected() {
    this.submitted = true;

    const id = this.selected.id;
    const member = this.selectedForm.getRawValue();

    if (!(member.data)) {
      member.data = {};
    }

    if(this.selectedFieldOfStudyForm) {
      const fieldOfStudy = this.selectedFieldOfStudyForm.getRawValue();
      member.data.fieldOfStudy = fieldOfStudy;
    }

    if(this.selectedTrainingsForm) {
      const trainings = this.selectedTrainingsForm.getRawValue();
      member.data.trainings = trainings;
    }

    this._membersService.patch(id, member).subscribe(() => {
      this.showFlashMessage('success');
      this.loadMembers();

      setTimeout(() => {
        this.submitted = false;
      }, 1000 * 2);
    }, () => {
      this.showFlashMessage('error');
    });
  }

  hireMember() {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Mitarbeiter wieder einstellen?',
      message: 'Willst du diesen Mitarbeiter wirklich wieder einstellen?',
      actions: {
        confirm: {
          label: 'Ja, einstellen!'
        },
        cancel: {
          label: 'Nein, abbrechen!'
        }
      }
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.submitted = true;

        this._membersService.hire(this.selected.id).subscribe(() => {
          this.closeEdit();
          this.loadMembers();

          setTimeout(() => {
            this.submitted = false;
          }, 1000 * 2);
        }, () => {
          setTimeout(() => {
            this.submitted = false;
          }, 1000 * 2);
        });
      }
    });
  }

  terminateMember() {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Mitarbeiter kündigen?',
      message: 'Willst du diesen Mitarbeiter wirklich kündigen?',
      actions: {
        confirm: {
          label: 'Ja, kündigen!'
        },
        cancel: {
          label: 'Nein, abbrechen!'
        }
      }
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.submitted = true;

        this._membersService.terminate(this.selected.id).subscribe(() => {
          this.closeEdit();
          this.loadMembers();

          setTimeout(() => {
            this.submitted = false;
          }, 1000 * 2);
        }, () => {
          setTimeout(() => {
            this.submitted = false;
          }, 1000 * 2);
        });
      }
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private loadMembers(init: boolean = false) {
    this._membersService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      if (!(response)) {
        return;
      }
      this.members = [];
      this.terminatedMembers = [];

      this.members = response.filter((x) => x.terminated === false);
      this.terminatedMembers = response.filter((x) => x.terminated === true);

      this.members.sort((a, b) => {
        const groupA = this.groups.find((x) => x.id === a.groupId);
        const groupB = this.groups.find((x) => x.id === b.groupId);

        if (!(groupA) || !(groupB)) {
          return 1;
        }
        return groupB.uniqueId - groupA.uniqueId;
      });
      this.terminatedMembers.sort((a, b) => {
        const groupA = this.groups.find((x) => x.id === a.groupId);
        const groupB = this.groups.find((x) => x.id === b.groupId);

        if (!(groupA) || !(groupB)) {
          return 1;
        }
        return groupB.uniqueId - groupA.uniqueId;
      });

      setTimeout(() => {
        if (init) {
          this.initSort();
          return;
        }
        this.sort();
      }, 500);
    });
  }

  initSort() {
    if (this._sort) {
      this._sort.sort({
        id: 'group',
        start: 'desc',
        disableClear: true
      });
      this.sort();

      this._changeDetectorRef.markForCheck();

      this._sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        this.sort();
        this.closeEdit();
      });
    }
  }

  private sort() {
    switch (this._sort.active) {
      case 'id': {
        this.members.sort((a, b) => {
          const idA = Number(a.user.id);
          const idB = Number(b.user.id);

          return (this._sort.direction === 'asc' ? idA - idB : idB - idA);
        });
        this.terminatedMembers.sort((a, b) => {
          const idA = Number(a.user.id);
          const idB = Number(b.user.id);

          return (this._sort.direction === 'asc' ? idA - idB : idB - idA);
        });
        break;
      }
      case 'fullName': {
        this.members.sort((a, b) => {
          const fullNameA = `${a.user.firstName} ${a.user.lastName}`;
          const fullNameB = `${b.user.firstName} ${b.user.lastName}`;

          return fullNameA.localeCompare(fullNameB) * (this._sort.direction === 'asc' ? 1 : -1);
        });
        this.terminatedMembers.sort((a, b) => {
          const fullNameA = `${a.user.firstName} ${a.user.lastName}`;
          const fullNameB = `${b.user.firstName} ${b.user.lastName}`;

          return fullNameA.localeCompare(fullNameB) * (this._sort.direction === 'asc' ? 1 : -1);
        });
        break;
      }
      case 'group': {
        this.members.sort((a, b) => {
          const groupA = this.groups.find((x) => x.id === a.groupId);
          const groupB = this.groups.find((x) => x.id === b.groupId);

          if (!(groupA) || !(groupB)) {
            return 1;
          }
          return (this._sort.direction === 'asc' ? groupA.uniqueId - groupB.uniqueId : groupB.uniqueId - groupA.uniqueId);
        });
        this.terminatedMembers.sort((a, b) => {
          const groupA = this.groups.find((x) => x.id === a.groupId);
          const groupB = this.groups.find((x) => x.id === b.groupId);

          if (!(groupA) || !(groupB)) {
            return 1;
          }
          return (this._sort.direction === 'asc' ? groupA.uniqueId - groupB.uniqueId : groupB.uniqueId - groupA.uniqueId);
        });
        break;
      }
      case 'status': {
        this.members.sort((a, b) => {
          const statusA = a.user.status;
          const statusB = b.user.status;

          return statusA.localeCompare(statusB) * (this._sort.direction === 'asc' ? 1 : -1);
        });
        this.terminatedMembers.sort((a, b) => {
          const statusA = a.user.status;
          const statusB = b.user.status;

          return statusA.localeCompare(statusB) * (this._sort.direction === 'asc' ? 1 : -1);
        });
        break;
      }
    }
  }


  private showFlashMessage(type: 'success' | 'error'): void {
    this.flashMessage = type;

    this._changeDetectorRef.markForCheck();

    setTimeout(() => {
      this.flashMessage = null;
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }
}
