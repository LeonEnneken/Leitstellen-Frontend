import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RadioCodesService } from 'app/core/services/radio-codes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'radio-codes',
  templateUrl: './radio-codes.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'radio-codes'
})
export class RadioCodesComponent implements OnInit, OnDestroy {

  @ViewChild('radioCodesOrigin') private radioCodesOrigin: MatButton;

  @ViewChild('radioCodesPanel') private radioCodesPanel: TemplateRef<any>;

  private _overlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  radioCodes: any[];

  constructor(
    private _radioCodeService: RadioCodesService,

    private _changeDetectorRef: ChangeDetectorRef,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    this._radioCodeService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.radioCodes = response;
      this._changeDetectorRef.markForCheck();
    });
    this._radioCodeService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
  }

  openPanel(): void {
    if (!this.radioCodesPanel || !this.radioCodesOrigin) {
      return;
    }
    if (!this._overlayRef) {
      this._createOverlay();
    }
    this._overlayRef.attach(new TemplatePortal(this.radioCodesPanel, this._viewContainerRef));
  }

  closePanel(): void {
    this._overlayRef.detach();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private _createOverlay(): void {
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      backdropClass: 'fuse-backdrop-on-mobile',
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this.radioCodesOrigin._elementRef.nativeElement)
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }, {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        }, {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }, {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }])
    });

    this._overlayRef.backdropClick().subscribe(() => {
      this._overlayRef.detach();
    });
  }
  
  getRadioCodeStyle(radioCode: any) {
    return {
      'bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-50': radioCode.type === 'INFO',
      'bg-accent-200 text-accent-800 dark:bg-accent-600 dark:text-accent-50': radioCode.type === 'NORMAL',
      'bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-50': radioCode.type === 'WARN'
    }
  }

}
