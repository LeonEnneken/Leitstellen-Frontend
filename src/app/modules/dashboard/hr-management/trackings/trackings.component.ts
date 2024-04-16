import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { BackendControlCenter, ControlCentersService } from 'app/core/services/control-centers.service';
import { BackendTrackings, BackendTrackingsItem, StatisticsService } from 'app/core/services/statistics.service';
import { UserService } from 'app/core/services/user.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hr-management-trackings',
  templateUrl: './trackings.component.html',
  styleUrls: ['./trackings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class HRManagementTrackingsComponent implements OnInit, OnDestroy {

  private controlCenters: BackendControlCenter[];

  trackings: BackendTrackings[];

  selected: BackendTrackings;

  searchInputControl: FormControl = new FormControl();

  searchValue: string = '';

  flashMessage: 'success' | 'error' | undefined = undefined;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  form: FormGroup;

  range = new FormGroup({
    start: new FormControl(undefined),
    end: new FormControl(undefined),
  });

  loading = false;

  constructor(
    private _controlCentersService: ControlCentersService,
    private _statisticsService: StatisticsService,
    private _userService: UserService,

    private _changeDetectorRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    this.range.controls.start.setValue(startDate);
    this.range.controls.end.setValue(new Date());

    this._controlCentersService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.controlCenters = response;
    });

    this.loadData();

    this.range.valueChanges.subscribe((date) => {
      this.loadData();
    });

    this.searchInputControl.valueChanges.pipe(takeUntil(this._unsubscribeAll), debounceTime(300), switchMap((query) => {
      this.searchValue = query;
      return of(true);
    })).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private loadData() {
    this.loading = true;
    const startDate = new Date(this.range.controls.start.value);
    startDate.setHours(0, 0, 0);

    const endDate = new Date(this.range.controls.end.value);
    endDate.setHours(23, 59, 59);

    this._statisticsService.getTrackings(startDate.getTime(), endDate.getTime()).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.trackings = response;
      this.loading = false;
    }, (error) => {
      this.loading = false;
      console.error(error);
    });
  }

  hasPermission(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  closeEdit() {
    this.selected = undefined;
  }

  toggleEdit(id: string) {
    if (this.selected && this.selected.id === id) {
      this.closeEdit();
      return;
    }
    this.selected = this.trackings.find((x) => x.id === id);
    this._changeDetectorRef.markForCheck();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  checkSearch(tracking: BackendTrackings) {
    if (this.searchValue === null || this.searchValue === undefined || this.searchValue.length === 0)
      return true;
    const value = this.searchValue.toLowerCase();

    if (/^\d+$/.test(value)) {
      return tracking.user.id?.includes(value);
    }
    return `${tracking.user.firstName} ${tracking.user.lastName}`.toLowerCase().includes(value);
  }

  getControlCenter(item: BackendTrackingsItem) {
    const controlCenter = this.controlCenters.find((x) => x.id === item.controlCenterId);

    if (!(controlCenter))
      return 'Nicht gefunden..';
    return controlCenter.label;
  }

  getTimeSum(item: BackendTrackings) {
    return this.getTime(item.totalTime);
  }

  getTime(startTime: number) {
    if (!(startTime) || startTime === 0) {
      return 'Keine Zeit..';
    }
    const time = startTime / 1000;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 3600 % 60);

    let timeString = '';

    timeString += `${hours} Stunde${hours === 1 ? '' : 'n'}, `;
    timeString += `${minutes} Minute${minutes === 1 ? '' : 'n'}, `;
    timeString += `${seconds} Sekunde${seconds === 1 ? '' : 'n'}`;

    return timeString;
  }

}
