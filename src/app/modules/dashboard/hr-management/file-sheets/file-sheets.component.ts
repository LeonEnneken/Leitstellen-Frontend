import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BackendFileSheet, FileSheetsService } from 'app/core/services/file-sheets.service';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import { BackendPunishment, PunishmentsService } from 'app/core/services/punishments.service';
import { BackendUserSearch, UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Punishment {
  label: string;
  value: string;
}

@Component({
  selector: 'hr-management-file-sheets',
  templateUrl: './file-sheets.component.html',
  styleUrls: ['./file-sheets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HRManagementFileSheetsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  flashMessage: 'success' | 'error' = undefined;

  groups: BackendGroup[];
  punishments: BackendPunishment[];

  formPunishments: Punishment[];

  fileSheets: BackendFileSheet[];
  approvedFileSheets: BackendFileSheet[];

  searchInputControl: FormControl = new FormControl();

  selectedTargetUser: BackendUserSearch;
  selectedFileSheet: BackendFileSheet;

  fileSheetForm: FormGroup;
  selectedForm: FormGroup;

  showForm = false;

  constructor(
    private _fileSheetsService: FileSheetsService,
    private _groupsService: GroupsService,
    private _punishmentsService: PunishmentsService,
    private _userService: UserService,

    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService
  ) {

  }

  ngOnInit(): void {
    this.fileSheetForm = this._formBuilder.group({
      targetId: ['', Validators.required],
      punishmentId: ['', Validators.required],
      punishmentStage: [0, Validators.required],
      strikes: [0, Validators.required],
      additionalPunishment: ['', Validators.required],
      notes: ['']
    });

    this.fileSheetForm.controls.punishmentStage.disable();
    this.fileSheetForm.controls.strikes.disable();
    this.fileSheetForm.controls.additionalPunishment.disable();

    this.fileSheetForm.get('punishmentId').valueChanges.subscribe(() => {
      this.fileSheetForm.controls.punishmentStage.enable();
    });

    this.fileSheetForm.get('punishmentStage').valueChanges.subscribe((stage) => {
      const items = this.punishments.flatMap((x) => x.items);

      if (!(items)) {
        return;
      }
      const item = items.find((x) => x.id === stage);

      if (!(item)) {
        return;
      }
      this.fileSheetForm.controls.strikes.setValue(item.strikes);
      this.fileSheetForm.controls.strikes.enable();

      this.fileSheetForm.controls.additionalPunishment.setValue(item.additionalPunishment);
      this.fileSheetForm.controls.additionalPunishment.enable();
    });

    this.selectedForm = this._formBuilder.group({
      targetId: ['', Validators.required],
      targetName: ['', Validators.required],
      groupName: ['', Validators.required],
      title: ['', Validators.required],
      strikes: [0, Validators.required],
      additionalPunishment: ['', Validators.required],
      additionalPunishmentFinished: [false],
      notes: ['']
    });

    this.selectedForm.controls.targetId.disable();
    this.selectedForm.controls.targetName.disable();
    this.selectedForm.controls.groupName.disable();
    this.selectedForm.controls.title.disable();

    this._groupsService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response;
    });
    this._punishmentsService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      const items: Punishment[] = [];

      response.forEach((category) => {
        category.punishments.forEach((punishment) => {
          items.push({
            label: `${category.uniqueId}.${punishment.uniqueId}. ${punishment.description}`,
            value: punishment.id
          });
        });
      });
      this.formPunishments = items;
      this.punishments = response.flatMap((x) => x.punishments);
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
    if (!(this.hasPermissions('FILE_SHEETS_MANAGE'))) {
      return;
    }
    if (this.selectedFileSheet && this.selectedFileSheet.id === fileSheet.id) {
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
      notes: fileSheet.notes
    });
  }

  selectTargetUser(user: BackendUserSearch) {
    this.selectedTargetUser = user;
    this.fileSheetForm.controls.targetId.setValue(user.id);
  }

  getTargetGroup() {
    if (!(this.selectedTargetUser)) {
      return '';
    }
    const group = this.groups.find((x) => x.id === this.selectedTargetUser.groupId);

    if (!(group)) {
      return 'Nicht gefunden.';
    }
    return `${group.uniqueId}. ${group.name}`;
  }

  getPunishmentItems() {
    const punishmentId = this.fileSheetForm.controls.punishmentId.value;

    if (!(punishmentId)) {
      return [];
    }
    const punishment = this.punishments.find((x) => x.id === punishmentId);

    if (!(punishment)) {
      return [];
    }
    return punishment.items;
  }

  postFileSheet() {
    if (this.fileSheetForm.invalid) {
      return;
    }
    if (!(this.selectedTargetUser)) {
      return;
    }
    const data = this.fileSheetForm.getRawValue();

    this._fileSheetsService.post(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.fileSheetForm.controls.targetId.setValue(undefined);
      this.fileSheetForm.controls.notes.setValue(undefined);

      this.fileSheetForm.controls.strikes.disable();
      this.fileSheetForm.controls.additionalPunishment.disable();


      this.showFlashMessage('success');
      this.loadFileSheets();
    }, (error) => {
      console.error(error);
    });
  }

  saveFileSheet() {
    if (this.selectedForm.invalid) {
      return;
    }
    if (!(this.selectedFileSheet)) {
      return;
    }
    const {
      strikes,
      additionalPunishment,
      additionalPunishmentFinished,
      notes
    } = this.selectedForm.getRawValue();

    this._fileSheetsService.patch(this.selectedFileSheet.id, {
      strikes: strikes,
      additionalPunishment: additionalPunishment,
      additionalPunishmentFinished: additionalPunishmentFinished,
      notes: notes
    }).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.showFlashMessage('success');
      this.loadFileSheets();
    }, (error) => {
      this.showFlashMessage('error');
      console.error(error);
    });
  }

  approveFileSheet() {
    if (!(this.selectedFileSheet)) {
      return;
    }
    this._fileSheetsService.approve(this.selectedFileSheet.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.closeEdit();
      this.loadFileSheets();
    }, (error) => {
      console.error(error);
    });
  }

  cancelFileSheet() {
    if (!(this.selectedFileSheet)) {
      return;
    }

    const confirmation = this._fuseConfirmationService.open({
      title: 'Akte stornieren?',
      message: 'Willst du diese Akte wirklich stornieren?',
      actions: {
        confirm: {
          label: 'Ja, Akte stornieren!'
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
      this._fileSheetsService.cancel(this.selectedFileSheet.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        this.closeEdit();
        this.loadFileSheets();
      }, (error) => {
        console.error(error);
      });
    });
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
    this._fileSheetsService.getAll('NOT_APPROVED').pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.fileSheets = response;
    });
    this._fileSheetsService.getAll('APPROVED').pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.approvedFileSheets = response;
    });
  }

  private showFlashMessage(type: 'success' | 'error'): void {
    this.flashMessage = type;

    this._changeDetectorRef.markForCheck();

    setTimeout(() => {
      this.flashMessage = undefined;
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }

}
