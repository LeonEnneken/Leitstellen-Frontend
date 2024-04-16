import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FuseDrawerService } from '@fuse/components/drawer/drawer.service';
import { FuseDrawerMode, FuseDrawerPosition } from '@fuse/components/drawer/drawer.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';

@Component({
  selector: 'fuse-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseDrawer'
})
export class FuseDrawerComponent implements OnChanges, OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_fixed: BooleanInput;
  static ngAcceptInputType_opened: BooleanInput;
  static ngAcceptInputType_transparentOverlay: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() fixed: boolean = false;
  @Input() mode: FuseDrawerMode = 'side';
  @Input() name: string = this._fuseUtilsService.randomId();
  @Input() opened: boolean = false;
  @Input() position: FuseDrawerPosition = 'left';
  @Input() transparentOverlay: boolean = false;
  @Output() readonly fixedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly modeChanged: EventEmitter<FuseDrawerMode> = new EventEmitter<FuseDrawerMode>();
  @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly positionChanged: EventEmitter<FuseDrawerPosition> = new EventEmitter<FuseDrawerPosition>();

  private _animationsEnabled: boolean = false;
  private _hovered: boolean = false;
  private _overlay: HTMLElement;
  private _player: AnimationPlayer;

  constructor(
    private _animationBuilder: AnimationBuilder,
    private _elementRef: ElementRef,
    private _renderer2: Renderer2,
    private _fuseDrawerService: FuseDrawerService,
    private _fuseUtilsService: FuseUtilsService
  ) {
  }

  @HostBinding('class') get classList(): any {
    return {
      'fuse-drawer-animations-enabled': this._animationsEnabled,
      'fuse-drawer-fixed': this.fixed,
      'fuse-drawer-hover': this._hovered,
      [`fuse-drawer-mode-${this.mode}`]: true,
      'fuse-drawer-opened': this.opened,
      [`fuse-drawer-position-${this.position}`]: true
    };
  }

  @HostBinding('style') get styleList(): any {
    return {
      'visibility': this.opened ? 'visible' : 'hidden'
    };
  }

  @HostListener('mouseenter')
  private _onMouseenter(): void {
    this._enableAnimations();
    this._hovered = true;
  }

  @HostListener('mouseleave')
  private _onMouseleave(): void {
    this._enableAnimations();
    this._hovered = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('fixed' in changes) {
      this.fixed = coerceBooleanProperty(changes.fixed.currentValue);
      this.fixedChanged.next(this.fixed);
    }

    if ('mode' in changes) {
      const previousMode = changes.mode.previousValue;
      const currentMode = changes.mode.currentValue;

      this._disableAnimations();

      if (previousMode === 'over' && currentMode === 'side') {
        this._hideOverlay();
      }

      if (previousMode === 'side' && currentMode === 'over') {
        if (this.opened) {
          this._showOverlay();
        }
      }

      this.modeChanged.next(currentMode);

      setTimeout(() => {
        this._enableAnimations();
      }, 500);
    }

    if ('opened' in changes) {
      const open = coerceBooleanProperty(changes.opened.currentValue);
      this._toggleOpened(open);
    }

    if ('position' in changes) {
      this.positionChanged.next(this.position);
    }

    if ('transparentOverlay' in changes) {
      this.transparentOverlay = coerceBooleanProperty(changes.transparentOverlay.currentValue);
    }
  }

  ngOnInit(): void {
    this._fuseDrawerService.registerComponent(this.name, this);
  }

  ngOnDestroy(): void {
    if (this._player) {
      this._player.finish();
    }
    this._fuseDrawerService.deregisterComponent(this.name);
  }

  open(): void {
    if (this.opened) {
      return;
    }
    this._toggleOpened(true);
  }

  close(): void {
    if (!this.opened) {
      return;
    }
    this._toggleOpened(false);
  }

  toggle(): void {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  private _enableAnimations(): void {
    if (this._animationsEnabled) {
      return;
    }
    this._animationsEnabled = true;
  }

  private _disableAnimations(): void {
    if (!this._animationsEnabled) {
      return;
    }
    this._animationsEnabled = false;
  }

  private _showOverlay(): void {
    this._overlay = this._renderer2.createElement('div');

    if (!this._overlay) {
      return;
    }

    this._overlay.classList.add('fuse-drawer-overlay');

    if (this.fixed) {
      this._overlay.classList.add('fuse-drawer-overlay-fixed');
    }

    if (this.transparentOverlay) {
      this._overlay.classList.add('fuse-drawer-overlay-transparent');
    }

    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);

    this._player = this._animationBuilder.build([
      style({ opacity: 0 }),
      animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))
    ]).create(this._overlay);

    this._player.onDone(() => {
      this._player.destroy();
      this._player = null;
    });

    this._player.play();

    this._overlay.addEventListener('click', () => {
      this.close();
    });
  }

  private _hideOverlay(): void {
    if (!this._overlay) {
      return;
    }

    this._player = this._animationBuilder.build([
      animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))
    ]).create(this._overlay);

    this._player.play();

    this._player.onDone(() => {
      this._player.destroy();
      this._player = null;

      if (this._overlay) {
        this._overlay.parentNode.removeChild(this._overlay);
        this._overlay = null;
      }
    });
  }

  private _toggleOpened(open: boolean): void {
    this.opened = open;

    this._enableAnimations();

    if (this.mode === 'over') {
      if (open) {
        this._showOverlay();
      } else {
        this._hideOverlay();
      }
    }

    this.openedChanged.next(open);
  }
}
