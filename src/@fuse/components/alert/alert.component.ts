import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { FuseAlertAppearance, FuseAlertType } from '@fuse/components/alert/alert.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fuse-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  exportAs: 'fuseAlert'
})
export class FuseAlertComponent implements OnChanges, OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_dismissible: BooleanInput;
  static ngAcceptInputType_dismissed: BooleanInput;
  static ngAcceptInputType_showIcon: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() appearance: FuseAlertAppearance = 'soft';
  @Input() dismissed: boolean = false;
  @Input() dismissible: boolean = false;
  @Input() name: string = this._fuseUtilsService.randomId();
  @Input() showIcon: boolean = true;
  @Input() type: FuseAlertType = 'primary';
  @Output() readonly dismissedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseAlertService: FuseAlertService,
    private _fuseUtilsService: FuseUtilsService
  ) {
  }

  @HostBinding('class') get classList(): any {
    return {
      'fuse-alert-appearance-border': this.appearance === 'border',
      'fuse-alert-appearance-fill': this.appearance === 'fill',
      'fuse-alert-appearance-outline': this.appearance === 'outline',
      'fuse-alert-appearance-soft': this.appearance === 'soft',
      'fuse-alert-dismissed': this.dismissed,
      'fuse-alert-dismissible': this.dismissible,
      'fuse-alert-show-icon': this.showIcon,
      'fuse-alert-type-primary': this.type === 'primary',
      'fuse-alert-type-accent': this.type === 'accent',
      'fuse-alert-type-warn': this.type === 'warn',
      'fuse-alert-type-basic': this.type === 'basic',
      'fuse-alert-type-info': this.type === 'info',
      'fuse-alert-type-success': this.type === 'success',
      'fuse-alert-type-warning': this.type === 'warning',
      'fuse-alert-type-error': this.type === 'error'
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('dismissed' in changes) {
      this.dismissed = coerceBooleanProperty(changes.dismissed.currentValue);
      this._toggleDismiss(this.dismissed);
    }

    if ('dismissible' in changes) {
      this.dismissible = coerceBooleanProperty(changes.dismissible.currentValue);
    }

    if ('showIcon' in changes) {
      this.showIcon = coerceBooleanProperty(changes.showIcon.currentValue);
    }
  }

  ngOnInit(): void {
    this._fuseAlertService.onDismiss.pipe(filter(name => this.name === name), takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.dismiss();
    });

    this._fuseAlertService.onShow.pipe(filter(name => this.name === name), takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.show();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  dismiss(): void {
    if (this.dismissed) {
      return;
    }
    this._toggleDismiss(true);
  }

  show(): void {
    if (!this.dismissed) {
      return;
    }
    this._toggleDismiss(false);
  }

  private _toggleDismiss(dismissed: boolean): void {
    if (!this.dismissible) {
      return;
    }
    this.dismissed = dismissed;
    this.dismissedChanged.next(this.dismissed);
    this._changeDetectorRef.markForCheck();
  }
}
