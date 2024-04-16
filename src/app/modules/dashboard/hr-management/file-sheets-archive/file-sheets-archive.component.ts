import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BackendFileSheet, FileSheetsService } from 'app/core/services/file-sheets.service';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import { UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hr-management-file-sheets-archive',
  templateUrl: './file-sheets-archive.component.html',
  styleUrls: ['./file-sheets-archive.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HRManagementFileSheetsArchiveComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  flashMessage: 'success' | 'error' = undefined;

  groups: BackendGroup[];

  fileSheets: BackendFileSheet[];

  searchInputControl: FormControl = new FormControl();

  selectedFileSheet: BackendFileSheet;

  selectedForm: FormGroup;

  constructor(
    private _fileSheetsService: FileSheetsService,
    private _groupsService: GroupsService,
    private _userService: UserService,

    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService
  ) {

  }

  ngOnInit(): void {
    this.selectedForm = this._formBuilder.group({
      targetId: ['', Validators.required],
      targetName: ['', Validators.required],
      groupName: ['', Validators.required],
      title: ['', Validators.required],
      strikes: [0, Validators.required],
      additionalPunishment: ['', Validators.required],
      additionalPunishmentFinished: [false],
      canceled: [false],
      notes: ['']
    });

    this.selectedForm.disable();

    this._groupsService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response;
    });

    this.loadFileSheets();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  hasPermissions(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  closeEdit() {
    this.selectedFileSheet = undefined;
  }

  toggleEdit(fileSheet: BackendFileSheet) {
    if(this.selectedFileSheet && this.selectedFileSheet.id === fileSheet.id) {
      this.closeEdit();
      return;
    }
    this.selectedFileSheet = fileSheet;

    const group = this.groups.find((x) => x.id === fileSheet.target.groupId);

    this.selectedForm.patchValue({
      targetId: fileSheet.target.id,
      targetName: `${fileSheet.target.firstName} ${fileSheet.target.lastName}`,
      groupName: (group ? `${group.uniqueId}. ${group.name}` : 'Nicht gefunden..'),
      title: fileSheet.title,
      strikes: fileSheet.strikes,
      additionalPunishment: fileSheet.additionalPunishment,
      additionalPunishmentFinished: fileSheet.additionalPunishmentFinished,
      canceled: fileSheet.canceled,
      notes: fileSheet.notes
    });
    this.selectedForm.disable();
  }

  deleteFileSheet() {
    if (!(this.selectedFileSheet)) {
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Akte löschen?',
      message: 'Willst du diese Akte wirklich löschen?',
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
      if (result !== 'confirmed') {
        return;
      }
      this._fileSheetsService.delete(this.selectedFileSheet.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        this.loadFileSheets();
      }, (error) => {
        console.error(error);
      });
    });
  }

  private loadFileSheets() {
    this._fileSheetsService.getAll('FINISHED').pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.fileSheets = response;
    });
  }

}
