import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FSDocument, FSDocumentElement } from '@fuse/components/fullscreen/fullscreen.types';

@Component({
  selector: 'fuse-fullscreen',
  templateUrl: './fullscreen.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'fuseFullscreen'
})
export class FuseFullscreenComponent implements OnInit {
  @Input() iconTpl: TemplateRef<any>;
  @Input() tooltip: string;
  private _fsDoc: FSDocument;
  private _fsDocEl: FSDocumentElement;
  private _isFullscreen: boolean = false;

  constructor(@Inject(DOCUMENT) private _document: Document) {
    this._fsDoc = _document as FSDocument;
  }

  ngOnInit(): void {
    this._fsDocEl = document.documentElement as FSDocumentElement;
  }

  toggleFullscreen(): void {
    this._isFullscreen = this._getBrowserFullscreenElement() !== null;

    if (this._isFullscreen) {
      this._closeFullscreen();
    } else {
      this._openFullscreen();
    }
  }

  private _getBrowserFullscreenElement(): Element {
    if (typeof this._fsDoc.fullscreenElement !== 'undefined') {
      return this._fsDoc.fullscreenElement;
    }

    if (typeof this._fsDoc.mozFullScreenElement !== 'undefined') {
      return this._fsDoc.mozFullScreenElement;
    }

    if (typeof this._fsDoc.msFullscreenElement !== 'undefined') {
      return this._fsDoc.msFullscreenElement;
    }

    if (typeof this._fsDoc.webkitFullscreenElement !== 'undefined') {
      return this._fsDoc.webkitFullscreenElement;
    }

    throw new Error('Fullscreen mode is not supported by this browser');
  }

  private _openFullscreen(): void {
    if (this._fsDocEl.requestFullscreen) {
      this._fsDocEl.requestFullscreen();
      return;
    }

    if (this._fsDocEl.mozRequestFullScreen) {
      this._fsDocEl.mozRequestFullScreen();
      return;
    }

    if (this._fsDocEl.webkitRequestFullscreen) {
      this._fsDocEl.webkitRequestFullscreen();
      return;
    }

    if (this._fsDocEl.msRequestFullscreen) {
      this._fsDocEl.msRequestFullscreen();
      return;
    }
  }

  private _closeFullscreen(): void {
    if (this._fsDoc.exitFullscreen) {
      this._fsDoc.exitFullscreen();
      return;
    }

    if (this._fsDoc.mozCancelFullScreen) {
      this._fsDoc.mozCancelFullScreen();
      return;
    }

    if (this._fsDoc.webkitExitFullscreen) {
      this._fsDoc.webkitExitFullscreen();
      return;
    }

    else if (this._fsDoc.msExitFullscreen) {
      this._fsDoc.msExitFullscreen();
      return;
    }
  }
}
