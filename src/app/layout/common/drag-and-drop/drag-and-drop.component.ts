import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/public-api';
import { BackendUpload, UploadService } from 'app/core/services/upload.service';
import { UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  animations: fuseAnimations
})
export class DragAndDropComponent implements OnInit, OnDestroy {

  @Input() currentUri: string;

  @Output() selected: EventEmitter<BackendUpload> = new EventEmitter();

  uploaded: BackendUpload;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  flashMessage: { type: 'success' | 'error' | undefined, message: string } = {
    type: undefined,
    message: ''
  };

  submitted = false;

  constructor(
    private _uploadService: UploadService,
    private _userService: UserService,
    private _changeDetector: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    if (!(this.currentUri))
      return;
    this.uploaded = {
      uri: this.currentUri,
      fileName: '',
      size: 0
    };
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  fileBrowseHandler(files: FileList) {
    if (!(this._userService.hasPermissions('UPLOAD_FILE'))) {
      this.showFlashMessage('error', 'Du hast keine Berechtigung etwas hochzuladen!');
      return;
    }
    this.submitted = true;

    const formData = new FormData();
    formData.append('file', files[0], files[0].name);

    this._uploadService.upload(formData).subscribe((response) => {
      this.uploaded = response;
      this.selected.emit(response);
      this.submitted = false;
      this._changeDetector.markForCheck();
    }, (error) => {
      this.showFlashMessage('error', 'Es ist ein Fehler aufgetreten. Versuche es später erneut!');
      console.error(error);
      this.submitted = false;
      this._changeDetector.markForCheck();
    });
  }

  delete() {
    this.selected.emit(undefined);
    this.uploaded = undefined;
  }

  private showFlashMessage(type: 'success' | 'error' | undefined, message: string) {
    this.flashMessage = {
      type: type,
      message: message
    };
    this._changeDetector.markForCheck();

    setTimeout(() => {
      this.flashMessage = {
        type: undefined,
        message: ''
      };
      this._changeDetector.markForCheck();
    }, 1000 * 3);
  }

}
