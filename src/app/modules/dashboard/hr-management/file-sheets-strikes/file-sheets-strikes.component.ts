import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileSheetStrikesItemResponse, FileSheetStrikesResponse, FileSheetsService } from 'app/core/services/file-sheets.service';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import { UserService } from 'app/core/services/user.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hr-management-file-sheets-strikes',
  templateUrl: './file-sheets-strikes.component.html',
  styleUrls: ['./file-sheets-strikes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HRManagementFileSheetsStrikesComponent implements OnInit, OnDestroy {

  flashMessage: 'success' | 'error' = undefined;

  groups: BackendGroup[] = [];

  strikes: FileSheetStrikesResponse[] = [];

  searchInputControl: FormControl = new FormControl();

  searchValue: string = '';

  selected: FileSheetStrikesResponse;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _fileSheetsService: FileSheetsService,
    private _groupsService: GroupsService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this._groupsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response;
    });

    this.loadStrikes();

    this.searchInputControl.valueChanges.pipe(takeUntil(this._unsubscribeAll), debounceTime(300), switchMap((query) => {
      this.searchValue = query;
      return of(true);
    })).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  hasPermissions(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  getStrikes() {
    return this.strikes.filter((x) => x.target.terminated === false);
  }

  getTerminatedStrikes() {
    return this.strikes.filter((x) => x.target.terminated === true);
  }

  closeEdit() {
    this.selected = null;
  }

  toggleEdit(id: string) {
    if (this.selected && this.selected.id === id) {
      this.closeEdit();
      return;
    }
    this.selected = this.strikes.find((x) => x.id === id);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  search(item: any) {
    if (this.searchValue === undefined || this.searchValue === null) {
      return true;
    }
    if (this.searchValue.trim().length === 0) {
      return true;
    }
    const value = this.searchValue.toLowerCase();
    return item.title.toLowerCase().includes(value) || item.reason.toLowerCase().includes(value);
  }

  getGroup(groupId: string) {
    const group = this.groups.find((x) => x.id === groupId);

    if (!(group)) {
      return '';
    }
    return `${group.uniqueId}. ${group.name}`;
  }

  getSelectedGroup() {
    if (!(this.selected)) {
      return '';
    }
    const group = this.groups.find((x) => x.id === this.selected.target.groupId);

    if (!(group)) {
      return '';
    }
    return `${group.uniqueId}. ${group.name}`;
  }

  getName() {
    if (!(this.selected)) {
      return '';
    }
    return `${this.selected.target.firstName} ${this.selected.target.lastName}`;
  }

  getReason(item: FileSheetStrikesItemResponse) {
    if (!(item)) {
      return '';
    }
    return `${item.title}`;
  }

  private loadStrikes() {
    this._fileSheetsService.getStrikes().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.strikes = response;
    });
  }

}
